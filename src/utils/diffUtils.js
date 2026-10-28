/**
 * Robust Word-Level Diff Utility for Humanizer Studio
 * Computes granular word and token diffs between original and rewritten texts
 * while preserving paragraph formatting, spaces, and punctuation.
 */

export function computeWordDiff(originalText = '', rewrittenText = '') {
  if (!originalText && !rewrittenText) return [];
  if (!originalText) return [{ type: 'added', text: rewrittenText }];
  if (!rewrittenText) return [{ type: 'deleted', text: originalText }];

  // Tokenize preserving whitespaces and words
  const tokenize = (text) => {
    // Splits text into words, newlines, and space sequences
    return text.match(/\S+|\n|\r\n|[ \t]+/g) || [];
  };

  const origTokens = tokenize(originalText);
  const rewrTokens = tokenize(rewrittenText);

  // Compute Longest Common Subsequence (LCS) matrix for token sequences
  const n = origTokens.length;
  const m = rewrTokens.length;

  // For very long texts (>1500 tokens), use a bounded window to keep performance snappy
  if (n * m > 2500000) {
    return computeChunkFallbackDiff(origTokens, rewrTokens);
  }

  // Standard dynamic programming LCS
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (origTokens[i - 1] === rewrTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to reconstruct the diff
  let i = n;
  let j = m;
  const rawDiff = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origTokens[i - 1] === rewrTokens[j - 1]) {
      rawDiff.push({ type: 'unchanged', text: origTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({ type: 'added', text: rewrTokens[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.push({ type: 'deleted', text: origTokens[i - 1] });
      i--;
    }
  }

  rawDiff.reverse();

  // Merge consecutive tokens of the same type for cleaner rendering
  return mergeConsecutiveTokens(rawDiff);
}

function mergeConsecutiveTokens(tokens) {
  if (tokens.length === 0) return [];
  const merged = [tokens[0]];

  for (let i = 1; i < tokens.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = tokens[i];

    if (prev.type === curr.type) {
      prev.text += curr.text;
    } else {
      merged.push({ ...curr });
    }
  }
  return merged;
}

function computeChunkFallbackDiff(origTokens, rewrTokens) {
  // Simplified chunking for extremely large texts
  return [
    { type: 'deleted', text: origTokens.join('') },
    { type: 'added', text: rewrTokens.join('') }
  ];
}

/**
 * Calculates summary statistics about the changes
 */
export function getDiffStats(diffChunks = []) {
  let addedWords = 0;
  let deletedWords = 0;
  let unchangedWords = 0;

  diffChunks.forEach(chunk => {
    const words = (chunk.text.trim().match(/\S+/g) || []).length;
    if (chunk.type === 'added') addedWords += words;
    else if (chunk.type === 'deleted') deletedWords += words;
    else unchangedWords += words;
  });

  const totalModifications = addedWords + deletedWords;
  const changePercentage = unchangedWords + deletedWords > 0 
    ? Math.round((totalModifications / (unchangedWords + deletedWords)) * 100) 
    : 0;

  return {
    addedWords,
    deletedWords,
    unchangedWords,
    totalModifications,
    changePercentage: Math.min(100, changePercentage)
  };
}
