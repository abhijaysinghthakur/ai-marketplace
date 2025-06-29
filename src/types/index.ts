export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  strengths: string[];
  pricing: {
    inputTokens: number;
    outputTokens: number;
  };
  maxTokens: number;
  responseTime: 'fast' | 'medium' | 'slow';
  accuracy: number;
  icon: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  totalTokens: number;
  totalCost: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelUsed?: AIModel;
  tokens?: number;
  cost?: number;
  reasoning?: string;
}

export interface ModelSelection {
  selectedModel: AIModel;
  confidence: number;
  reasoning: string;
  alternatives: AIModel[];
}