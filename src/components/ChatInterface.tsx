import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Zap, Clock, DollarSign, Sparkles, Brain } from 'lucide-react';
import { AIModel, Message, Conversation } from '../types';
import { analyzePrompt, selectBestModel, calculateCost, estimateTokens } from '../utils/modelSelector';
import { generateIntelligentResponse } from '../utils/responseGenerator';
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
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Generate intelligent response
    setTimeout(() => {
      const inputTokens = estimateTokens(currentInput);
      const response = generateIntelligentResponse(currentInput, selection.selectedModel, conversation?.messages || []);
      const outputTokens = estimateTokens(response);
      const cost = calculateCost(selection.selectedModel, inputTokens, outputTokens);

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
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

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50/50 to-blue-50/30">
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
              provide intelligent responses, and maintain context throughout our conversation.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: '💻', title: 'Code & Development', desc: 'Programming, debugging, architecture' },
                { icon: '✍️', title: 'Writing & Content', desc: 'Articles, stories, marketing copy' },
                { icon: '🧠', title: 'Analysis & Research', desc: 'Data analysis, research, insights' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="card p-4 text-center hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setInput(`Help me with ${item.title.toLowerCase()}`)}
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
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
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
                  <span className="text-slate-600 font-medium">Thinking</span>
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
              placeholder="Ask me anything... I'll choose the best AI model and provide intelligent answers"
              className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-slate-900 placeholder-slate-500 text-lg"
              disabled={isLoading}
            />
            {input && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-slate-400"
              >
                {estimateTokens(input)} tokens
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
            'Explain quantum computing',
            'Write a Python function',
            'Create a marketing strategy',
            'Analyze this data',
            'Help me debug code'
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