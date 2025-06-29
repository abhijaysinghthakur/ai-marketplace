import { AIModel } from '../types';
import { aiModels } from '../data/models';

export interface ModelSelectionCriteria {
  taskType: string;
  complexity: 'low' | 'medium' | 'high';
  requiresSpeed: boolean;
  requiresAccuracy: boolean;
  budgetSensitive: boolean;
  requiresMultimodal: boolean;
  requiresCode: boolean;
  requiresCreative: boolean;
  requiresReasoning: boolean;
}

export function analyzePrompt(prompt: string): ModelSelectionCriteria {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect task type and requirements
  const requiresCode = /code|program|debug|function|algorithm|script|api|database|sql|javascript|python|react|html|css/.test(lowerPrompt);
  const requiresCreative = /write|story|poem|creative|blog|article|marketing|content|design|brainstorm/.test(lowerPrompt);
  const requiresReasoning = /analyze|compare|explain|reason|logic|problem|solve|strategy|plan|decision/.test(lowerPrompt);
  const requiresSpeed = /quick|fast|urgent|immediately|asap|now/.test(lowerPrompt);
  const requiresAccuracy = /accurate|precise|exact|detailed|thorough|comprehensive|research/.test(lowerPrompt);
  const budgetSensitive = /cheap|cost|budget|affordable|economical/.test(lowerPrompt);
  const requiresMultimodal = /image|picture|photo|visual|diagram|chart|multimodal/.test(lowerPrompt);
  
  // Determine complexity
  let complexity: 'low' | 'medium' | 'high' = 'medium';
  if (/simple|basic|easy|quick/.test(lowerPrompt)) complexity = 'low';
  if (/complex|advanced|detailed|comprehensive|difficult/.test(lowerPrompt)) complexity = 'high';
  
  // Determine task type
  let taskType = 'general';
  if (requiresCode) taskType = 'coding';
  else if (requiresCreative) taskType = 'creative';
  else if (requiresReasoning) taskType = 'reasoning';
  else if (requiresMultimodal) taskType = 'multimodal';
  
  return {
    taskType,
    complexity,
    requiresSpeed,
    requiresAccuracy,
    budgetSensitive,
    requiresMultimodal,
    requiresCode,
    requiresCreative,
    requiresReasoning
  };
}

export function selectBestModel(criteria: ModelSelectionCriteria): {
  selectedModel: AIModel;
  confidence: number;
  reasoning: string;
  alternatives: AIModel[];
} {
  const scoredModels = aiModels.map(model => {
    let score = 0;
    let reasoning: string[] = [];
    
    // Task-specific scoring
    if (criteria.requiresCode && model.capabilities.includes('code')) {
      score += 30;
      reasoning.push('excellent for coding tasks');
    }
    
    if (criteria.requiresCreative && model.capabilities.includes('creative-writing')) {
      score += 25;
      reasoning.push('strong creative capabilities');
    }
    
    if (criteria.requiresReasoning && model.capabilities.includes('reasoning')) {
      score += 25;
      reasoning.push('advanced reasoning abilities');
    }
    
    if (criteria.requiresMultimodal && model.capabilities.includes('multimodal')) {
      score += 35;
      reasoning.push('multimodal support');
    }
    
    // Speed requirements
    if (criteria.requiresSpeed) {
      if (model.responseTime === 'fast') {
        score += 20;
        reasoning.push('fast response time');
      } else if (model.responseTime === 'medium') {
        score += 10;
      } else {
        score -= 10;
      }
    }
    
    // Accuracy requirements
    if (criteria.requiresAccuracy) {
      score += (model.accuracy - 80) * 2;
      if (model.accuracy >= 90) reasoning.push('high accuracy');
    }
    
    // Budget considerations
    if (criteria.budgetSensitive) {
      const avgCost = (model.pricing.inputTokens + model.pricing.outputTokens) / 2;
      if (avgCost < 0.002) {
        score += 20;
        reasoning.push('cost-effective');
      } else if (avgCost > 0.02) {
        score -= 15;
      }
    }
    
    // Complexity matching
    if (criteria.complexity === 'high' && model.accuracy >= 90) {
      score += 15;
      reasoning.push('handles complex tasks well');
    } else if (criteria.complexity === 'low' && model.responseTime === 'fast') {
      score += 10;
      reasoning.push('efficient for simple tasks');
    }
    
    // Provider-specific bonuses
    if (model.provider === 'OpenAI' && (criteria.requiresCode || criteria.requiresReasoning)) {
      score += 5;
    }
    if (model.provider === 'Anthropic' && criteria.requiresReasoning) {
      score += 5;
    }
    if (model.provider === 'Google' && (criteria.requiresSpeed || criteria.requiresMultimodal)) {
      score += 5;
    }
    if (model.provider === 'Meta' && (criteria.budgetSensitive || criteria.requiresCode)) {
      score += 5;
    }
    
    return {
      model,
      score,
      reasoning: reasoning.join(', ')
    };
  });
  
  // Sort by score
  scoredModels.sort((a, b) => b.score - a.score);
  
  const selectedModel = scoredModels[0].model;
  const confidence = Math.min(95, Math.max(60, scoredModels[0].score));
  const alternatives = scoredModels.slice(1, 4).map(sm => sm.model);
  
  return {
    selectedModel,
    confidence,
    reasoning: scoredModels[0].reasoning || 'best overall match for your requirements',
    alternatives
  };
}

export function calculateCost(model: AIModel, inputTokens: number, outputTokens: number): number {
  return (inputTokens * model.pricing.inputTokens / 1000) + (outputTokens * model.pricing.outputTokens / 1000);
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}