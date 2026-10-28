/**
 * AI-Guard Humanizer Studio Preset Sample Texts
 * Standardized passages representing common writing scenarios with citations, numbers, and repetitive structures.
 */

export const HUMANIZER_SAMPLES = [
  {
    id: 'academic-repetitive',
    title: 'Academic Draft with Citations',
    category: 'Research & Scholarly',
    style: 'Academic',
    strength: 'Balanced Rewrite',
    description: 'Scholarly passage with formal in-text citations, statistics, and slightly stiff transition phrasing.',
    text: `Artificial intelligence has fundamentally transformed the landscape of computational linguistics in multifaceted ways. Furthermore, the integration of transformer models allows researchers to analyze syntactic patterns with remarkable accuracy (Vaswani et al., 2017). In addition to enhancing model performance, researchers can leverage self-supervised pretraining to reduce annotation costs by approximately 45.8% across benchmark corpora. Moreover, it is crucial to recognize that the empirical findings documented by (Devlin et al., 2019) demonstrated significant gains across 11 NLP tasks. Ultimately, the harmonious convergence of deep learning and semantic representation paves the way toward more robust cognitive architectures in 2026 [1].`
  },
  {
    id: 'ai-formulaic-essay',
    title: 'Formulaic AI-Generated Essay',
    category: 'AI Output Smoothing',
    style: 'Natural',
    strength: 'Extensive Rewrite',
    description: 'Passage exhibiting common LLM hallmarks: repetitive transitional adverbs and uniform sentence lengths.',
    text: `In today's fast-paced digital era, renewable energy stands as a testament to human innovation. Furthermore, solar panels have witnessed a remarkable decrease in production costs of 68% over the past decade. Moreover, wind turbines continue to supply clean electricity to millions of households worldwide. In addition, governments across 24 nations have enacted comprehensive regulatory policies to foster green infrastructure investments. In conclusion, navigating the transition toward sustainable energy sources is of paramount importance for fostering an environmentally resilient society.`
  },
  {
    id: 'corporate-memo',
    title: 'Corporate Executive Update',
    category: 'Workplace & Business',
    style: 'Professional',
    strength: 'Balanced Rewrite',
    description: 'Internal operational briefing containing performance milestones, deadlines, and numerical deliverables.',
    text: `Per our previous discussion regarding the Q3 product roadmap, we are currently tracking 14 days ahead of the original target deadline for Phase 2. Specifically, our engineering teams delivered 98.2% test coverage across all microservices, resulting in a 34% reduction in server response latency. However, budget allocations for external security auditing must be finalized before November 15, 2026. Please review the attached cost breakdown and provide sign-off by this Friday at 5:00 PM EST so procurement can proceed without delay.`
  },
  {
    id: 'technical-dense',
    title: 'Dense Technical Explanation',
    category: 'Technical Simplification',
    style: 'Simple English',
    strength: 'Extensive Rewrite',
    description: 'Overly complex technical passage that benefits from plain, accessible sentence restructuring.',
    text: `The computational complexity inherent in traversing high-dimensional topological manifold approximations frequently precipitates catastrophic memory overhead in legacy database clusters. In order to mitigate this computational bottleneck, engineers must systematically decouple distributed caching mechanisms from the primary relational storage tier, thereby facilitating a 60% throughput enhancement during peak concurrency intervals.`
  }
];
