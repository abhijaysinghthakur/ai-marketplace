import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Clock, DollarSign } from 'lucide-react';
import { AIModel, Message, Conversation } from '../types';
import { analyzePrompt, selectBestModel, calculateCost, estimateTokens } from '../utils/modelSelector';
import { v4 as uuidv4 } from 'uuid';

interface ChatInterfaceProps {
  conversation: Conversation | null;
  onUpdateConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
}

export function ChatInterface({ conversation, onUpdateConversation, onNewConversation }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [modelSelection, setModelSelection] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Analyze prompt and select best model
    const criteria = analyzePrompt(input);
    const selection = selectBestModel(criteria);
    setModelSelection(selection);
    setSelectedModel(selection.selectedModel);

    // Create or update conversation
    let updatedConversation: Conversation;
    if (conversation) {
      updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, userMessage],
        updatedAt: new Date()
      };
    } else {
      updatedConversation = {
        id: uuidv4(),
        title: input.slice(0, 50) + (input.length > 50 ? '...' : ''),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        totalTokens: 0,
        totalCost: 0
      };
    }

    onUpdateConversation(updatedConversation);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const inputTokens = estimateTokens(input);
      const outputTokens = Math.floor(Math.random() * 500) + 100;
      const cost = calculateCost(selection.selectedModel, inputTokens, outputTokens);

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: generateMockResponse(input, selection.selectedModel),
        timestamp: new Date(),
        modelUsed: selection.selectedModel,
        tokens: inputTokens + outputTokens,
        cost: cost,
        reasoning: selection.reasoning
      };

      const finalConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date(),
        totalTokens: updatedConversation.totalTokens + inputTokens + outputTokens,
        totalCost: updatedConversation.totalCost + cost
      };

      onUpdateConversation(finalConversation);
      setIsLoading(false);
    }, 1500 + Math.random() * 2000);
  };

  const generateMockResponse = (prompt: string, model: AIModel): string => {
    const responses = {
      'gpt-4-turbo': `I'll help you with that using GPT-4 Turbo's advanced reasoning capabilities. ${prompt.includes('code') ? 'Here\'s a comprehensive solution with detailed explanations...' : 'Let me provide a thorough analysis...'}`,
      'claude-3-opus': `I appreciate your question. Using Claude 3 Opus's nuanced understanding, I can provide a thoughtful response that considers multiple perspectives...`,
      'gemini-pro': `Using Gemini Pro's fast processing and multimodal capabilities, I can quickly address your request with real-time insights...`,
      'codellama-34b': `As a specialized coding model, I'll provide you with optimized code solutions and best practices for your programming needs...`,
      'mistral-large': `Leveraging Mistral Large's multilingual capabilities and European AI standards, I'll provide a comprehensive response...`
    };

    return responses[model.id as keyof typeof responses] || `Using ${model.name}, I'll provide you with an accurate and helpful response tailored to your specific needs. This model was selected because it's ${model.strengths.join(', ').toLowerCase()} and perfect for your type of request.`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Model Selection Display */}
      {modelSelection && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedModel?.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Selected: {selectedModel?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {modelSelection.confidence}% confidence match
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{selectedModel?.responseTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>{selectedModel?.accuracy}%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-primary-700 mt-2">
            <strong>Reason:</strong> {modelSelection.reasoning}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!conversation?.messages.length && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to AI Marketplace
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Ask me anything! I'll automatically select the best AI model for your specific task and maintain context throughout our conversation.
            </p>
          </div>
        )}

        {conversation?.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-3">
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    {message.modelUsed ? (
                      <span className="text-2xl">{message.modelUsed.icon}</span>
                    ) : (
                      <Bot className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.role === 'assistant' && message.modelUsed && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>Model: {message.modelUsed.name}</span>
                          {message.tokens && (
                            <span className="flex items-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>{message.tokens} tokens</span>
                            </span>
                          )}
                          {message.cost && (
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>${message.cost.toFixed(4)}</span>
                            </span>
                          )}
                        </div>
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl rounded-2xl px-4 py-3 bg-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedModel?.icon}</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything... I'll choose the best AI model for your task"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}