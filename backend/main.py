import os
import re
import logging
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_guard_backend")

try:
    from backend.services.humanizer_service import (
        RewriteStyle,
        RewriteStrength,
        get_humanizer_provider,
        get_humanizer_status,
        perform_content_integrity_review,
        ProviderException,
        ProviderNotConfiguredError,
        ProviderAuthError,
        ProviderQuotaError,
        ProviderTimeoutError
    )
except ImportError:
    from services.humanizer_service import (
        RewriteStyle,
        RewriteStrength,
        get_humanizer_provider,
        get_humanizer_status,
        perform_content_integrity_review,
        ProviderException,
        ProviderNotConfiguredError,
        ProviderAuthError,
        ProviderQuotaError,
        ProviderTimeoutError
    )

# Resolve model path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL_PATH = os.path.join(BASE_DIR, "models", "ai_guard_baseline.joblib")
MODEL_PATH = os.getenv("MODEL_PATH", DEFAULT_MODEL_PATH)

# Global model state
app_state = {
    "model": None,
    "model_loaded": False,
    "model_error": None,
    "vocab_size": None,
    "classes": None,
    "steps": []
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the scikit-learn model once on application startup."""
    logger.info(f"Checking for model file at: {MODEL_PATH}")
    if not os.path.exists(MODEL_PATH):
        app_state["model_error"] = f"Model file not found at {MODEL_PATH}"
        logger.error(app_state["model_error"])
    else:
        try:
            model = joblib.load(MODEL_PATH)
            app_state["model"] = model
            app_state["model_loaded"] = True
            
            # Inspect pipeline structure
            if hasattr(model, "named_steps"):
                app_state["steps"] = list(model.named_steps.keys())
                if "tfidf" in model.named_steps and hasattr(model.named_steps["tfidf"], "vocabulary_"):
                    app_state["vocab_size"] = len(model.named_steps["tfidf"].vocabulary_)
                
                # Check classifier step (named 'classifier' or 'clf')
                clf_step = model.named_steps.get("classifier") or model.named_steps.get("clf")
                if clf_step and hasattr(clf_step, "classes_"):
                    app_state["classes"] = [int(c) for c in clf_step.classes_]
            
            logger.info(f"Model successfully loaded. Steps: {app_state['steps']}, Classes: {app_state['classes']}")
        except Exception as e:
            app_state["model_error"] = f"Failed to load model: {str(e)}"
            logger.exception("Error loading model pipeline")
            
    yield
    app_state["model"] = None
    app_state["model_loaded"] = False

app = FastAPI(
    title="AI-Guard Inference API",
    description="Backend inference service for AI-Generated Text Detection using the HC3-trained baseline model.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class PredictRequest(BaseModel):
    text: str = Field(..., description="Text passage to evaluate for AI generation (minimum 20 characters)")
    include_sentence_analysis: Optional[bool] = Field(
        default=True,
        description="Whether to perform sentence-level baseline inference"
    )

class SentenceScore(BaseModel):
    sentence: str
    label: int
    ai_probability: float
    is_experimental: bool = True
    note: str

class TextMetrics(BaseModel):
    word_count: int
    character_count: int
    sentence_count: int
    avg_sentence_length: float

class PredictResponse(BaseModel):
    prediction: str
    label: int
    ai_probability: float
    human_probability: float
    confidence_score: float
    metrics: TextMetrics
    sentence_analysis: List[SentenceScore]
    disclaimer: str
    model_info: dict

# --- Humanizer Studio Schemas ---
class HumanizeRequest(BaseModel):
    text: str = Field(..., description="Original text passage to humanize (10 to 15,000 characters)")
    style: RewriteStyle = Field(default=RewriteStyle.NATURAL, description="Target rewrite style")
    strength: RewriteStrength = Field(default=RewriteStrength.BALANCED, description="Rewrite strength")

class IntegrityReviewResponse(BaseModel):
    status: str
    verified_citations: List[str]
    missing_citations: List[str]
    verified_numbers: List[str]
    missing_numbers: List[str]
    total_citations_checked: int
    total_numbers_checked: int
    integrity_notes: List[str]

class HumanizeResponse(BaseModel):
    original_text: str
    rewritten_text: str
    style: str
    strength: str
    provider_info: dict
    integrity_review: IntegrityReviewResponse
    disclaimer: str

class ConfigureProviderRequest(BaseModel):
    provider: str = Field(default="gemini", description="Provider name: 'gemini' or 'openai'")
    api_key: str = Field(..., description="API Key for the provider")
    model_name: Optional[str] = Field(default=None, description="Optional custom model name")

# --- Utility Functions ---
def clean_and_segment(text: str):
    clean_text = re.sub(r'\s+', ' ', text).strip()
    words = clean_text.split()
    # Sentence splitting by punctuation
    raw_sentences = re.split(r'(?<=[.?!])\s+', clean_text)
    sentences = [s.strip() for s in raw_sentences if len(s.strip()) > 0]
    
    avg_len = round(len(words) / max(1, len(sentences)), 1)
    metrics = TextMetrics(
        word_count=len(words),
        character_count=len(clean_text),
        sentence_count=max(1, len(sentences)),
        avg_sentence_length=avg_len
    )
    return clean_text, sentences, metrics

# --- Endpoints ---
@app.get("/")
def get_root():
    return {
        "service": "AI-Guard Inference API",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/health",
        "predict_url": "/predict",
        "humanizer_status_url": "/humanizer/status",
        "humanizer_rewrite_url": "/humanizer/rewrite"
    }

@app.get("/health")
def health_check():
    if not app_state["model_loaded"]:
        return {
            "status": "degraded",
            "model_loaded": False,
            "error": app_state["model_error"] or "Model not loaded",
            "model_path": MODEL_PATH
        }
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_type": "scikit-learn Pipeline (TfidfVectorizer + LogisticRegression)",
        "pipeline_steps": app_state["steps"],
        "vocabulary_size": app_state["vocab_size"],
        "classes": app_state["classes"],
        "label_mapping": {
            0: "Human-Written",
            1: "AI-Generated"
        },
        "model_path": MODEL_PATH
    }

@app.post("/predict", response_model=PredictResponse)
def predict_text(request: PredictRequest):
    if not app_state["model_loaded"] or app_state["model"] is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI-Guard model is not available: {app_state['model_error'] or 'Model not loaded'}"
        )
    
    raw_text = request.text
    if not raw_text or not raw_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty or whitespace only."
        )
    
    clean_text, sentences, metrics = clean_and_segment(raw_text)
    
    if metrics.word_count < 5 or len(clean_text) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Text is too short for statistical analysis ({metrics.word_count} words). Minimum 5 words required."
        )
    
    model = app_state["model"]
    
    try:
        # Full text document inference
        pred_array = model.predict([clean_text])
        pred_label = int(pred_array[0])
        
        # Probabilities
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba([clean_text])[0]
            prob_human = float(probs[0])
            prob_ai = float(probs[1])
        else:
            # Fallback if probability not supported
            prob_ai = 1.0 if pred_label == 1 else 0.0
            prob_human = 1.0 - prob_ai
            
        # Confidence score: Distance from the uninformative boundary (0.5) scaled to [0, 1]
        confidence = round(abs(prob_ai - 0.50) * 2.0, 4)
        
        # Optional experimental sentence-level inference using the same model
        sentence_analysis: List[SentenceScore] = []
        if request.include_sentence_analysis and sentences:
            for s in sentences:
                s_words = s.split()
                if len(s_words) >= 3 and hasattr(model, "predict_proba"):
                    s_probs = model.predict_proba([s])[0]
                    s_ai = round(float(s_probs[1]), 4)
                    s_label = int(s_probs[1] >= 0.5)
                else:
                    s_ai = round(prob_ai, 4)
                    s_label = pred_label
                    
                sentence_analysis.append(SentenceScore(
                    sentence=s,
                    label=s_label,
                    ai_probability=s_ai,
                    is_experimental=True,
                    note="Experimental sentence-level inference via document-level TF-IDF model."
                ))
                
        return PredictResponse(
            prediction="AI-Generated" if pred_label == 1 else "Human-Written",
            label=pred_label,
            ai_probability=round(prob_ai, 4),
            human_probability=round(prob_human, 4),
            confidence_score=confidence,
            metrics=metrics,
            sentence_analysis=sentence_analysis,
            disclaimer="Probabilistic estimate for academic research evaluation only. Does not prove authorship.",
            model_info={
                "architecture": "TfidfVectorizer + LogisticRegression",
                "trained_dataset": "Hello-SimpleAI/HC3",
                "label_schema": {"0": "Human-Written", "1": "AI-Generated"},
                "vocabulary_size": app_state["vocab_size"]
            }
        )
        
    except Exception as e:
        logger.exception("Inference error during predict_text")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference processing error: {str(e)}"
        )

# --- Humanizer Studio Endpoints ---
@app.get("/humanizer/status")
def get_humanizer_config_status():
    """Returns current GenAI provider configuration status without leaking keys."""
    return get_humanizer_status()

@app.post("/humanizer/rewrite", response_model=HumanizeResponse)
def rewrite_text(request: HumanizeRequest):
    raw_text = request.text
    if not raw_text or not raw_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty or whitespace only."
        )

    clean_text = raw_text.strip()
    if len(clean_text) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text is too short. Minimum 10 characters required for humanization."
        )

    if len(clean_text) > 15000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Input text exceeds the 15,000 character limit ({len(clean_text)} characters). Please segment your document into smaller sections."
        )

    try:
        provider = get_humanizer_provider()
    except ProviderNotConfiguredError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"GenAI Provider Not Configured: {e.message}. Please configure GEMINI_API_KEY or OPENAI_API_KEY in your backend environment."
        )

    try:
        rewritten_text, provider_meta = provider.rewrite(
            clean_text,
            style=request.style,
            strength=request.strength
        )
    except ProviderAuthError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"GenAI Authentication Error: {e.message}"
        )
    except ProviderQuotaError as e:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"GenAI Provider Quota / Rate Limit: {e.message}"
        )
    except ProviderTimeoutError as e:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"GenAI Provider Timeout: {e.message}"
        )
    except ProviderException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=f"GenAI Provider Error: {e.message}"
        )
    except Exception as e:
        logger.exception("Unexpected error during GenAI rewrite")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected rewrite processing error: {str(e)}"
        )

    # Perform automated Content Integrity Review
    integrity_data = perform_content_integrity_review(clean_text, rewritten_text)

    return HumanizeResponse(
        original_text=clean_text,
        rewritten_text=rewritten_text,
        style=request.style.value if hasattr(request.style, "value") else str(request.style),
        strength=request.strength.value if hasattr(request.strength, "value") else str(request.strength),
        provider_info=provider_meta,
        integrity_review=IntegrityReviewResponse(**integrity_data),
        disclaimer="AI-Guard Humanizer transforms stylistic presentation and flow while aiming to preserve semantic meaning and citations. Statistical detector scores may vary and do not serve as proof of human authorship."
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
