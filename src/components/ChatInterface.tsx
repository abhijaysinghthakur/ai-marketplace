import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Zap, Clock, DollarSign, Sparkles, Brain, AlertCircle, Key, X } from 'lucide-react';
import { AIModel, Message, Conversation } from '../types';
import { analyzePrompt, selectBestModel, calculateCost, estimateTokens } from '../utils/modelSelector';
import { AIProviderService } from '../services/aiProviders';
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [showApiWarning, setShowApiWarning] = useState(true);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
  });
  const hasApiKeys = (keys = apiKeys) => {
    return !!(
      import.meta.env.VITE_OPENAI_API_KEY ||
      keys.openai ||
      import.meta.env.VITE_ANTHROPIC_API_KEY ||
      keys.anthropic ||
      import.meta.env.VITE_GOOGLE_API_KEY ||
      keys.google
    );
  };
  const saveApiKeys = () => {
    if (apiKeys.openai) localStorage.setItem('OPENAI_API_KEY', apiKeys.openai);
    if (apiKeys.anthropic) localStorage.setItem('ANTHROPIC_API_KEY', apiKeys.anthropic);
    if (apiKeys.google) localStorage.setItem('GOOGLE_API_KEY', apiKeys.google);
    setShowApiWarning(!hasApiKeys());
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  useEffect(() => {
    const stored = {
      openai: localStorage.getItem('OPENAI_API_KEY') || '',
      anthropic: localStorage.getItem('ANTHROPIC_API_KEY') || '',
      google: localStorage.getItem('GOOGLE_API_KEY') || '',
    };
    setApiKeys(stored);
    if (hasApiKeys(stored)) {
      setShowApiWarning(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setApiError(null);
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
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Call the actual AI model API
      const response = await AIProviderService.callModel(
        selection.selectedModel,
        currentInput,
        conversation?.messages || []
      );

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        modelUsed: selection.selectedModel,
        tokens: response.tokens.total,
        cost: response.cost,
        reasoning: selection.reasoning
      };

      const finalConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date(),
        totalTokens: updatedConversation.totalTokens + response.tokens.total,
        totalCost: updatedConversation.totalCost + response.cost
      };

      onUpdateConversation(finalConversation);
    } catch (error: any) {
      console.error('AI API Error:', error);
      setApiError(error.message || 'Failed to get response from AI model');
      
      // Create error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `I apologize, but I encountered an error while trying to get a response from ${selection.selectedModel.name}. Please check your API configuration and try again.`,
        timestamp: new Date(),
        modelUsed: selection.selectedModel,
        tokens: 0,
        cost: 0,
        reasoning: 'Error occurred during API call'
      };

      const errorConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorMessage],
        updatedAt: new Date()
      };

      onUpdateConversation(errorConversation);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50/50 to-blue-50/30">
      {/* API Configuration Warning */}
      {showApiWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 m-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="font-medium text-amber-900">API Keys Required</h4>
                <p className="text-sm text-amber-700">
                  Enter your provider keys below to enable real responses. Keys are stored only in your browser.
                </p>
              </div>
            </div>
            <button
              className="text-amber-700 hover:text-amber-900"
              onClick={() => setShowApiWarning(false)}
              aria-label="Close API key prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="OpenAI API Key"
              value={apiKeys.openai}
              onChange={e => setApiKeys({ ...apiKeys, openai: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="Anthropic API Key"
              value={apiKeys.anthropic}
              onChange={e => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="Google API Key"
              value={apiKeys.google}
              onChange={e => setApiKeys({ ...apiKeys, google: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm"
            />
            <button
              onClick={saveApiKeys}
              className="w-full mt-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
            >
              Save Keys
            </button>
          </div>
        </motion.div>
      )}

      {/* Enhanced Model Selection Display */}
      <AnimatePresence>
        {modelSelection && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 glass-effect border-b border-white/20 m-4 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="text-3xl">{selectedModel?.icon}</span>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Selected: {selectedModel?.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {modelSelection.confidence}% confidence match • {selectedModel?.provider}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">{selectedModel?.responseTime}</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">{selectedModel?.accuracy}%</span>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-start space-x-2">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Model Selection Reasoning:</p>
                  <p className="text-sm text-blue-800">{modelSelection.reasoning}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 m-4 bg-red-50 border border-red-200 rounded-2xl"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-900">API Error</h4>
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {!conversation?.messages.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center animate-pulse-glow">
                <Bot className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gradient mb-4">
              Welcome to AI Marketplace
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Ask me anything! I'll automatically select the best AI model for your specific task, 
              provide real responses from leading AI providers, and maintain context throughout our conversation.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: '💻', title: 'Code & Development', desc: 'Programming, debugging, architecture', prompt: 'Help me write a Python function to sort a list' },
                { icon: '✍️', title: 'Writing & Content', desc: 'Articles, stories, marketing copy', prompt: 'Write a compelling product description for a new app' },
                { icon: '🧠', title: 'Analysis & Research', desc: 'Data analysis, research, insights', prompt: 'Analyze the pros and cons of remote work' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="card p-4 text-center hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setInput(item.prompt)}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {conversation?.messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-4xl rounded-3xl px-6 py-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'glass-effect text-slate-900 shadow-xl'
              }`}
            >
              <div className="flex items-start space-x-4">
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-1">
                    {message.modelUsed ? (
                      <div className="relative">
                        <span className="text-2xl">{message.modelUsed.icon}</span>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    ) : (
                      <Bot className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>
                  
                  {message.role === 'assistant' && message.modelUsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 pt-4 border-t border-slate-200/50"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">Model: {message.modelUsed.name}</span>
                          {message.tokens && (
                            <span className="flex items-center space-x-1 px-2 py-1 bg-slate-100 rounded-full">
                              <Zap className="w-3 h-3" />
                              <span>{message.tokens.toLocaleString()} tokens</span>
                            </span>
                          )}
                          {message.cost && (
                            <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                              <DollarSign className="w-3 h-3" />
                              <span>${message.cost.toFixed(4)}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-4xl glass-effect rounded-3xl px-6 py-4 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="text-2xl">{selectedModel?.icon}</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600 font-medium">
                    {selectedModel?.name} is thinking
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Form */}
      <div className="p-6 glass-effect border-t border-white/20 m-4 rounded-2xl">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything... I'll choose the best AI model and provide real responses"
              className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-slate-900 placeholder-slate-500 text-lg"
              disabled={isLoading}
            />
            {input && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-slate-400"
              >
                ~{estimateTokens(input)} tokens
              </motion.div>
            )}
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending</span>
              </div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            'Explain quantum computing in simple terms',
            'Write a Python function to reverse a string',
            'Create a marketing strategy for a new app',
            'Analyze the benefits of renewable energy',
            'Help me debug this JavaScript code'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}