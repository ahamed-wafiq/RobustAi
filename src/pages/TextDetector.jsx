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
  Wifi,
  WifiOff,
  RefreshCw,
  Cpu,
  BookOpen,
  Split,
  Compass,
  Zap,
  Globe,
  Newspaper
} from 'lucide-react';
import { SAMPLE_TEXTS } from '../data/sampleTexts';
import { 
  countTextMetrics, 
  computeStylometrics, 
  computeLocalFallbackPrediction 
} from '../utils/textAnalysis';
import MetricCard from '../components/common/MetricCard';
import Badge from '../components/common/Badge';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';
import PlushAnalyzeButton from '../components/common/PlushAnalyzeButton';
import heroLandscapeImg from '../assets/knitted-hero-landscape.jpg';

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
    // Validation: at least 5 words and 20 chars
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
        modelInfo: data.model_info || {
          model_type: 'FastAPI HC3 Baseline (Tfidf + LogisticRegression)',
          vocabulary_size: '100,000'
        },
        metrics: data.metrics,
        stylometrics,
        timestamp: new Date().toLocaleTimeString(),
        disclaimer: data.disclaimer,
        isLocalFallback: false
      });

      setBackendStatus('connected');
    } catch (err) {
      console.warn('Backend unavailable or errored. Generating local fallback estimate:', err);
      const fallbackResults = computeLocalFallbackPrediction(inputText);
      setResults(fallbackResults);
      setBackendStatus('disconnected');
      setBackendError(
        'Backend server unavailable at http://localhost:8000. Displaying client-side linguistic fallback estimates below.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HERO SECTION with Soft Knitted 3D Landscape */}
      <div className="knitted-card p-6 sm:p-9 relative overflow-hidden bg-gradient-to-br from-[#FFFDF8] via-[#FFFCF5] to-[#F5EEDB] border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#435744] bg-[#9BAE83]/30 px-3.5 py-1 rounded-full border-2 border-dashed border-[#9BAE83] shadow-2xs">
                ROBUSTAI / AI-GUARD
              </span>
              <span className="text-xs text-[#30312D]/70 font-bold">
                Plush Forensics & Language Lab
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#30312D] tracking-tight leading-tight">
              Understand the <span className="text-[#435744] underline decoration-wavy decoration-[#9BAE83]">texture</span> of text.
            </h1>

            <p className="text-sm sm:text-base text-[#30312D]/85 leading-relaxed max-w-xl font-medium">
              Inspect natural language passages through handcrafted statistical forensics. Evaluate probabilistic AI markers, burstiness patterns, and lexical diversity in an open, accountable research workbench.
            </p>

            {/* Backend Connectivity Status Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-2.5 text-xs font-black px-4 py-2 rounded-full border-2 border-dashed shadow-xs transition-all ${
                backendStatus === 'connected'
                  ? 'bg-[#9BAE83]/30 text-[#1F2C18] border-[#9BAE83]'
                  : backendStatus === 'checking'
                  ? 'bg-[#E7B44F]/30 text-[#543A05] border-[#E7B44F]'
                  : 'bg-[#E58B36]/30 text-[#6B2E05] border-[#E58B36]'
              }`}>
                {backendStatus === 'connected' ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#435744] animate-pulse"></span>
                    <Wifi className="w-4 h-4 text-[#435744]" />
                    <span>Live Backend Active (HC3 Baseline)</span>
                  </>
                ) : backendStatus === 'checking' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#8C6212]" />
                    <span>Checking Backend (:8000)...</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-[#9E4D09]" />
                    <span>Backend Offline (Local Fallback Ready)</span>
                  </>
                )}
              </div>

              {/* Fluffy Fur Refresh Button */}
              <button
                onClick={checkBackendHealth}
                type="button"
                className="plush-button plush-cream px-3 py-1.5 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5 transition-all"
                title="Refresh backend status"
                aria-label="Refresh backend health"
              >
                <RefreshCw className="w-3.5 h-3.5 embroidered-icon" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Decorative Knitted 3D Miniature Landscape */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Soft Ambient Halo behind the miniature landscape */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#9BAE83]/40 via-[#E7B44F]/30 to-[#E58B36]/30 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition duration-500"></div>
              
              {/* Knitted Landscape Visual Container */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-dashed border-[#9BAE83] shadow-2xl bg-[#FFFDF8] animate-knitted-float">
                <img 
                  src={heroLandscapeImg} 
                  alt="Miniature 3D knitted landscape with rolling green hills, cream houses, and pom-pom trees" 
                  className="w-full h-60 sm:h-64 object-cover transform hover:scale-103 transition duration-500"
                />
                
                {/* Floating caption pill on landscape */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#FFFDF8]/95 backdrop-blur-md px-4 py-2 rounded-full border-2 border-dashed border-[#435744]/30 flex items-center justify-between text-xs font-black text-[#435744] shadow-md">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9BAE83]"></span>
                    Tactile Language Miniature
                  </span>
                  <span className="text-[#30312D]/70 text-[10px] font-extrabold uppercase tracking-wider">Handcrafted Diorama</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Global Academic Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Backend Disconnected / Fallback Info Notification */}
      {backendStatus === 'disconnected' && (
        <div className="knitted-card p-5 bg-[#FFFDF8] border-3 border-dashed border-[#E58B36] text-[#30312D] text-xs sm:text-sm space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-black text-[#9E4D09]">
            <AlertCircle className="w-5 h-5 text-[#E58B36] shrink-0" />
            <span className="text-sm">FastAPI Inference Server Offline (:8000)</span>
          </div>
          <p className="text-[#30312D]/85 leading-relaxed text-xs font-medium">
            The text detector is operating with <strong>Client-Side Linguistic Heuristics</strong> as a seamless fallback. For real-time HC3 model inference, start your backend server with:
          </p>
          <pre className="p-3 bg-[#30312D] text-[#9BAE83] rounded-2xl font-mono text-[11px] overflow-x-auto border-2 border-[#435744]">
uvicorn backend.main:app --reload --port 8000
          </pre>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Text Analysis Input Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="knitted-card p-6 sm:p-7 space-y-5 border-3 border-dashed border-[#9BAE83]/60 shadow-md">
            
            {/* Header & Preset Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-[#435744]/15">
              <div className="flex items-center gap-2.5 text-[#435744] font-black text-sm">
                <div className="w-8 h-8 rounded-full plush-sage flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 embroidered-icon" />
                </div>
                <span>Text Analysis Workspace</span>
              </div>

              {/* Sample Preset Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="preset-select" className="text-xs text-[#30312D]/80 font-black">
                  Preset:
                </label>
                <select
                  id="preset-select"
                  value={selectedPresetId}
                  onChange={(e) => handleSelectSample(e.target.value)}
                  className="text-xs font-bold bg-[#FFFDF8] text-[#30312D] border-2 border-dashed border-[#9BAE83] rounded-full px-3.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#9BAE83] shadow-2xs"
                >
                  <option value="">-- Choose Sample Text --</option>
                  {SAMPLE_TEXTS.map((sample) => (
                    <option key={sample.id} value={sample.id}>
                      {sample.title} ({sample.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Sample Selector Pills with Fluffy Fur Material */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-[#30312D]/70 text-[11px] font-black mr-1 uppercase tracking-wider">Quick Select:</span>
              {SAMPLE_TEXTS.map((sample, idx) => {
                const isSelected = selectedPresetId === sample.id;
                const palette = [
                  { selected: 'plush-navy', icon: BookOpen },
                  { selected: 'plush-orange', icon: Cpu },
                  { selected: 'plush-mustard', icon: Zap },
                  { selected: 'plush-forest', icon: Globe },
                  { selected: 'plush-cream', icon: Newspaper }
                ][idx % 5];
                const Icon = palette.icon;

                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    type="button"
                    className={`plush-button px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
                      isSelected
                        ? `${palette.selected} shadow-md scale-103 ring-2 ring-white/60`
                        : 'plush-cream text-[#30312D]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 embroidered-icon shrink-0" />
                    <span>{sample.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Padded Fabric Frame with Smooth Inner Textarea */}
            <div className="quilted-inset p-3 shadow-inner">
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
                  if (backendError && backendStatus === 'connected') setBackendError(null);
                }}
                placeholder="Paste an academic essay, synthetic answer, or writing sample here to analyze with AI-Guard..."
                className="w-full text-[#30312D] bg-[#FFFDF8] rounded-2xl p-4.5 text-sm leading-relaxed placeholder-[#30312D]/40 border-2 border-dashed border-[#9BAE83]/50 focus:bg-[#FFFFFF] focus:border-[#435744] focus:outline-hidden resize-y min-h-[220px] shadow-sm font-sans"
              />
            </div>

            {/* Counters and Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-[#435744]/15">
              {/* Word, Character, Sentence Counters */}
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#30312D]/80">
                <span className="bg-[#9BAE83]/20 px-3 py-1 rounded-full border border-dashed border-[#9BAE83]">
                  <strong className="text-[#435744] font-black">{metrics.words}</strong> words
                </span>
                <span className="bg-[#E7B44F]/20 px-3 py-1 rounded-full border border-dashed border-[#E7B44F]">
                  <strong className="text-[#8C6212] font-black">{metrics.characters}</strong> chars
                </span>
                <span className="bg-[#343B59]/15 px-3 py-1 rounded-full border border-dashed border-[#343B59]">
                  <strong className="text-[#343B59] font-black">{metrics.sentences}</strong> sentences
                </span>
              </div>

              {/* Action Buttons: Fluffy Plush Action Controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!inputText && !results}
                  className="plush-button plush-cream px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Clear input text and results"
                >
                  <RotateCcw className="w-3.5 h-3.5 embroidered-icon" />
                  <span>Clear</span>
                </button>

                {/* Main Prominent Fluffy Action Button with Realistic 3D Fur Asset */}
                <PlushAnalyzeButton
                  onClick={handleAnalyze}
                  disabled={metrics.words === 0}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </div>

          </div>

          {/* Validation Notice */}
          {validationError && (
            <div className="knitted-card p-5 bg-[#FFFDF8] border-3 border-dashed border-[#E58B36] text-[#9E4D09] text-xs flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-[#E58B36] shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-sm">Sample Length Insufficient</p>
                <p className="text-[#30312D]/85 mt-0.5 leading-relaxed font-medium">{validationError}</p>
              </div>
            </div>
          )}

          {/* Model Specification Card */}
          <div className="knitted-card p-5 bg-[#FFFDF8] border-2 border-dashed border-[#435744]/25 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#435744] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#9BAE83]" />
                Architecture: {modelDetails?.pipeline_steps ? modelDetails.pipeline_steps.join(' + ') : 'TfidfVectorizer + LogisticRegression'}
              </span>
              <Badge variant="sage" size="sm">HC3 Trained</Badge>
            </div>
            <p className="text-[#30312D]/75 leading-relaxed text-[11px] font-medium">
              Trained on Hello-SimpleAI/HC3 dataset across academic questions, news reports, and Wikipedia summaries with grouped split cross-validation.
            </p>
          </div>
        </div>

        {/* Right Column: Prediction Results & Stylometrics (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* EMPTY STATE */}
          {!results && !isAnalyzing && (
            <div className="knitted-card p-8 text-center space-y-4 border-3 border-dashed border-[#9BAE83]/50 shadow-md">
              <div className="plush-circle-btn plush-sage w-16 h-16 mx-auto shadow-md">
                <BarChart3 className="w-8 h-8 embroidered-icon" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-[#30312D]">
                  Ready for Model Inference
                </h3>
                <p className="text-xs text-[#30312D]/75 leading-relaxed max-w-sm mx-auto font-medium">
                  Type or select a benchmark sample on the left, then press <strong>Analyze Text</strong> to inspect probabilistic authorship markers.
                </p>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-[#435744]/15 text-left space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-[#435744]">
                  Benchmarking Pipeline:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#F5EEDB] border border-dashed border-[#435744]/20 flex justify-between shadow-2xs font-semibold">
                    <span className="text-[#30312D]">Vectorizer</span>
                    <span className="font-mono font-bold text-[#435744]">TF-IDF (100k n-grams)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5EEDB] border border-dashed border-[#435744]/20 flex justify-between shadow-2xs font-semibold">
                    <span className="text-[#30312D]">Classifier</span>
                    <span className="font-mono font-bold text-[#435744]">Logistic Regression (L2)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5EEDB] border border-dashed border-[#435744]/20 flex justify-between shadow-2xs font-semibold">
                    <span className="text-[#30312D]">Corpus</span>
                    <span className="font-mono font-bold text-[#435744]">Hello-SimpleAI/HC3</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {isAnalyzing && (
            <div className="knitted-card p-7 space-y-5 border-3 border-dashed border-[#E7B44F] animate-pulse shadow-md">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-[#9BAE83]/40 rounded-full w-1/3"></div>
                <div className="h-6 bg-[#E7B44F]/40 rounded-full w-1/4"></div>
              </div>
              <div className="h-32 bg-[#F5EEDB] rounded-3xl border-2 border-dashed border-[#435744]/20"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-[#F5EEDB] rounded-2xl border-2 border-dashed border-[#435744]/20"></div>
                <div className="h-20 bg-[#F5EEDB] rounded-2xl border-2 border-dashed border-[#435744]/20"></div>
              </div>
              <div className="h-36 bg-[#F5EEDB] rounded-3xl border-2 border-dashed border-[#435744]/20"></div>
            </div>
          )}

          {/* ACTIVE PREDICTION RESULTS */}
          {results && !isAnalyzing && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Main Classification Result Card */}
              <div className="knitted-card p-6 sm:p-7 space-y-5 border-3 border-dashed border-[#9BAE83] shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full plush-sage flex items-center justify-center shrink-0">
                      <Gauge className="w-4 h-4 embroidered-icon" />
                    </div>
                    <h3 className="font-black text-[#30312D] text-sm">
                      Model Classification Result
                    </h3>
                  </div>
                  
                  {results.isLocalFallback ? (
                    <Badge variant="simulated" size="sm">
                      Local Fallback Heuristic
                    </Badge>
                  ) : (
                    <Badge variant="connected" size="sm">
                      Live Backend Model
                    </Badge>
                  )}
                </div>

                {/* Big Score Box with Quilted Padding */}
                <div className="p-5 sm:p-6 rounded-3xl quilted-inset space-y-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#30312D]/70">
                        Predicted Class
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className={`text-3xl font-black tracking-tight ${
                          results.probAI > 50 ? 'text-[#D67C29]' : 'text-[#3B4E3C]'
                        }`}>
                          {results.prediction}
                        </span>
                      </div>
                    </div>

                    <Badge 
                      variant={results.probAI > 50 ? 'orange' : 'sage'}
                      size="lg"
                    >
                      {results.probAI > 50 ? 'Synthetic Bias' : 'Human Nuance'}
                    </Badge>
                  </div>

                  {/* Dual Yarn Gauge Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-5 w-full bg-[#30312D]/15 rounded-full overflow-hidden flex border-2 border-[#435744]/20 p-0.5 shadow-inner">
                      <div 
                        className="bg-[#E58B36] h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${results.probAI}%` }}
                        title={`${results.probAI}% AI Likelihood`}
                      ></div>
                      <div 
                        className="bg-[#9BAE83] h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${results.probHuman}%` }}
                        title={`${results.probHuman}% Human Likelihood`}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-[#9E4D09] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E58B36]"></span>
                        AI: {results.probAI}%
                      </span>
                      <span className="text-[#435744] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#9BAE83]"></span>
                        Human: {results.probHuman}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="text-xs text-[#30312D]/85 leading-relaxed bg-[#FFFDF8] p-4 rounded-2xl border-2 border-dashed border-[#435744]/20 font-medium">
                  {results.probAI >= 70 ? (
                    <p>
                      <strong className="text-[#435744]">High Synthetic Indicators:</strong> This passage demonstrates uniform clause lengths, low lexical variation, and predictive formulaic transition structures typical of autoregressive LLM output.
                    </p>
                  ) : results.probAI <= 30 ? (
                    <p>
                      <strong className="text-[#435744]">High Human Burstiness:</strong> The passage contains organic stylistic variations, variable sentence rhythms, and authentic idiosyncratic vocabulary characteristic of human authorship.
                    </p>
                  ) : (
                    <p>
                      <strong className="text-[#435744]">Ambiguous / Mixed Signal:</strong> The classifier detected conflicting linguistic markers. This occurs commonly in edited texts, formal academic prose, or non-native English essays.
                    </p>
                  )}
                </div>

                <DisclaimerBanner compact />
              </div>

              {/* Inside the Writing (Stylometric Analysis) */}
              <div className="knitted-card p-6 sm:p-7 space-y-4 border-3 border-dashed border-[#9BAE83]/60 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#435744]/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full plush-forest flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 embroidered-icon-light" />
                    </div>
                    <h3 className="font-black text-[#30312D] text-sm">
                      Inside the Writing
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#435744] bg-[#9BAE83]/25 px-3 py-1 rounded-full border-2 border-dashed border-[#9BAE83]">
                    Stylometric Fingerprint
                  </span>
                </div>

                {/* 4 Stylometric Cards */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Lexical Diversity */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#30312D]/60 block">
                      Lexical Diversity (TTR)
                    </span>
                    <p className="text-2xl font-black text-[#435744]">
                      {results.stylometrics.lexicalDiversity}
                    </p>
                    <p className="text-[10px] text-[#30312D]/70 font-medium leading-tight">
                      Unique to total words ratio
                    </p>
                  </div>

                  {/* Avg Sentence Length */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#30312D]/60 block">
                      Avg Sentence Length
                    </span>
                    <p className="text-2xl font-black text-[#435744]">
                      {results.metrics.avg_sentence_length || results.stylometrics.avgSentenceLength} <span className="text-xs font-bold text-[#30312D]/60">words</span>
                    </p>
                    <p className="text-[10px] text-[#30312D]/70 font-medium leading-tight">
                      Mean words per clause
                    </p>
                  </div>

                  {/* Flesch Reading Ease */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#30312D]/60 block">
                      Flesch Reading Ease
                    </span>
                    <p className="text-2xl font-black text-[#B58422]">
                      {results.stylometrics.fleschReadingEase || 62.4}
                    </p>
                    <p className="text-[10px] text-[#30312D]/70 font-medium leading-tight">
                      {results.stylometrics.fleschReadingEase > 60 ? 'Standard reading level' : 'Academic / Complex'}
                    </p>
                  </div>

                  {/* Burstiness Variance */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#30312D]/60 block">
                      Burstiness Variance
                    </span>
                    <p className="text-2xl font-black text-[#343B59]">
                      {results.stylometrics.burstiness}
                    </p>
                    <p className="text-[10px] text-[#30312D]/70 font-medium leading-tight">
                      Sentence rhythm dispersion
                    </p>
                  </div>
                </div>

                {/* Punctuation Distribution Bar Breakdown */}
                <div className="space-y-2 pt-3 border-t-2 border-dashed border-[#435744]/15">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#30312D]/70 block">
                    Punctuation Distribution
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(results.stylometrics.punctuation || []).map((punct, pIdx) => (
                      <div key={pIdx} className="p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 flex items-center justify-between shadow-2xs">
                        <span className="text-[#30312D]/80 text-[11px] font-bold">{punct.name}</span>
                        <span className="font-black font-mono text-[#435744] text-[11px]">{punct.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sentence-Level Inspection Drawer */}
              {results.sentenceAnalysis && results.sentenceAnalysis.length > 0 && (
                <div className="knitted-card p-6 sm:p-7 space-y-4 border-3 border-dashed border-[#9BAE83]/60 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-[#435744]/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full plush-cream flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4 embroidered-icon" />
                      </div>
                      <h3 className="font-black text-[#30312D] text-sm">
                        Sentence Rhythm Inspection
                      </h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#543A05] bg-[#E7B44F]/30 px-3 py-1 rounded-full border-2 border-dashed border-[#E7B44F]">
                      Heuristic Slice
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {results.sentenceAnalysis.map((sent, idx) => {
                      const isHigh = sent.ai_probability >= 0.50;
                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border-2 border-dashed text-xs leading-relaxed transition-all shadow-2xs ${
                            isHigh
                              ? 'bg-[#FFF2E6] border-[#E58B36] text-[#30312D]'
                              : 'bg-[#F2F7ED] border-[#9BAE83] text-[#30312D]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-black">
                            <span className="text-[#30312D]/70">Sentence {idx + 1}</span>
                            <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold ${
                              isHigh ? 'bg-[#E58B36]/25 text-[#9E4D09]' : 'bg-[#9BAE83]/30 text-[#435744]'
                            }`}>
                              {Math.round(sent.ai_probability * 100)}% AI likelihood
                            </span>
                          </div>
                          <p className="font-medium text-[11.5px] leading-relaxed">{sent.sentence}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
