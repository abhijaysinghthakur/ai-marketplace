import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { AIModel } from '../types';

codex/remove-bolt-branding-and-add-apis-l097l2
// Helper to read API keys from env or local storage
function getApiKey(provider: 'openai' | 'anthropic' | 'google'): string {
  const envKey =
    (import.meta.env as any)[`VITE_${provider.toUpperCase()}_API_KEY`] || '';

  if (envKey) return envKey;

  if (typeof window !== 'undefined') {
    return localStorage.getItem(`${provider.toUpperCase()}_API_KEY`) || '';
  }

  return '';
}

// API Configuration
const API_KEYS = {
  openai: import.meta.env.VITE_OPENAI_API_KEY || '',
  anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  google: import.meta.env.VITE_GOOGLE_API_KEY || '',
};

// Initialize clients
const openai = new OpenAI({
  apiKey: API_KEYS.openai,
  dangerouslyAllowBrowser: true
} as any);

const anthropic = new Anthropic({
  apiKey: API_KEYS.anthropic,
  dangerouslyAllowBrowser: true
} as any);

const genAI = new GoogleGenerativeAI(API_KEYS.google);
main

export interface AIResponse {
  content: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  model: string;
}

export class AIProviderService {
  static async callOpenAI(model: AIModel, prompt: string, conversationHistory: any[] = []): Promise<AIResponse> {
    try {
      const client = new OpenAI({
        apiKey: getApiKey('openai'),
        dangerouslyAllowBrowser: true,
      } as any);

      const messages = [
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: prompt }
      ];

      const response = await client.chat.completions.create({
        model: model.id,
        messages: messages as any,
        max_tokens: Math.min(4000, model.maxTokens),
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || 'No response generated';
      const usage = response.usage;
      
      return {
        content,
        tokens: {
          input: usage?.prompt_tokens || 0,
          output: usage?.completion_tokens || 0,
          total: usage?.total_tokens || 0
        },
        cost: this.calculateCost(model, usage?.prompt_tokens || 0, usage?.completion_tokens || 0),
        model: model.name
      };
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(model, prompt, error.message);
    }
  }

  static async callAnthropic(model: AIModel, prompt: string, conversationHistory: any[] = []): Promise<AIResponse> {
    try {
      const client = new Anthropic({
        apiKey: getApiKey('anthropic'),
        dangerouslyAllowBrowser: true,
      } as any);

      const messages = conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      messages.push({ role: 'user', content: prompt });

 codex/remove-bolt-branding-and-add-apis-l097l2
      const response = await (client as any).messages.create({

      const response = await (anthropic as any).messages.create({
 main
        model: model.id,
        max_tokens: Math.min(4000, model.maxTokens),
        messages: messages as any,
        temperature: 0.7,
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : 'No response generated';
      
      return {
        content,
        tokens: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
          total: response.usage.input_tokens + response.usage.output_tokens
        },
        cost: this.calculateCost(model, response.usage.input_tokens, response.usage.output_tokens),
        model: model.name
      };
    } catch (error: any) {
      console.error('Anthropic API Error:', error);
      return this.getFallbackResponse(model, prompt, error.message);
    }
  }

  static async callGoogle(model: AIModel, prompt: string, conversationHistory: any[] = []): Promise<AIResponse> {
    try {
      const genAI = new GoogleGenerativeAI(getApiKey('google'));
      const genModel = genAI.getGenerativeModel({ model: model.id });
      
      // Build conversation history for Google
      const history = conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = genModel.startChat({ history });
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const content = response.text();

      // Estimate tokens (Google doesn't always provide usage data)
      const inputTokens = this.estimateTokens(prompt + conversationHistory.map(m => m.content).join(' '));
      const outputTokens = this.estimateTokens(content);

      return {
        content,
        tokens: {
          input: inputTokens,
          output: outputTokens,
          total: inputTokens + outputTokens
        },
        cost: this.calculateCost(model, inputTokens, outputTokens),
        model: model.name
      };
    } catch (error: any) {
      console.error('Google API Error:', error);
      return this.getFallbackResponse(model, prompt, error.message);
    }
  }

  static async callModel(model: AIModel, prompt: string, conversationHistory: any[] = []): Promise<AIResponse> {
    // Check if API keys are available
    if (!this.hasValidApiKey(model.provider)) {
      return this.getFallbackResponse(model, prompt, 'API key not configured');
    }

    switch (model.provider.toLowerCase()) {
      case 'openai':
        return this.callOpenAI(model, prompt, conversationHistory);
      case 'anthropic':
        return this.callAnthropic(model, prompt, conversationHistory);
      case 'google':
        return this.callGoogle(model, prompt, conversationHistory);
      default:
        return this.getFallbackResponse(model, prompt, 'Provider not supported');
    }
  }

  private static hasValidApiKey(provider: string): boolean {
    return !!getApiKey(provider as any);
  }

  private static calculateCost(model: AIModel, inputTokens: number, outputTokens: number): number {
    return (inputTokens * model.pricing.inputTokens / 1000) + (outputTokens * model.pricing.outputTokens / 1000);
  }

  private static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private static getFallbackResponse(model: AIModel, prompt: string, errorMessage: string): AIResponse {
    const fallbackContent = `I apologize, but I'm currently unable to connect to ${model.name} (${errorMessage}). 

However, I can provide you with a comprehensive response based on the knowledge I have:

${this.generateIntelligentFallback(prompt, model)}

**Note**: This is a simulated response. To get real-time responses from ${model.name}, please configure your API keys in the environment variables.

**To enable real API responses:**
1. Get an API key from ${model.provider}
2. Add it to your environment variables as VITE_${model.provider.toUpperCase()}_API_KEY
3. Restart the application

**Why ${model.name} was selected**: ${model.strengths.join(', ')} make it ideal for this type of request.`;

    const estimatedTokens = this.estimateTokens(fallbackContent);
    
    return {
      content: fallbackContent,
      tokens: {
        input: this.estimateTokens(prompt),
        output: estimatedTokens,
        total: this.estimateTokens(prompt) + estimatedTokens
      },
      cost: this.calculateCost(model, this.estimateTokens(prompt), estimatedTokens),
      model: model.name + ' (Simulated)'
    };
  }

  private static generateIntelligentFallback(prompt: string, model: AIModel): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('code') || lowerPrompt.includes('program')) {
      return `Here's a code solution approach:

\`\`\`javascript
// Example implementation
function solutionApproach(input) {
    // 1. Analyze the requirements
    const requirements = analyzeInput(input);
    
    // 2. Design the solution
    const solution = designSolution(requirements);
    
    // 3. Implement with best practices
    return implementSolution(solution);
}

// Key considerations:
// - Error handling and validation
// - Performance optimization
// - Code maintainability
// - Testing strategy
\`\`\`

This approach ensures robust, scalable code that follows industry best practices.`;
    }
    
    if (lowerPrompt.includes('explain') || lowerPrompt.includes('what is')) {
      return `Let me break this down systematically:

**Core Concept**: The fundamental principle involves understanding the key components and their relationships.

**Key Points**:
• **Definition**: Clear explanation of the main concept
• **Applications**: Real-world use cases and examples
• **Benefits**: Why this matters and its advantages
• **Considerations**: Important factors to keep in mind

**Practical Examples**:
1. **Scenario A**: How this applies in common situations
2. **Scenario B**: Alternative applications and contexts
3. **Best Practices**: Recommended approaches for optimal results

This comprehensive understanding will help you apply these concepts effectively in your specific context.`;
    }
    
    if (lowerPrompt.includes('write') || lowerPrompt.includes('create')) {
      return `Here's a structured approach to creating compelling content:

**Content Strategy**:
• **Audience Analysis**: Understanding your target readers
• **Key Messages**: Core points to communicate
• **Structure**: Logical flow and organization
• **Tone & Style**: Appropriate voice for your audience

**Implementation**:
1. **Opening Hook**: Capture attention immediately
2. **Body Content**: Deliver value with clear, actionable information
3. **Supporting Evidence**: Use examples, data, and credible sources
4. **Strong Conclusion**: Reinforce key messages and provide next steps

**Quality Assurance**:
- Clarity and readability
- Factual accuracy
- Engaging presentation
- Call-to-action alignment

This framework ensures your content achieves its intended purpose while engaging your audience effectively.`;
    }
    
    return `Based on your request, here's a comprehensive response:

**Analysis**: Your question touches on several important aspects that require careful consideration.

**Key Insights**:
• **Primary Factor**: The most important element to understand
• **Supporting Elements**: Additional considerations that influence outcomes
• **Practical Applications**: How this applies in real-world scenarios
• **Best Practices**: Proven approaches for success

**Recommendations**:
1. **Immediate Actions**: Steps you can take right now
2. **Medium-term Strategy**: Planning for the next phase
3. **Long-term Vision**: Sustainable approach for continued success

**Additional Considerations**:
- Risk factors and mitigation strategies
- Resource requirements and optimization
- Success metrics and evaluation criteria

This comprehensive approach ensures you have the information needed to make informed decisions and achieve your objectives.`;
  }
}