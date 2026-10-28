# AI-Guard: A Robust AI-Generated Text Detection and Analysis System

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**AI-Guard** is an academic research system designed to evaluate, benchmark, and analyze the capabilities, limitations, and vulnerabilities of AI-generated text detection algorithms.

> [!IMPORTANT]
> **Probabilistic Disclaimer:** All predictions provided by AI-Guard represent **statistical likelihood estimates** and cannot definitively prove authorship or origin. The baseline classifier is trained on the HC3 dataset using an L2-regularized logistic regression model over TF-IDF n-grams.

---

## System Architecture

```text
RobustAi/
├── backend/                             # Python FastAPI Inference Backend
│   ├── main.py                          # Endpoints: /health, /predict, /humanizer/status, /humanizer/rewrite
│   ├── requirements.txt                 # Backend dependencies (fastapi, scikit-learn, google-genai, etc.)
│   ├── services/
│   │   └── humanizer_service.py         # Modular GenAI providers (Gemini, OpenAI), prompt engine, integrity review
│   ├── tests/
│   │   └── test_humanizer.py            # Automated test suite (18 unit/integration tests)
│   └── models/
│       └── ai_guard_baseline.joblib     # Trained model pipeline (TF-IDF + LogisticRegression)
├── src/                                 # React + Vite Frontend
│   ├── pages/
│   │   ├── TextDetector.jsx             # Live text analysis calling /predict
│   │   ├── HumanizerStudio.jsx          # GenAI Humanizer Studio with diff & analytics
│   │   ├── ModelComparison.jsx          # Architecture trade-offs & reference comparisons
│   │   ├── RobustnessTesting.jsx        # Adversarial evasion benchmark lab
│   │   └── AboutResearch.jsx            # Research whitepaper, objectives & ethics
│   ├── components/                      # Common & layout UI components
│   ├── utils/
│   │   ├── diffUtils.js                 # Word-level LCS diff calculation
│   │   └── textAnalysis.js              # Stylometrics & writing analytics formulas
│   └── data/                            # Standardized text corpora & humanizer samples
├── .env.example                         # Example GenAI provider environment variables
├── AI_Guard_Baseline_Training.ipynb     # Google Colab notebook for training on HC3
└── ml/
    └── README.md                        # Dataset troubleshooting & ML pipeline guide
```

---

## Quickstart: Running AI-Guard

### 1. Prerequisites
- **Python**: 3.10+ with `pip`
- **Node.js**: 18+ or 20+ with `npm`

---

### 2. Start the FastAPI Backend

1. Navigate to the project root:
   ```bash
   cd RobustAi
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Verify model presence:
   Ensure `backend/models/ai_guard_baseline.joblib` exists (4.8 MB).

5. Start the API server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   - **Health check:** `http://localhost:8000/health`
   - **Interactive API Docs:** `http://localhost:8000/docs`

---

### 3. Start the React Frontend

In a separate terminal window:

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to: **`http://localhost:5173`**

3. Build for production:
   ```bash
   npm run build
   ```

---

## API Endpoints

### `GET /health`
Verifies that the serialized model pipeline is loaded and ready.
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_type": "scikit-learn Pipeline (TfidfVectorizer + LogisticRegression)",
  "pipeline_steps": ["tfidf", "classifier"],
  "vocabulary_size": 100000,
  "classes": [0, 1],
  "label_mapping": {
    "0": "Human-Written",
    "1": "AI-Generated"
  }
}
```

### `POST /predict`
Evaluates text and returns classification and calibrated probabilities.
- **Request Body:**
  ```json
  {
    "text": "Your natural language text passage here...",
    "include_sentence_analysis": true
  }
  ```
- **Response:**
  ```json
  {
    "prediction": "Human-Written",
    "label": 0,
    "ai_probability": 0.0407,
    "human_probability": 0.9593,
    "confidence_score": 0.9186,
    "metrics": {
      "word_count": 16,
      "character_count": 142,
      "sentence_count": 1,
      "avg_sentence_length": 16.0
    },
    "sentence_analysis": [
      {
        "sentence": "Recent investigations into distributed representations...",
        "label": 0,
        "ai_probability": 0.0407,
        "is_experimental": true,
        "note": "Experimental sentence-level inference via document-level TF-IDF model."
      }
    ],
    "disclaimer": "Probabilistic estimate for academic research evaluation only. Does not prove authorship.",
    "model_info": {
      "architecture": "TfidfVectorizer + LogisticRegression",
      "trained_dataset": "Hello-SimpleAI/HC3",
      "vocabulary_size": 100000
    }
  }
  ```

### `GET /humanizer/status`
Returns the status of hosted GenAI provider configurations without exposing credentials.
```json
{
  "is_configured": true,
  "active_provider": "google_gemini",
  "model_name": "gemini-2.5-flash",
  "gemini_available": true,
  "openai_available": false,
  "supported_styles": ["Academic", "Natural", "Professional", "Conversational", "Simple English"],
  "supported_strengths": ["Light Edit", "Balanced Rewrite", "Extensive Rewrite"],
  "max_characters": 15000,
  "min_characters": 10
}
```

### `POST /humanizer/rewrite`
Transforms user text using configured GenAI models while strictly preserving citations, statistics, numbers, and author intent.
- **Request Body:**
  ```json
  {
    "text": "Your natural language text passage here...",
    "style": "Natural",
    "strength": "Balanced Rewrite"
  }
  ```
- **Response:**
  ```json
  {
    "original_text": "...",
    "rewritten_text": "...",
    "style": "Natural",
    "strength": "Balanced Rewrite",
    "provider_info": {
      "provider": "google_gemini",
      "model": "gemini-2.5-flash"
    },
    "integrity_review": {
      "status": "passed",
      "verified_citations": ["(Smith et al., 2021)"],
      "missing_citations": [],
      "verified_numbers": ["45.8%", "2026"],
      "missing_numbers": [],
      "total_citations_checked": 1,
      "total_numbers_checked": 2,
      "integrity_notes": ["All detected in-text citations and key numerical figures verified in rewritten text."]
    },
    "disclaimer": "AI-Guard Humanizer transforms stylistic presentation and flow while aiming to preserve semantic meaning and citations."
  }
  ```

---

## GenAI Provider Environment Configuration

Create a `.env` file in `backend/` or in the project root:

```bash
# Provider selection: 'gemini' (default) or 'openai'
GENAI_PROVIDER=gemini

# Google Gemini (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# OpenAI (Alternative)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

---

## Running Backend Tests

Run the complete 18-test test suite:
```bash
python -m pytest backend/tests/test_humanizer.py -v
```

---

## Research & Ethical Limitations

1. **Probabilistic Outputs:** Model outputs reflect statistical vocabulary distributions and are not proof of authorship.
2. **ESL Writer Vulnerability:** Non-native English writing often displays standardized syntax and lower lexical diversity, which can trigger elevated false-positive AI probability scores.
3. **Adversarial Susceptibility:** Paraphrasing tools and synonym substitutions can degrade linear n-gram features.
