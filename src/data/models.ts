import { AIModel } from '../types';

export const aiModels: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Most capable model for complex reasoning, analysis, and creative tasks',
    capabilities: ['reasoning', 'analysis', 'creative-writing', 'code', 'math', 'research'],
    strengths: ['Complex reasoning', 'Code generation', 'Creative writing', 'Analysis'],
    pricing: { inputTokens: 0.01, outputTokens: 0.03 },
    maxTokens: 128000,
    responseTime: 'medium',
    accuracy: 95,
    icon: '🧠'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Excellent for nuanced conversations, analysis, and ethical reasoning',
    capabilities: ['reasoning', 'analysis', 'creative-writing', 'research', 'ethics'],
    strengths: ['Nuanced analysis', 'Ethical reasoning', 'Long conversations', 'Research'],
    pricing: { inputTokens: 0.015, outputTokens: 0.075 },
    maxTokens: 200000,
    responseTime: 'medium',
    accuracy: 94,
    icon: '🎭'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Fast and efficient for general tasks with multimodal capabilities',
    capabilities: ['reasoning', 'code', 'multimodal', 'search', 'math'],
    strengths: ['Speed', 'Multimodal', 'Integration', 'Real-time data'],
    pricing: { inputTokens: 0.0005, outputTokens: 0.0015 },
    maxTokens: 32000,
    responseTime: 'fast',
    accuracy: 88,
    icon: '💎'
  },
  {
    id: 'llama-2-70b',
    name: 'Llama 2 70B',
    provider: 'Meta',
    description: 'Open-source model great for general tasks and customization',
    capabilities: ['reasoning', 'code', 'creative-writing', 'chat'],
    strengths: ['Open source', 'Customizable', 'Cost-effective', 'Privacy'],
    pricing: { inputTokens: 0.0007, outputTokens: 0.0009 },
    maxTokens: 4096,
    responseTime: 'fast',
    accuracy: 85,
    icon: '🦙'
  },
  {
    id: 'codellama-34b',
    name: 'CodeLlama 34B',
    provider: 'Meta',
    description: 'Specialized for code generation, debugging, and programming tasks',
    capabilities: ['code', 'debugging', 'refactoring', 'documentation'],
    strengths: ['Code generation', 'Debugging', 'Multiple languages', 'Documentation'],
    pricing: { inputTokens: 0.0005, outputTokens: 0.0008 },
    maxTokens: 16384,
    responseTime: 'fast',
    accuracy: 92,
    icon: '💻'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'European AI model with strong multilingual capabilities',
    capabilities: ['reasoning', 'multilingual', 'code', 'analysis'],
    strengths: ['Multilingual', 'European compliance', 'Reasoning', 'Efficiency'],
    pricing: { inputTokens: 0.008, outputTokens: 0.024 },
    maxTokens: 32000,
    responseTime: 'medium',
    accuracy: 90,
    icon: '🌍'
  },
  {
    id: 'palm-2',
    name: 'PaLM 2',
    provider: 'Google',
    description: 'Efficient model for reasoning and multilingual tasks',
    capabilities: ['reasoning', 'multilingual', 'math', 'science'],
    strengths: ['Multilingual', 'Scientific reasoning', 'Mathematics', 'Efficiency'],
    pricing: { inputTokens: 0.0005, outputTokens: 0.001 },
    maxTokens: 8192,
    responseTime: 'fast',
    accuracy: 87,
    icon: '🌴'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fast and cost-effective for simple tasks and quick responses',
    capabilities: ['chat', 'simple-tasks', 'summarization', 'qa'],
    strengths: ['Speed', 'Cost-effective', 'Simple tasks', 'Quick responses'],
    pricing: { inputTokens: 0.00025, outputTokens: 0.00125 },
    maxTokens: 200000,
    responseTime: 'fast',
    accuracy: 82,
    icon: '🌸'
  }
];