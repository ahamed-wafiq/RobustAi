/**
 * AI-Guard Robustness Testing Benchmark Data
 * Synthetic benchmarks for adversarial evasion attacks and cross-domain shift evaluation.
 */

export const ATTACK_SCENARIOS = [
  {
    id: "paraphrase",
    name: "Automated Paraphrasing",
    technique: "Multi-pass LLM rephrasing / Commercial paraphraser",
    threatLevel: "High",
    description: "Rewrites sentences using alternative syntactic structures while preserving underlying discourse meaning.",
    originalText: "Artificial intelligence has fundamentally transformed the landscape of modern education in profound and multifaceted ways. Intelligent tutoring systems allow students to engage with personalized learning materials tailored precisely to their individual needs.",
    perturbedText: "Machine learning has drastically altered contemporary schooling frameworks across numerous dimensions. Digital mentorship platforms enable pupils to interact with custom instructional content configured specifically for individual demands.",
    originalProbAI: 95,
    perturbedProbAI: 54, // 41% drop!
    vulnerabilityAnalysis: "Baseline n-gram overlap falls from 88% to 14%. Contextual transformer confidence degrades due to varied syntactic phrasing and novel n-gram collocations."
  },
  {
    id: "synonym",
    name: "Synonym Substitution (WordNet / Masked LM)",
    technique: "Ranked vocabulary replacement using context-preserving synonyms",
    threatLevel: "Medium",
    description: "Replaces 15-25% of content nouns, verbs, and adjectives with low-frequency equivalents to inflate statistical perplexity.",
    originalText: "The empirical findings demonstrate that autoregressive models penalize syntactic violations uniformly across all test corpora.",
    perturbedText: "The experiential discoveries substantiate that next-token systems castigate grammatical infractions evenly throughout every evaluated corpus.",
    originalProbAI: 89,
    perturbedProbAI: 61,
    vulnerabilityAnalysis: "Perplexity increases from 24.3 to 58.7. Statistical burstiness is artificially elevated, leading baseline classifiers to erroneously suspect human variance."
  },
  {
    id: "homoglyph",
    name: "Homoglyph & Zero-Width Perturbation",
    technique: "Unicode character substitution (e.g., Cyrillic 'а' replacing Latin 'a')",
    threatLevel: "Critical (for un-sanitized tokenizers)",
    description: "Substitutes visually indistinguishable Unicode characters into common tokens, fragmenting BPE and WordPiece subword tokens.",
    originalText: "Recent investigations into distributed representations of semantic memory have revealed subtle constraints.",
    perturbedText: "Rеcеnt invеstigаtiоns intо distributеd rерrеsеntаtiоns оf sеmаntiс mеmоry hаvе rеvеаlеd subtlе соnstrаints.",
    originalProbAI: 92,
    perturbedProbAI: 31,
    vulnerabilityAnalysis: "Without aggressive Unicode normalization (NFKC) during preprocessing, tokenizer fragmentation explodes vocabulary index mapping, destroying embedding coherence."
  },
  {
    id: "stylistic-marker",
    name: "Formalization / Prompt Injection",
    technique: "Injecting rhetorical conversational framing and persona prompts",
    threatLevel: "Medium-High",
    description: "Appends authentic human conversational flourishes, rhetorical queries, and persona cues to elevate burstiness.",
    originalText: "Moreover, it is crucial to recognize that the ethical implications surrounding academic integrity must be addressed through comprehensive policy frameworks.",
    perturbedText: "Honestly, who can overlook the ethics here? When it comes to academic integrity, we definitely need airtight policies—and we needed them yesterday.",
    originalProbAI: 93,
    perturbedProbAI: 48,
    vulnerabilityAnalysis: "Injected contractions ('who can', 'we definitely') trigger human-favoring stylistic priors in linear baselines, masking the synthetic origin of the core arguments."
  },
  {
    id: "whitespace",
    name: "Whitespace Manipulation",
    technique: "Non-breaking spaces, zero-width spaces, and soft linebreaks",
    threatLevel: "High",
    description: "Inserts invisible zero-width spaces (U+200B) and irregular whitespace to disrupt subword tokenization boundaries.",
    originalText: "Deep learning models require extensive computational resources to train on large-scale datasets.",
    perturbedText: "Deep\u200B learning\u200B models\u200B require\u200B extensive\u200B computational\u200B resources\u200B to\u200B train\u200B on\u200B large-scale\u200B datasets.",
    originalProbAI: 94,
    perturbedProbAI: 36,
    vulnerabilityAnalysis: "Without NFKC normalization, zero-width characters cause tokenizers to split standard words into multiple unknown/rare fragments, causing the model to lose n-gram context."
  }
];

export const PERTURBATION_DECAY_CURVE = [
  { perturbationRate: "0% (Raw)", baselineDetector: 82.4, transformerDetector: 94.6, aiGuardEnsemble: 94.6 },
  { perturbationRate: "10% Swaps", baselineDetector: 68.1, transformerDetector: 88.2, aiGuardEnsemble: 91.5 },
  { perturbationRate: "20% Swaps", baselineDetector: 52.3, transformerDetector: 76.4, aiGuardEnsemble: 85.0 },
  { perturbationRate: "30% Swaps", baselineDetector: 39.7, transformerDetector: 61.8, aiGuardEnsemble: 76.2 },
  { perturbationRate: "40% Swaps", baselineDetector: 28.5, transformerDetector: 48.3, aiGuardEnsemble: 66.8 },
  { perturbationRate: "50% Swaps", baselineDetector: 19.2, transformerDetector: 38.1, aiGuardEnsemble: 57.4 }
];

export const DOMAIN_SHIFT_BENCHMARKS = [
  { domain: "Computer Science (In-Domain)", precision: 96.2, recall: 94.8, f1: 95.5, evasionRate: 4.2 },
  { domain: "Biomedical Literature", precision: 91.4, recall: 89.2, f1: 90.3, evasionRate: 9.8 },
  { domain: "Creative Narrative Fiction", precision: 79.1, recall: 76.5, f1: 77.8, evasionRate: 22.4 },
  { domain: "Online Social Discourse (Reddit/X)", precision: 74.3, recall: 71.0, f1: 72.6, evasionRate: 27.5 },
  { domain: "Non-Native English Academic (ESL)", precision: 82.5, recall: 79.8, f1: 81.1, evasionRate: 17.6 }
];
