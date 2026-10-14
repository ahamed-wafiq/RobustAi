import React, { useState, useEffect, useId } from 'react';
import { 
  FileText, 
  Sparkles, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  BarChart3, 
  Gauge, 
  Sliders, 
  Info, 
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Wifi,
  WifiOff,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { SAMPLE_TEXTS } from '../data/sampleTexts';
import { countTextMetrics, computeStylometrics } from '../utils/textAnalysis';
import MetricCard from '../components/common/MetricCard';
import Badge from '../components/common/Badge';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function TextDetector() {
  const [inputText, setInputText] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'
  const [validationError, setValidationError] = useState('');
  const [modelDetails, setModelDetails] = useState(null);

  const textareaId = useId();
  const metrics = countTextMetrics(inputText);

  // Check backend health on mount
  const checkBackendHealth = async () => {
    try {
      setBackendStatus('checking');
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'healthy') {
          setBackendStatus('connected');
          setModelDetails(data);
          setBackendError(null);
        } else {
          setBackendStatus('degraded');
          setBackendError(data.error || 'Model is not loaded on backend.');
        }
      } else {
        setBackendStatus('disconnected');
      }
    } catch (err) {
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const handleSelectSample = (presetId) => {
    if (!presetId) {
      setSelectedPresetId('');
      return;
    }
    const sample = SAMPLE_TEXTS.find(s => s.id === presetId);
    if (sample) {
      setSelectedPresetId(presetId);
      setInputText(sample.text);
      setValidationError('');
      setResults(null);
      setBackendError(null);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSelectedPresetId('');
    setResults(null);
    setValidationError('');
    setBackendError(null);
  };

  const handleAnalyze = async () => {
    // Validation
    if (metrics.words < 5 || inputText.trim().length < 20) {
      setValidationError(
        `Insufficient sample length (${metrics.words} words). AI-Guard requires at least 5 words (minimum 20 characters) for statistical n-gram inference.`
      );
      return;
    }

    setValidationError('');
    setBackendError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
          include_sentence_analysis: true
        }),
      });

      if (!response.ok) {
        let errDetail = 'Inference server error';
        try {
          const errData = await response.json();
          errDetail = errData.detail || errDetail;
        } catch (_) {}
        throw new Error(errDetail);
      }

      const data = await response.json();
      const stylometrics = computeStylometrics(inputText);

      setResults({
        prediction: data.prediction,
        label: data.label,
        probAI: Math.round(data.ai_probability * 100),
        probHuman: Math.round(data.human_probability * 100),
        confidenceScore: Math.round(data.confidence_score * 100),
        rawAIProbability: data.ai_probability,
        rawHumanProbability: data.human_probability,
        sentenceAnalysis: data.sentence_analysis || [],
        modelInfo: data.model_info,
        metrics: data.metrics,
        stylometrics,
        timestamp: new Date().toLocaleTimeString(),
        disclaimer: data.disclaimer
      });

      // Update backend status as connected
      setBackendStatus('connected');
    } catch (err) {
      console.error('Inference error:', err);
      setBackendError(err.message || 'Failed to connect to FastAPI inference server.');
      setBackendStatus('disconnected');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Text Analysis & Detection Lab
              </h1>
              <Badge variant="blue">Live Model Inference</Badge>
            </div>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              Evaluate natural language samples using the trained <strong>AI-Guard Baseline Model</strong> (TF-IDF + Logistic Regression on HC3).
            </p>
          </div>

          {/* Backend Connectivity Status Indicator */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              backendStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : backendStatus === 'checking'
                ? 'bg-slate-50 text-slate-600 border-slate-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {backendStatus === 'connected' ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">Backend Active (HC3 Baseline)</span>
                </>
              ) : backendStatus === 'checking' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
                  <span>Connecting to Backend...</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-semibold">Backend Offline (:8000)</span>
                </>
              )}
            </div>

            <button
              onClick={checkBackendHealth}
              type="button"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Refresh backend status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Backend Disconnected Notice */}
      {backendStatus === 'disconnected' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>FastAPI Inference Backend Not Detected</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-xs">
            The frontend connects to the live FastAPI backend at <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">{API_BASE_URL}</code>. 
            To start your backend with the downloaded model, run:
          </p>
          <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
uvicorn backend.main:app --reload --port 8000
          </pre>
        </div>
      )}

      {/* Main Analysis Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Input Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Input Toolbar Header */}
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Input Passage</span>
              </div>

              {/* Sample Preset Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="preset-select" className="text-xs text-slate-500 font-medium">
                  Load Preset:
                </label>
                <select
                  id="preset-select"
                  value={selectedPresetId}
                  onChange={(e) => handleSelectSample(e.target.value)}
                  className="text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Sample Corpus --</option>
                  {SAMPLE_TEXTS.map((sample) => (
                    <option key={sample.id} value={sample.id}>
                      {sample.title} ({sample.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Preset Pills */}
            <div className="px-4 py-2.5 bg-slate-50/40 border-b border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-medium mr-1">Quick Samples:</span>
              {SAMPLE_TEXTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  type="button"
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedPresetId === sample.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {sample.title.split(' ')[0]} {sample.title.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            {/* Textarea Area */}
            <div className="p-4">
              <label htmlFor={textareaId} className="sr-only">
                Text to analyze
              </label>
              <textarea
                id={textareaId}
                rows={10}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (validationError) setValidationError('');
                  if (backendError) setBackendError(null);
                }}
                placeholder="Paste an academic essay, article, or writing sample here to send to the AI-Guard model..."
                className="w-full text-slate-800 text-sm leading-relaxed placeholder-slate-400 border-0 focus:ring-0 focus:outline-hidden resize-y min-h-[220px]"
              />
            </div>

            {/* Live Counters & Action Buttons */}
            <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {/* Word & Char Counters */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <strong className="text-slate-800">{metrics.words}</strong> words
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <strong className="text-slate-800">{metrics.characters}</strong> chars
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <strong className="text-slate-800">{metrics.sentences}</strong> sentences
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!inputText && !results}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || metrics.words === 0}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Calling Model...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Validation Error Notice */}
          {validationError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Sample Length Insufficient</p>
                <p className="text-rose-700 mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          {/* Backend Error Callout */}
          {backendError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Inference Request Failed</p>
                <p className="text-rose-700 mt-0.5">{backendError}</p>
              </div>
            </div>
          )}

          {/* Model Specification Info Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                Active Model: {modelDetails?.pipeline_steps ? modelDetails.pipeline_steps.join(' + ') : 'TfidfVectorizer + LogisticRegression'}
              </span>
              <span className="text-[11px] text-slate-400">
                Trained on HC3 (Hello-SimpleAI)
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Predictions are executed on the real exported <code className="font-mono text-slate-700">ai_guard_baseline.joblib</code> via FastAPI.
            </p>
          </div>
        </div>

        {/* Right Output Column: Real Backend Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* EMPTY STATE */}
          {!results && !isAnalyzing && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Ready for Model Inference
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Enter text or load a benchmark sample on the left, then click <strong>Analyze Text</strong> to receive real-time classification probabilities from the trained pipeline.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-left space-y-2">
                <p className="text-xs font-semibold text-slate-700">Model Pipeline Architecture:</p>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="font-medium text-slate-800">Vectorizer</span>
                    <span className="font-mono text-slate-600">TfidfVectorizer (100k features)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="font-medium text-slate-800">Classifier</span>
                    <span className="font-mono text-slate-600">LogisticRegression (L2, C=2.5)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="font-medium text-slate-800">Dataset</span>
                    <span className="font-mono text-slate-600">Hello-SimpleAI/HC3</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {isAnalyzing && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 animate-pulse shadow-xs">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
              </div>
              <div className="h-24 bg-slate-100 rounded-xl"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-slate-100 rounded-lg"></div>
                <div className="h-16 bg-slate-100 rounded-lg"></div>
              </div>
              <div className="h-28 bg-slate-100 rounded-xl"></div>
            </div>
          )}

          {/* REAL RESULTS STATE */}
          {results && !isAnalyzing && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Primary Probability Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Model Classification Result
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Confidence: {results.confidenceScore}%
                  </span>
                </div>

                {/* Score Big Display */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                        Measured Probabilities
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className={`text-3xl font-extrabold tracking-tight ${
                          results.probAI > 50 ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {results.prediction}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">
                          ({results.probAI}% AI / {results.probHuman}% Human)
                        </span>
                      </div>
                    </div>

                    <Badge 
                      variant={results.label === 1 ? 'ai' : 'human'}
                      size="lg"
                    >
                      Class {results.label}: {results.prediction}
                    </Badge>
                  </div>

                  {/* Dual Bar Gauge */}
                  <div className="space-y-1">
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-rose-500 h-full transition-all duration-500"
                        style={{ width: `${results.probAI}%` }}
                        title={`${results.probAI}% AI probability`}
                      ></div>
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${results.probHuman}%` }}
                        title={`${results.probHuman}% Human probability`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span className="text-rose-700 font-semibold">AI Likelihood ({results.probAI}%)</span>
                      <span className="text-emerald-700 font-semibold">Human Likelihood ({results.probHuman}%)</span>
                    </div>
                  </div>
                </div>

                {/* Stylometric & Linguistic Heuristics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Linguistic Statistics</span>
                    <span className="text-[10px] text-slate-400">client metrics</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Perplexity Index</span>
                      <p className="text-lg font-bold text-slate-900">{results.stylometrics.perplexity}</p>
                      <p className="text-[10px] text-slate-400 leading-tight">Surprisal entropy estimate</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Burstiness (Variance)</span>
                      <p className="text-lg font-bold text-slate-900">{results.stylometrics.burstiness}</p>
                      <p className="text-[10px] text-slate-400 leading-tight">Sentence length variance</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Lexical Richness</span>
                      <p className="text-lg font-bold text-slate-900">{results.stylometrics.lexicalDiversity}</p>
                      <p className="text-[10px] text-slate-400 leading-tight">Type-token ratio</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Avg Sentence Length</span>
                      <p className="text-lg font-bold text-slate-900">{results.metrics.avg_sentence_length} <span className="text-xs font-normal text-slate-500">wds</span></p>
                      <p className="text-[10px] text-slate-400 leading-tight">Words per sentence segment</p>
                    </div>
                  </div>
                </div>

                {/* Persistent Result Disclaimer */}
                <div className="pt-2">
                  <DisclaimerBanner compact />
                </div>
              </div>

              {/* Experimental Sentence-Level Inspection Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Sentence-Level Inspection
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    Experimental Heuristic
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-[11px] text-amber-900 leading-relaxed">
                  <strong>Notice:</strong> Sentence-level probabilities are computed by evaluating each individual sentence through the document-level TF-IDF model. Because individual sentences have short length and sparse vocabulary, these scores are exploratory indicators and not token-level attention weights.
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {results.sentenceAnalysis.map((sent, idx) => {
                    const isHigh = sent.ai_probability >= 0.50;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                          isHigh
                            ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                            : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1 text-[11px] font-medium">
                          <span className="text-slate-500">Sentence {idx + 1}</span>
                          <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                            isHigh ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {Math.round(sent.ai_probability * 100)}% AI prob
                          </span>
                        </div>
                        <p>{sent.sentence}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
