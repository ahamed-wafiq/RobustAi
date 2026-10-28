import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wand2, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  ArrowRightLeft, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Layers, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sliders, 
  RefreshCw, 
  Eye, 
  Edit3, 
  Key, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { HUMANIZER_SAMPLES } from '../data/humanizerSamples';
import { computeWordDiff, getDiffStats } from '../utils/diffUtils';
import { getWritingAnalytics } from '../utils/textAnalysis';
import Badge from '../components/common/Badge';
import MetricCard from '../components/common/MetricCard';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const REWRITE_STYLES = [
  {
    id: 'Academic',
    name: 'Academic',
    badgeVariant: 'sage',
    desc: 'Formal, precise, research-oriented writing with scholarly phrasing.',
    icon: '🎓'
  },
  {
    id: 'Natural',
    name: 'Natural',
    badgeVariant: 'forest',
    desc: 'Clear, fluent, less repetitive writing that flows authentically.',
    icon: '🌿'
  },
  {
    id: 'Professional',
    name: 'Professional',
    badgeVariant: 'navy',
    desc: 'Polished workplace and executive business communication.',
    icon: '💼'
  },
  {
    id: 'Conversational',
    name: 'Conversational',
    badgeVariant: 'mustard',
    desc: 'Approachable, warm, and engaging language for general readers.',
    icon: '💬'
  },
  {
    id: 'Simple English',
    name: 'Simple English',
    badgeVariant: 'orange',
    desc: 'Accessible language with straightforward, direct sentence structures.',
    icon: '📖'
  }
];

const REWRITE_STRENGTHS = [
  {
    id: 'Light Edit',
    name: 'Light Edit',
    desc: 'Grammar, clarity, and minor phrasing improvements. Preserves existing structure closely.'
  },
  {
    id: 'Balanced Rewrite',
    name: 'Balanced Rewrite',
    desc: 'Improve flow, readability, and sentence structure while preserving paragraph layout.'
  },
  {
    id: 'Extensive Rewrite',
    name: 'Extensive Rewrite',
    desc: 'Substantially restructure wording and rhythm while preserving all core facts and citations.'
  }
];

export default function HumanizerStudio() {
  // Input State
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Natural');
  const [selectedStrength, setSelectedStrength] = useState('Balanced Rewrite');
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Execution & Provider State
  const [isRewriting, setIsRewriting] = useState(false);
  const [providerStatus, setProviderStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Rewritten Result State
  const [rewrittenText, setRewrittenText] = useState('');
  const [activeOriginalSnapshot, setActiveOriginalSnapshot] = useState('');
  const [providerMetadata, setProviderMetadata] = useState(null);
  const [integrityReview, setIntegrityReview] = useState(null);

  // Comparison & View State
  const [activeTab, setActiveTab] = useState('side-by-side'); // 'side-by-side' | 'diff' | 'original' | 'rewritten'
  const [syncScroll, setSyncScroll] = useState(true);
  const [copiedState, setCopiedState] = useState(false);
  const [editorReplacedNotice, setEditorReplacedNotice] = useState(false);

  // AI-Guard Before & After Detection State
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState(null);
  const [detectionError, setDetectionError] = useState(null);

  // Synchronized scrolling refs
  const origScrollRef = useRef(null);
  const rewrScrollRef = useRef(null);
  const isScrollingOrig = useRef(false);
  const isScrollingRewr = useRef(false);

  // Fetch provider configuration status from backend
  const fetchProviderStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await fetch(`${API_BASE_URL}/humanizer/status`);
      if (res.ok) {
        const data = await res.json();
        setProviderStatus(data);
      } else {
        setProviderStatus({ is_configured: false, active_provider: 'none' });
      }
    } catch (err) {
      setProviderStatus({ is_configured: false, active_provider: 'offline' });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderStatus();
  }, []);

  // Handle preset selection
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const sample = HUMANIZER_SAMPLES.find(s => s.id === presetId);
    if (sample) {
      setInputText(sample.text);
      setSelectedStyle(sample.style || 'Natural');
      setSelectedStrength(sample.strength || 'Balanced Rewrite');
      setRewrittenText('');
      setActiveOriginalSnapshot('');
      setIntegrityReview(null);
      setDetectionResults(null);
      setErrorMessage(null);
    }
  };

  // Synchronized scrolling handler
  const handleOrigScroll = () => {
    if (!syncScroll || isScrollingRewr.current) return;
    isScrollingOrig.current = true;
    if (origScrollRef.current && rewrScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = origScrollRef.current;
      const ratio = scrollHeight - clientHeight > 0 ? scrollTop / (scrollHeight - clientHeight) : 0;
      rewrScrollRef.current.scrollTop = ratio * (rewrScrollRef.current.scrollHeight - rewrScrollRef.current.clientHeight);
    }
    setTimeout(() => { isScrollingOrig.current = false; }, 50);
  };

  const handleRewrScroll = () => {
    if (!syncScroll || isScrollingOrig.current) return;
    isScrollingRewr.current = true;
    if (origScrollRef.current && rewrScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = rewrScrollRef.current;
      const ratio = scrollHeight - clientHeight > 0 ? scrollTop / (scrollHeight - clientHeight) : 0;
      origScrollRef.current.scrollTop = ratio * (origScrollRef.current.scrollHeight - origScrollRef.current.clientHeight);
    }
    setTimeout(() => { isScrollingRewr.current = false; }, 50);
  };

  // Humanize Action
  const handleHumanize = async () => {
    const trimmed = inputText.trim();
    if (trimmed.length < 10) {
      setErrorMessage('Please enter at least 10 characters to humanize.');
      return;
    }
    if (trimmed.length > 15000) {
      setErrorMessage(`Input exceeds 15,000 characters limit (${trimmed.length} chars). Please segment your document.`);
      return;
    }

    setErrorMessage(null);
    setIsRewriting(true);
    setDetectionResults(null);
    setDetectionError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/humanizer/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          style: selectedStyle,
          strength: selectedStrength
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || `Server error (${res.status})`);
      }

      setRewrittenText(data.rewritten_text);
      setActiveOriginalSnapshot(data.original_text);
      setProviderMetadata(data.provider_info);
      setIntegrityReview(data.integrity_review);
      // Auto-switch to side-by-side or active comparison
      if (activeTab === 'original') setActiveTab('rewritten');
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during text transformation.');
      if (err.message.includes('Not Configured')) {
        setShowConfigGuide(true);
      }
    } finally {
      setIsRewriting(false);
    }
  };

  // Copy Rewritten Text
  const handleCopyRewritten = () => {
    if (!rewrittenText) return;
    navigator.clipboard.writeText(rewrittenText);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Replace Editor Content with Reviewed Rewrite
  const handleReplaceEditorContent = () => {
    if (!rewrittenText) return;
    setInputText(rewrittenText);
    setEditorReplacedNotice(true);
    setTimeout(() => setEditorReplacedNotice(false), 3000);
  };

  // Reset Rewritten Text to Original Snapshot
  const handleResetToOriginal = () => {
    if (activeOriginalSnapshot) {
      setRewrittenText(activeOriginalSnapshot);
    }
  };

  // Export as .txt file
  const handleExportTxt = () => {
    if (!rewrittenText) return;
    const blob = new Blob([rewrittenText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aiguard-humanized-${selectedStyle.toLowerCase()}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // AI-Guard Before & After Detector Evaluation
  const handleAnalyzeBeforeAndAfter = async () => {
    const orig = activeOriginalSnapshot || inputText.trim();
    const rewr = rewrittenText.trim();

    if (!orig || !rewr) return;
    if (orig.split(/\s+/).length < 5 || rewr.split(/\s+/).length < 5) {
      setDetectionError('Both original and rewritten texts must contain at least 5 words for statistical evaluation.');
      return;
    }

    setIsDetecting(true);
    setDetectionError(null);

    try {
      const [resOrig, resRewr] = await Promise.all([
        fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: orig, include_sentence_analysis: true })
        }),
        fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: rewr, include_sentence_analysis: true })
        })
      ]);

      if (!resOrig.ok || !resRewr.ok) {
        throw new Error('Detection server error. Please ensure the backend is healthy.');
      }

      const dataOrig = await resOrig.json();
      const dataRewr = await resRewr.json();

      setDetectionResults({
        before: dataOrig,
        after: dataRewr,
        deltaAI: Number(((dataRewr.ai_probability - dataOrig.ai_probability) * 100).toFixed(1)),
        deltaHuman: Number(((dataRewr.human_probability - dataOrig.human_probability) * 100).toFixed(1))
      });
    } catch (err) {
      setDetectionError(err.message || 'Detection service is currently unreachable.');
    } finally {
      setIsDetecting(false);
    }
  };

  // Computations
  const inputCharCount = inputText.length;
  const inputWordCount = (inputText.trim().match(/\S+/g) || []).length;
  const originalAnalytics = getWritingAnalytics(activeOriginalSnapshot || inputText);
  const rewrittenAnalytics = getWritingAnalytics(rewrittenText);
  const wordDiff = computeWordDiff(activeOriginalSnapshot, rewrittenText);
  const diffStats = getDiffStats(wordDiff);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* HERO SECTION */}
      <div className="knitted-card p-4 sm:p-7 lg:p-8 bg-gradient-to-br from-[#FFFDF8] via-[#FFFCF5] to-[#F5EEDB] border-2 sm:border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#435744] bg-[#9BAE83]/30 px-3 sm:px-3.5 py-1 rounded-full border-2 border-dashed border-[#9BAE83] shadow-2xs">
                GENAI HUMANIZER STUDIO
              </span>
              <Badge variant="sage">Adaptive Stylistic Transformation</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#30312D] tracking-tight">
              Refine your voice. <span className="text-[#435744] underline decoration-wavy decoration-[#9BAE83]">Preserve your truth.</span>
            </h1>
            <p className="text-xs sm:text-base text-[#30312D]/85 leading-relaxed font-medium">
              Transform formulaic or stiff natural language passages into clear, stylistically calibrated writing using real Generative AI—with guaranteed preservation of citations, empirical data, and author intent.
            </p>
          </div>

          {/* Provider Status Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 border-dashed text-xs font-black shadow-xs ${
              providerStatus?.is_configured
                ? 'bg-[#9BAE83]/30 text-[#1F2C18] border-[#9BAE83]'
                : 'bg-[#E7B44F]/30 text-[#543A05] border-[#E7B44F]'
            }`}>
              {statusLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#435744]" />
                  <span>Checking Provider...</span>
                </>
              ) : providerStatus?.is_configured ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#435744] animate-pulse"></span>
                  <Cpu className="w-4 h-4 text-[#435744]" />
                  <span>{providerStatus.active_provider === 'google_gemini' ? 'Google Gemini' : 'OpenAI'} ({providerStatus.model_name})</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-[#B58422]" />
                  <span>GenAI Unconfigured</span>
                </>
              )}
            </div>

            <button
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              type="button"
              className="plush-button plush-mustard px-3.5 py-2 rounded-2xl text-xs font-black shadow-xs flex items-center gap-1.5"
              title="Provider Setup Details"
            >
              <Key className="w-3.5 h-3.5 embroidered-icon" />
              <span>{showConfigGuide ? 'Hide Setup' : 'API Setup'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Provider Setup Guide */}
        {showConfigGuide && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#E7B44F] text-xs text-[#30312D] space-y-3 shadow-inner animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-[#543A05] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#B58422]" />
                Configuring Real Hosted GenAI Providers
              </h4>
              <button 
                onClick={fetchProviderStatus}
                className="plush-button plush-cream text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-2xs"
              >
                <RefreshCw className="w-3 h-3 embroidered-icon" />
                <span>Recheck Status</span>
              </button>
            </div>
            <p className="leading-relaxed font-medium">
              AI-Guard communicates with real GenAI providers strictly through backend environment variables. API keys are <strong>never</strong> bundled into frontend code or logged to client terminals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F5F0E6] border border-dashed border-[#435744]/25 space-y-1.5">
                <span className="font-black text-[#435744] block">Option A: Google Gemini (Recommended)</span>
                <p className="text-[11px] text-[#30312D]/80">1. Obtain a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline font-bold text-[#435744]">Google AI Studio</a>.</p>
                <p className="text-[11px] text-[#30312D]/80">2. In your terminal or in <code className="bg-white px-1 rounded font-mono">backend/.env</code>, add:</p>
                <code className="block bg-[#30312D] text-[#9BAE83] p-1.5 rounded text-[10px] font-mono">GEMINI_API_KEY=your_key_here</code>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F0E6] border border-dashed border-[#435744]/25 space-y-1.5">
                <span className="font-black text-[#343B59] block">Option B: OpenAI</span>
                <p className="text-[11px] text-[#30312D]/80">1. Generate an API key from your OpenAI dashboard.</p>
                <p className="text-[11px] text-[#30312D]/80">2. In your environment or <code className="bg-white px-1 rounded font-mono">backend/.env</code>, add:</p>
                <code className="block bg-[#30312D] text-[#9BAE83] p-1.5 rounded text-[10px] font-mono">OPENAI_API_KEY=your_key_here</code>
              </div>
            </div>
          </div>
        )}
      </div>

      <DisclaimerBanner />

      {/* ERROR BANNER IF PRESENT */}
      {errorMessage && (
        <div className="knitted-card p-4 sm:p-5 bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#E58B36] text-[#30312D] flex items-start gap-3 shadow-md animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-[#E58B36] shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1 min-w-0">
            <span className="font-black text-[#9E4D09] text-xs sm:text-sm block">Transformation Notice</span>
            <p className="text-xs sm:text-sm text-[#30312D]/90 font-medium">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-xs font-black text-[#9E4D09] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* INPUT WORKSPACE */}
      <div className="knitted-card p-4 sm:p-6 lg:p-7 space-y-5 border-2 sm:border-3 border-dashed border-[#9BAE83]/60 shadow-md">
        
        {/* Workspace Toolbar: Presets & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-[#435744]/15">
          <div className="flex items-center gap-2 text-[#435744] font-black text-sm">
            <div className="w-7 h-7 rounded-full plush-sage flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 embroidered-icon" />
            </div>
            <span>Source Passage</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#30312D]/70">Presets:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-[#FFFDF8] text-xs font-bold text-[#30312D] border-2 border-dashed border-[#9BAE83] rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#435744]/30 shadow-2xs"
            >
              <option value="">Choose a benchmark sample...</option>
              {HUMANIZER_SAMPLES.map(sample => (
                <option key={sample.id} value={sample.id}>
                  {sample.title} ({sample.category})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setInputText('');
                setSelectedPresetId('');
                setErrorMessage(null);
              }}
              type="button"
              className="text-xs font-bold text-[#30312D]/70 hover:text-[#E58B36] flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type your draft text here (e.g. academic abstract, research notes, essays, or workplace drafts). AI-Guard will preserve all citations, data points, and factual intent..."
            rows={8}
            className="w-full bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#9BAE83]/60 focus:border-[#435744] rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-xs sm:text-sm text-[#30312D] placeholder-[#30312D]/40 font-medium leading-relaxed resize-y focus:outline-hidden transition-all shadow-inner"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#30312D]/70 font-semibold px-2">
            <div className="flex items-center gap-4">
              <span>{inputWordCount} Words</span>
              <span>•</span>
              <span className={inputCharCount > 15000 ? 'text-[#E58B36] font-black' : ''}>
                {inputCharCount.toLocaleString()} / 15,000 Characters
              </span>
            </div>
            {inputCharCount > 0 && inputCharCount < 10 && (
              <span className="text-[#E58B36] font-bold text-[11px]">
                Requires at least 10 characters for humanization
              </span>
            )}
            {editorReplacedNotice && (
              <span className="text-[#435744] font-black text-[11px] animate-pulse">
                ✓ Editor content updated with reviewed rewrite!
              </span>
            )}
          </div>
        </div>

        {/* STYLE SELECTOR (5 Styles) */}
        <div className="space-y-2 pt-2 border-t-2 border-dashed border-[#435744]/15">
          <label className="text-xs font-black uppercase tracking-wider text-[#435744] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Select Target Writing Style:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {REWRITE_STYLES.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  type="button"
                  className={`p-3 rounded-2xl border-2 sm:border-3 text-left transition-all ${
                    isSelected
                      ? 'plush-forest text-[#FFFDF9] shadow-md scale-102 border-dashed border-white/60'
                      : 'bg-[#FFFDF8] border-dashed border-[#435744]/25 hover:border-[#9BAE83] text-[#30312D] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base">{style.icon}</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#9BAE83]/20 text-[#435744]'
                    }`}>
                      {style.name}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-white/90' : 'text-[#30312D]/75'}`}>
                    {style.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* STRENGTH SELECTOR (3 Strengths) */}
        <div className="space-y-2 pt-2 border-t-2 border-dashed border-[#435744]/15">
          <label className="text-xs font-black uppercase tracking-wider text-[#435744] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Select Rewrite Strength:</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {REWRITE_STRENGTHS.map((strength) => {
              const isSelected = selectedStrength === strength.id;
              return (
                <button
                  key={strength.id}
                  onClick={() => setSelectedStrength(strength.id)}
                  type="button"
                  className={`p-3.5 rounded-2xl border-2 sm:border-3 text-left transition-all ${
                    isSelected
                      ? 'plush-mustard text-[#2D220A] shadow-md scale-102 border-dashed border-[#8C6212]'
                      : 'bg-[#FFFDF8] border-dashed border-[#435744]/25 hover:border-[#E7B44F] text-[#30312D] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-black text-xs sm:text-sm">{strength.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#8C6212] animate-ping" />}
                  </div>
                  <p className="text-[11px] text-[#30312D]/80 leading-relaxed font-medium">
                    {strength.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SUBMIT ACTION BUTTON */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#30312D]/70 font-medium">
            <span className="font-bold text-[#435744]">Preservation Guarantee:</span> Citations, empirical figures, and semantic intent are strictly protected.
          </div>

          <button
            onClick={handleHumanize}
            disabled={isRewriting || inputCharCount < 10}
            type="button"
            className="plush-button plush-forest text-[#FFFDF9] px-6 sm:px-8 py-3 rounded-full text-sm font-black shadow-md flex items-center gap-2 hover:scale-102 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isRewriting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin embroidered-icon-light" />
                <span>Transforming with GenAI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 embroidered-icon-light" />
                <span>Humanize Passage ({selectedStyle})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* COMPARISON WORKSPACE (If Rewritten Output Available) */}
      {rewrittenText && (
        <div className="knitted-card p-4 sm:p-6 lg:p-7 space-y-6 border-2 sm:border-3 border-dashed border-[#9BAE83] shadow-lg animate-fadeIn">
          
          {/* Comparison Header & Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#435744]/15">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#435744] bg-[#9BAE83]/30 px-3 py-0.5 rounded-full border border-dashed border-[#9BAE83]">
                  TRANSFORMATION RESULTS
                </span>
                <span className="text-xs font-black text-[#30312D]/70">
                  Style: {selectedStyle} • {selectedStrength}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#30312D] mt-1">
                Original vs. Rewritten Comparison
              </h2>
            </div>

            {/* View Tab Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#FFFDF8] p-1 rounded-2xl border-2 border-dashed border-[#435744]/25 flex items-center gap-1 shadow-2xs">
                <button
                  onClick={() => setActiveTab('side-by-side')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'side-by-side'
                      ? 'plush-forest text-[#FFFDF9] shadow-xs'
                      : 'text-[#30312D]/80 hover:bg-black/5'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'diff'
                      ? 'plush-forest text-[#FFFDF9] shadow-xs'
                      : 'text-[#30312D]/80 hover:bg-black/5'
                  }`}
                >
                  Diff View
                </button>
                <button
                  onClick={() => setActiveTab('original')}
                  className={`md:hidden px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'original'
                      ? 'plush-forest text-[#FFFDF9] shadow-xs'
                      : 'text-[#30312D]/80 hover:bg-black/5'
                  }`}
                >
                  Original Only
                </button>
                <button
                  onClick={() => setActiveTab('rewritten')}
                  className={`md:hidden px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'rewritten'
                      ? 'plush-forest text-[#FFFDF9] shadow-xs'
                      : 'text-[#30312D]/80 hover:bg-black/5'
                  }`}
                >
                  Rewritten Only
                </button>
              </div>

              {/* Sync Scroll Toggle */}
              {activeTab === 'side-by-side' && (
                <button
                  onClick={() => setSyncScroll(!syncScroll)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-dashed transition-all hidden md:flex items-center gap-1.5 ${
                    syncScroll
                      ? 'bg-[#9BAE83]/30 border-[#9BAE83] text-[#1F2C18]'
                      : 'bg-white border-[#435744]/25 text-[#30312D]/70'
                  }`}
                  title="Synchronize scrolling between original and rewritten panels"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Sync Scroll: {syncScroll ? 'ON' : 'OFF'}</span>
                </button>
              )}
            </div>
          </div>

          {/* VIEW: SIDE BY SIDE PANELS */}
          {activeTab === 'side-by-side' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Left Panel: Original Text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#435744] px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E7B44F]" />
                    Original Text Passage
                  </span>
                  <span className="text-[#30312D]/60">
                    {originalAnalytics.words} words • {originalAnalytics.characters} chars
                  </span>
                </div>
                <div
                  ref={origScrollRef}
                  onScroll={handleOrigScroll}
                  className="bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#435744]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 h-[340px] sm:h-[400px] overflow-y-auto text-xs sm:text-sm text-[#30312D]/80 leading-relaxed font-sans shadow-inner"
                >
                  <div className="whitespace-pre-wrap">{activeOriginalSnapshot || inputText}</div>
                </div>
              </div>

              {/* Right Panel: Editable Rewritten Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#435744] px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9BAE83]" />
                    Reviewed Rewritten Text (Editable)
                  </span>
                  <span className="text-[#30312D]/60">
                    {rewrittenAnalytics.words} words • {rewrittenAnalytics.characters} chars
                  </span>
                </div>
                <textarea
                  ref={rewrScrollRef}
                  onScroll={handleRewrScroll}
                  value={rewrittenText}
                  onChange={(e) => setRewrittenText(e.target.value)}
                  className="w-full bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#9BAE83] focus:border-[#435744] rounded-2xl sm:rounded-3xl p-4 sm:p-5 h-[340px] sm:h-[400px] overflow-y-auto text-xs sm:text-sm text-[#30312D] leading-relaxed font-sans focus:outline-hidden transition-all shadow-inner resize-none"
                />
              </div>

            </div>
          )}

          {/* VIEW: WORD-BY-WORD DIFF */}
          {activeTab === 'diff' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#9BAE83]/60 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-black text-[#30312D]">Diff Breakdown:</span>
                  <span className="flex items-center gap-1.5 text-[#1F2C18] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9BAE83]" />
                    +{diffStats.addedWords} Words Added
                  </span>
                  <span className="flex items-center gap-1.5 text-[#9E4D09] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E58B36]" />
                    -{diffStats.deletedWords} Words Replaced
                  </span>
                  <span className="text-[#30312D]/70 font-semibold">
                    {diffStats.unchangedWords} Unchanged Words
                  </span>
                </div>

                <span className="font-black px-2.5 py-1 rounded-full bg-[#435744]/10 text-[#435744] text-[11px]">
                  {diffStats.changePercentage}% Text Modified
                </span>
              </div>

              {/* Diff Text Container */}
              <div className="bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#9BAE83]/60 rounded-2xl sm:rounded-3xl p-5 max-h-[450px] overflow-y-auto text-xs sm:text-sm leading-relaxed font-sans shadow-inner whitespace-pre-wrap">
                {wordDiff.map((chunk, idx) => {
                  if (chunk.type === 'added') {
                    return (
                      <span
                        key={idx}
                        className="bg-[#9BAE83]/30 text-[#1F2C18] font-bold px-1 py-0.5 rounded-md border border-dashed border-[#9BAE83] mx-0.5"
                        title="Added or revised token"
                      >
                        {chunk.text}
                      </span>
                    );
                  }
                  if (chunk.type === 'deleted') {
                    return (
                      <span
                        key={idx}
                        className="bg-[#E58B36]/25 text-[#7A3606] line-through px-1 py-0.5 rounded-md mx-0.5"
                        title="Original omitted token"
                      >
                        {chunk.text}
                      </span>
                    );
                  }
                  return <span key={idx}>{chunk.text}</span>;
                })}
              </div>
            </div>
          )}

          {/* VIEW: SINGLE PANEL (MOBILE TABBED) */}
          {activeTab === 'original' && (
            <div className="bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 rounded-2xl p-4 text-xs leading-relaxed font-sans shadow-inner max-h-[350px] overflow-y-auto whitespace-pre-wrap">
              {activeOriginalSnapshot || inputText}
            </div>
          )}

          {activeTab === 'rewritten' && (
            <textarea
              value={rewrittenText}
              onChange={(e) => setRewrittenText(e.target.value)}
              className="w-full bg-[#FFFDF8] border-2 border-dashed border-[#9BAE83] rounded-2xl p-4 text-xs leading-relaxed font-sans shadow-inner min-h-[300px] resize-y"
            />
          )}

          {/* ACTION TOOLBAR: Copy, Replace, Reset, Export */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-[#435744]/15">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyRewritten}
                type="button"
                className="plush-button plush-forest text-[#FFFDF9] px-4 py-2 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5"
              >
                {copiedState ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedState ? 'Copied to Clipboard!' : 'Copy Rewritten Text'}</span>
              </button>

              <button
                onClick={handleExportTxt}
                type="button"
                className="plush-button plush-cream text-[#2D2F28] px-4 py-2 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 embroidered-icon" />
                <span>Export as .txt</span>
              </button>

              <button
                onClick={handleReplaceEditorContent}
                type="button"
                className="plush-button plush-mustard text-[#2D220A] px-4 py-2 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5"
                title="Loads this reviewed rewrite back into the main input editor"
              >
                <Edit3 className="w-3.5 h-3.5 embroidered-icon" />
                <span>Replace Editor Content</span>
              </button>

              <button
                onClick={handleResetToOriginal}
                type="button"
                className="text-xs font-bold text-[#30312D]/70 hover:text-[#E58B36] flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-black/5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Rewrite</span>
              </button>
            </div>

            {/* Optional Analyze Before & After Button */}
            <button
              onClick={handleAnalyzeBeforeAndAfter}
              disabled={isDetecting}
              type="button"
              className="plush-button plush-orange text-[#FFFDF9] px-5 py-2 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5 hover:scale-102 transition-all disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin embroidered-icon-light" />
                  <span>Evaluating Forensics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 embroidered-icon-light" />
                  <span>Analyze Before & After</span>
                </>
              )}
            </button>
          </div>

          {/* CONTENT INTEGRITY REVIEW CARD */}
          {integrityReview && (
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#435744]/25 space-y-3.5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-dashed border-[#435744]/15">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#435744]" />
                  <span className="font-black text-xs sm:text-sm text-[#30312D]">
                    Content Integrity Review
                  </span>
                </div>

                <div className={`px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black border border-dashed uppercase tracking-wider ${
                  integrityReview.status === 'passed'
                    ? 'bg-[#9BAE83]/30 text-[#1F2C18] border-[#9BAE83]'
                    : integrityReview.status === 'warning'
                    ? 'bg-[#E7B44F]/30 text-[#543A05] border-[#E7B44F]'
                    : 'bg-[#E58B36]/30 text-[#6B2E05] border-[#E58B36]'
                }`}>
                  Status: {integrityReview.status.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Itemized Review Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F5F0E6]/60 border border-dashed border-[#435744]/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[#435744]">
                    <span>In-Text Citations Checked:</span>
                    <span>{integrityReview.total_citations_checked}</span>
                  </div>
                  {integrityReview.verified_citations?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {integrityReview.verified_citations.map((c, i) => (
                        <span key={i} className="bg-[#9BAE83]/30 text-[#1F2C18] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  )}
                  {integrityReview.missing_citations?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {integrityReview.missing_citations.map((c, i) => (
                        <span key={i} className="bg-[#E58B36]/30 text-[#6B2E05] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          ⚠️ Missing: {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#F5F0E6]/60 border border-dashed border-[#435744]/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[#435744]">
                    <span>Key Figures & Percentages:</span>
                    <span>{integrityReview.total_numbers_checked}</span>
                  </div>
                  {integrityReview.verified_numbers?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {integrityReview.verified_numbers.map((n, i) => (
                        <span key={i} className="bg-[#9BAE83]/30 text-[#1F2C18] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          ✓ {n}
                        </span>
                      ))}
                    </div>
                  )}
                  {integrityReview.missing_numbers?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {integrityReview.missing_numbers.map((n, i) => (
                        <span key={i} className="bg-[#E58B36]/30 text-[#6B2E05] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          ⚠️ Altered: {n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Integrity notes */}
              <ul className="text-[11px] text-[#30312D]/80 space-y-1 list-disc pl-4 font-medium">
                {integrityReview.integrity_notes?.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* READABILITY & WRITING ANALYTICS */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#435744]/25 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#435744]/15">
              <span className="font-black text-xs sm:text-sm text-[#30312D] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#435744]" />
                Readability & Writing Quality Analytics
              </span>
              <span className="text-[10px] text-[#30312D]/60 font-bold uppercase tracking-wider">
                Before vs. After
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 text-center">
              
              <div className="p-3 rounded-2xl bg-[#F5F0E6]/70 border border-dashed border-[#435744]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#30312D]/60 block">Words</span>
                <div className="text-sm sm:text-base font-black text-[#30312D]">
                  {originalAnalytics.words} → {rewrittenAnalytics.words}
                </div>
                <span className={`text-[10px] font-bold ${
                  rewrittenAnalytics.words >= originalAnalytics.words ? 'text-[#435744]' : 'text-[#E58B36]'
                }`}>
                  {rewrittenAnalytics.words - originalAnalytics.words >= 0 ? '+' : ''}
                  {rewrittenAnalytics.words - originalAnalytics.words} delta
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F0E6]/70 border border-dashed border-[#435744]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#30312D]/60 block">Avg Sent Length</span>
                <div className="text-sm sm:text-base font-black text-[#30312D]">
                  {originalAnalytics.avgSentenceLength} → {rewrittenAnalytics.avgSentenceLength}
                </div>
                <span className="text-[10px] text-[#30312D]/70 font-semibold">words/sent</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F0E6]/70 border border-dashed border-[#435744]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#30312D]/60 block" title="Type-Token Ratio: Unique words / Total words">
                  Type-Token (TTR)
                </span>
                <div className="text-sm sm:text-base font-black text-[#435744]">
                  {originalAnalytics.typeTokenRatio} → {rewrittenAnalytics.typeTokenRatio}
                </div>
                <span className="text-[10px] text-[#30312D]/70 font-semibold">Lexical range</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F0E6]/70 border border-dashed border-[#435744]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#30312D]/60 block" title="Flesch Reading Ease Formula">
                  Flesch Ease
                </span>
                <div className="text-sm sm:text-base font-black text-[#30312D]">
                  {originalAnalytics.fleschScore} → {rewrittenAnalytics.fleschScore}
                </div>
                <span className="text-[10px] text-[#435744] font-bold">{rewrittenAnalytics.fleschLevel}</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F0E6]/70 border border-dashed border-[#435744]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#30312D]/60 block" title="Sentence Length Standard Deviation">
                  Burstiness (σ)
                </span>
                <div className="text-sm sm:text-base font-black text-[#30312D]">
                  {originalAnalytics.sentenceLengthStdDev} → {rewrittenAnalytics.sentenceLengthStdDev}
                </div>
                <span className="text-[10px] text-[#30312D]/70 font-semibold">Length variance</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F0E6]/70 border border-dashed border-[#435744]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#30312D]/60 block">Transitions</span>
                <div className="text-sm sm:text-base font-black text-[#30312D]">
                  {originalAnalytics.totalTransitions} → {rewrittenAnalytics.totalTransitions}
                </div>
                <span className="text-[10px] text-[#30312D]/70 font-semibold">Formulaic cues</span>
              </div>

            </div>

            <p className="text-[11px] text-[#30312D]/70 leading-relaxed font-medium">
              * Note: These metrics are calculated using documented formulas (such as Flesch Reading Ease and Type-Token Ratio) as stylistic indicators. They do not represent proof of authorship or human origin.
            </p>
          </div>

          {/* AI-GUARD DETECTOR EVALUATION (BEFORE & AFTER) */}
          {detectionError && (
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#E58B36] text-xs text-[#9E4D09] font-bold">
              ⚠️ {detectionError}
            </div>
          )}

          {detectionResults && (
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFFDF8] to-[#F5EEDB] border-2 sm:border-3 border-dashed border-[#435744] space-y-4 shadow-md animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-[#435744]/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#435744] text-[#FFFDF9] px-2.5 py-0.5 rounded-full">
                      Model Comparison
                    </span>
                    <span className="text-xs font-black text-[#30312D]">
                      AI-Guard Baseline (HC3 TF-IDF + Logistic Regression)
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#30312D]">
                    Statistical Detection Forensics (Before vs. After)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-2xl text-xs font-black border-2 border-dashed flex items-center gap-1.5 shadow-xs ${
                    detectionResults.deltaAI <= 0
                      ? 'bg-[#9BAE83]/30 text-[#1F2C18] border-[#9BAE83]'
                      : 'bg-[#E58B36]/30 text-[#6B2E05] border-[#E58B36]'
                  }`}>
                    {detectionResults.deltaAI <= 0 ? (
                      <>
                        <TrendingDown className="w-4 h-4 text-[#435744]" />
                        <span>AI Likelihood Shift: {detectionResults.deltaAI}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 text-[#E58B36]" />
                        <span>AI Likelihood Shift: +{detectionResults.deltaAI}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Model Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Before Card */}
                <div className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/25 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#30312D]/70 uppercase tracking-wider">
                      Original Text Score
                    </span>
                    <Badge variant={detectionResults.before.label === 1 ? 'ai' : 'human'}>
                      {detectionResults.before.prediction}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-[#F5F0E6]/80 border border-dashed border-[#435744]/20">
                      <span className="text-[10px] uppercase font-bold text-[#30312D]/60 block">AI Likelihood</span>
                      <span className="text-lg font-black text-[#E58B36]">
                        {Math.round(detectionResults.before.ai_probability * 100)}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F5F0E6]/80 border border-dashed border-[#435744]/20">
                      <span className="text-[10px] uppercase font-bold text-[#30312D]/60 block">Confidence</span>
                      <span className="text-lg font-black text-[#435744]">
                        {Math.round(detectionResults.before.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* After Card */}
                <div className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#9BAE83] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#435744] uppercase tracking-wider">
                      Rewritten Text Score
                    </span>
                    <Badge variant={detectionResults.after.label === 1 ? 'ai' : 'human'}>
                      {detectionResults.after.prediction}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-[#F5F0E6]/80 border border-dashed border-[#9BAE83]">
                      <span className="text-[10px] uppercase font-bold text-[#30312D]/60 block">AI Likelihood</span>
                      <span className="text-lg font-black text-[#435744]">
                        {Math.round(detectionResults.after.ai_probability * 100)}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F5F0E6]/80 border border-dashed border-[#9BAE83]">
                      <span className="text-[10px] uppercase font-bold text-[#30312D]/60 block">Confidence</span>
                      <span className="text-lg font-black text-[#435744]">
                        {Math.round(detectionResults.after.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Research Disclaimer */}
              <div className="p-3 rounded-xl bg-[#FFFDF8]/80 border border-dashed border-[#435744]/25 text-[11px] text-[#30312D]/85 leading-relaxed font-medium">
                <strong>Academic Governance Notice:</strong> Score shifts reflect how the linear TF-IDF classifier maps vocabulary distributions across the Hello-SimpleAI/HC3 n-gram dictionary. A reduced AI probability score does not guarantee human provenance and should never be used as a guarantee for academic evasion.
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
