/**
 * Text Analysis & Stylometrics Utility for AI-Guard Prototype
 * Computes word metrics, lexical diversity, burstiness, and sentence segmentation.
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
 * Computes stylometric signals:
 * - Type-Token Ratio (Lexical Diversity)
 * - Burstiness (variance of sentence lengths)
 * - Approximate Perplexity Index
 */
export function computeStylometrics(text) {
  const metrics = countTextMetrics(text);
  if (metrics.words < 10) {
    return {
      perplexity: 50.0,
      burstiness: 0.50,
      lexicalDiversity: 0.50,
      avgSentenceLength: metrics.avgSentenceLength || 15
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
    // Normalized Fano factor / coefficient of variation mapped to [0, 1]
    burstiness = Number(Math.min(1, Math.max(0.1, (stdDev / (mean || 1)))).toFixed(2));
  }

  // Heuristic pseudo-perplexity derived from lexical entropy & uniform burstiness
  // LLMs typically have low perplexity (< 35) and low burstiness (< 0.3)
  const basePerplexity = (lexicalDiversity * 70) + (burstiness * 40);
  const perplexity = Number(Math.min(120, Math.max(15, basePerplexity)).toFixed(1));

  return {
    perplexity,
    burstiness,
    lexicalDiversity,
    avgSentenceLength: metrics.avgSentenceLength
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
    // Generate organic slight variance around overall score
    const wordCount = sentence.split(/\s+/).length;
    const variance = Math.sin(idx * 1.7) * 8 + (wordCount > 25 ? -5 : 5);
    const score = Math.max(2, Math.min(99, Math.round(overallScore + variance)));
    
    return {
      text: sentence,
      score,
      wordCount
    };
  });
}
