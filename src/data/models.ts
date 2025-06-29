import { AIModel } from '../types';

export const aiModels: AIModel[] = [
  {
    id: 'gpt-4-turbo-preview',
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
    id: 'claude-3-opus-20240229',
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
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced model for general tasks with good speed and accuracy',
    capabilities: ['reasoning', 'analysis', 'creative-writing', 'code', 'research'],
    strengths: ['Balanced performance', 'Versatility', 'Cost-effective', 'Reliable'],
    pricing: { inputTokens: 0.003, outputTokens: 0.015 },
    maxTokens: 200000,
    responseTime: 'fast',
    accuracy: 90,
    icon: '🎵'
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
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and cost-effective for general tasks and conversations',
    capabilities: ['reasoning', 'code', 'creative-writing', 'chat'],
    strengths: ['Speed', 'Cost-effective', 'Versatile', 'Reliable'],
    pricing: { inputTokens: 0.0005, outputTokens: 0.0015 },
    maxTokens: 16385,
    responseTime: 'fast',
    accuracy: 85,
    icon: '⚡'
  },
  {
    id: 'claude-3-haiku-20240307',
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