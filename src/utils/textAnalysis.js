/**
 * Text Analysis & Stylometrics Utility for AI-Guard Prototype
 * Computes word metrics, lexical diversity, burstiness, sentence segmentation,
 * Flesch Reading Ease, and punctuation distribution.
 */

export function countTextMetrics(text) {
  if (!text || !text.trim()) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      avgSentenceLength: 0
    };
  }

  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const sentences = cleanText
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 0);

  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const avgSentenceLength = Number((wordCount / sentenceCount).toFixed(1));

  return {
    words: wordCount,
    characters: cleanText.length,
    charactersNoSpaces: cleanText.replace(/\s/g, '').length,
    sentences: sentenceCount,
    avgSentenceLength
  };
}

/**
 * Approximate syllable counter for an English word
 */
function countWordSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean || clean.length <= 3) return 1;
  const processed = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
  const matches = processed.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Computes Flesch Reading Ease score
 * Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
 * Higher = easier to read (plain English: 60-70, academic: 30-50, complex: < 30)
 */
export function computeFleschReadingEase(text) {
  const metrics = countTextMetrics(text);
  if (metrics.words < 5) return 65.0;

  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  if (words.length === 0) return 65.0;

  let totalSyllables = 0;
  for (const w of words) {
    totalSyllables += countWordSyllables(w);
  }

  const wordsPerSentence = metrics.words / metrics.sentences;
  const syllablesPerWord = totalSyllables / words.length;

  const score = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  return Number(Math.max(0, Math.min(100, score)).toFixed(1));
}

/**
 * Computes punctuation distribution for stylometric fingerprinting
 */
export function computePunctuationDistribution(text) {
  if (!text) {
    return [
      { name: 'Periods (.)', count: 0, percentage: 0 },
      { name: 'Commas (,)', count: 0, percentage: 0 },
      { name: 'Semicolons (;)', count: 0, percentage: 0 },
      { name: 'Colons (:)', count: 0, percentage: 0 },
      { name: 'Hyphens/Dashes (-)', count: 0, percentage: 0 },
      { name: 'Quotes ("\')', count: 0, percentage: 0 }
    ];
  }

  const periods = (text.match(/\./g) || []).length;
  const commas = (text.match(/,/g) || []).length;
  const semicolons = (text.match(/;/g) || []).length;
  const colons = (text.match(/:/g) || []).length;
  const dashes = (text.match(/[-—–]/g) || []).length;
  const quotes = (text.match(/["'“”‘’]/g) || []).length;
  const total = Math.max(1, periods + commas + semicolons + colons + dashes + quotes);

  return [
    { name: 'Periods (.)', count: periods, percentage: Math.round((periods / total) * 100) },
    { name: 'Commas (,)', count: commas, percentage: Math.round((commas / total) * 100) },
    { name: 'Semicolons (;)', count: semicolons, percentage: Math.round((semicolons / total) * 100) },
    { name: 'Colons (:)', count: colons, percentage: Math.round((colons / total) * 100) },
    { name: 'Hyphens (-)', count: dashes, percentage: Math.round((dashes / total) * 100) },
    { name: 'Quotes ("\')', count: quotes, percentage: Math.round((quotes / total) * 100) }
  ];
}

/**
 * Computes stylometric signals:
 * - Type-Token Ratio (Lexical Diversity)
 * - Burstiness (variance of sentence lengths)
 * - Approximate Perplexity Index
 * - Flesch Reading Ease
 * - Punctuation breakdown
 */
export function computeStylometrics(text) {
  const metrics = countTextMetrics(text);
  if (metrics.words < 10) {
    return {
      perplexity: 50.0,
      burstiness: 0.50,
      lexicalDiversity: 0.50,
      avgSentenceLength: metrics.avgSentenceLength || 15,
      fleschReadingEase: 60.0,
      punctuation: computePunctuationDistribution(text)
    };
  }

  const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
  const uniqueWords = new Set(words);
  const lexicalDiversity = words.length > 0 
    ? Number((uniqueWords.size / words.length).toFixed(2)) 
    : 0.50;

  // Sentence length variance (Burstiness)
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim().split(/\s+/).length)
    .filter(len => len > 0);

  let burstiness = 0.5;
  if (sentences.length > 1) {
    const mean = sentences.reduce((a, b) => a + b, 0) / sentences.length;
    const variance = sentences.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / sentences.length;
    const stdDev = Math.sqrt(variance);
    burstiness = Number(Math.min(1, Math.max(0.1, (stdDev / (mean || 1)))).toFixed(2));
  }

  // Heuristic pseudo-perplexity derived from lexical entropy & uniform burstiness
  const basePerplexity = (lexicalDiversity * 70) + (burstiness * 40);
  const perplexity = Number(Math.min(120, Math.max(15, basePerplexity)).toFixed(1));
  const fleschReadingEase = computeFleschReadingEase(text);
  const punctuation = computePunctuationDistribution(text);

  return {
    perplexity,
    burstiness,
    lexicalDiversity,
    avgSentenceLength: metrics.avgSentenceLength,
    fleschReadingEase,
    punctuation
  };
}

/**
 * Splits text into sentences and generates sentence-level scores for visualization
 */
export function segmentSentences(text, overallScore = 50) {
  if (!text) return [];

  const rawSentences = text
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 0);

  return rawSentences.map((sentence, idx) => {
    const wordCount = sentence.split(/\s+/).length;
    const variance = Math.sin(idx * 1.7) * 8 + (wordCount > 25 ? -5 : 5);
    const score = Math.max(2, Math.min(99, Math.round(overallScore + variance)));
    
    return {
      sentence: sentence,
      label: score >= 50 ? 1 : 0,
      ai_probability: score / 100,
      is_experimental: true,
      note: "Experimental sentence slice inference"
    };
  });
}

/**
 * Local fallback heuristic estimator if FastAPI backend is offline.
 * Clearly marked as local heuristic estimate.
 */
export function computeLocalFallbackPrediction(text) {
  const metrics = countTextMetrics(text);
  const stylometrics = computeStylometrics(text);

  // Heuristic based on lexical diversity, burstiness, transition cues
  const aiPhrases = [
    'in conclusion', 'furthermore', 'moreover', 'multifaceted', 'paramount',
    'it is crucial', 'transformative', 'delve', 'pave the way', 'harmonious',
    'testament', 'foster', 'landscape of', 'realm of', 'ever-evolving'
  ];
  const lower = text.toLowerCase();
  let aiIndicatorCount = 0;
  for (const phrase of aiPhrases) {
    if (lower.includes(phrase)) aiIndicatorCount++;
  }

  // Low burstiness + moderate lexical diversity + transition phrases = higher AI likelihood
  let baseProb = 50;
  if (stylometrics.burstiness < 0.35) baseProb += 18;
  else if (stylometrics.burstiness > 0.65) baseProb -= 22;

  if (stylometrics.lexicalDiversity < 0.45) baseProb += 12;
  else if (stylometrics.lexicalDiversity > 0.65) baseProb -= 15;

  baseProb += Math.min(25, aiIndicatorCount * 7);

  const probAI = Math.max(4, Math.min(96, Math.round(baseProb)));
  const probHuman = 100 - probAI;
  const isAI = probAI >= 50;

  return {
    prediction: isAI ? 'AI-Generated' : 'Human-Written',
    label: isAI ? 1 : 0,
    probAI,
    probHuman,
    confidenceScore: Math.abs(probAI - 50) * 2,
    rawAIProbability: probAI / 100,
    rawHumanProbability: probHuman / 100,
    metrics: {
      word_count: metrics.words,
      character_count: metrics.characters,
      sentence_count: metrics.sentences,
      avg_sentence_length: metrics.avgSentenceLength
    },
    sentenceAnalysis: segmentSentences(text, probAI),
    modelInfo: {
      model_type: 'Local Heuristic Fallback (FastAPI offline)',
      vocabulary_size: 'N/A'
    },
    stylometrics,
    timestamp: new Date().toLocaleTimeString(),
    disclaimer: 'Probabilistic estimate generated via client-side linguistic heuristics because the FastAPI inference backend is currently offline. Start uvicorn for true HC3 model inference.',
    isLocalFallback: true
  };
}
