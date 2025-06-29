import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare, BarChart3, Settings, Sparkles, Zap } from 'lucide-react';
import { Conversation } from './types';
import { ChatInterface } from './components/ChatInterface';
import { ConversationSidebar } from './components/ConversationSidebar';
import { ModelComparison } from './components/ModelComparison';

type View = 'chat' | 'models' | 'analytics' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('ai-marketplace-conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(conversationsWithDates);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-marketplace-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const handleUpdateConversation = (updatedConversation: Conversation) => {
    setConversations(prev => {
      const existingIndex = prev.findIndex(conv => conv.id === updatedConversation.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedConversation;
        return updated;
      } else {
        return [updatedConversation, ...prev];
      }
    });
    setActiveConversation(updatedConversation);
  };

  const handleNewConversation = () => {
    setActiveConversation(null);
    setCurrentView('chat');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setCurrentView('chat');
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  const navigationItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'models', label: 'Models', icon: Bot, gradient: 'from-purple-500 to-pink-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, gradient: 'from-green-500 to-emerald-500' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="h-screen bg-mesh overflow-hidden">
      <div className="h-full flex">
        {/* Enhanced Navigation Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 glass-effect border-r border-white/20 flex flex-col items-center py-6 relative z-10"
        >
          {/* Logo */}
          <motion.div 
            className="mb-8 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </motion.div>
          
          {/* Navigation Items */}
          <nav className="flex-1 flex flex-col space-y-4">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-110`
                      : 'text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-slate-400 hover:to-slate-500 hover:scale-105'
                  }`}
                  title={item.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-6 h-6" />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full"
                    />
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <motion.div 
            className="flex items-center space-x-2 text-xs text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="hidden">Online</span>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex"
              >
                <ConversationSidebar
                  conversations={conversations}
                  activeConversation={activeConversation}
                  onSelectConversation={handleSelectConversation}
                  onNewConversation={handleNewConversation}
                  onDeleteConversation={handleDeleteConversation}
                />
                <div className="flex-1">
                  <ChatInterface
                    conversation={activeConversation}
                    onUpdateConversation={handleUpdateConversation}
                    onNewConversation={handleNewConversation}
                  />
                </div>
              </motion.div>
            )}

            {currentView === 'models' && (
              <motion.div
                key="models"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto custom-scrollbar"
              >
                <ModelComparison />
              </motion.div>
            )}

            {currentView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-8 overflow-y-auto custom-scrollbar"
              >
                <div className="max-w-6xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl font-bold text-gradient mb-3">Analytics Dashboard</h1>
                    <p className="text-slate-600 text-lg">Track your AI usage and performance metrics</p>
                  </motion.div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { 
                        title: 'Total Conversations', 
                        value: conversations.length, 
                        icon: MessageSquare, 
                        gradient: 'from-blue-500 to-cyan-500',
                        change: '+12%'
                      },
                      { 
                        title: 'Total Messages', 
                        value: conversations.reduce((sum, conv) => sum + conv.messages.length, 0), 
                        icon: Bot, 
                        gradient: 'from-purple-500 to-pink-500',
                        change: '+8%'
                      },
                      { 
                        title: 'Total Tokens', 
                        value: conversations.reduce((sum, conv) => sum + conv.totalTokens, 0).toLocaleString(), 
                        icon: Zap, 
                        gradient: 'from-green-500 to-emerald-500',
                        change: '+15%'
                      },
                      { 
                        title: 'Total Cost', 
                        value: `$${conversations.reduce((sum, conv) => sum + conv.totalCost, 0).toFixed(4)}`, 
                        icon: BarChart3, 
                        gradient: 'from-orange-500 to-red-500',
                        change: '+5%'
                      }
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card card-hover p-6 relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              {stat.change}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-slate-600 mb-1">{stat.title}</h3>
                          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                          
                          {/* Background decoration */}
                          <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-r ${stat.gradient} opacity-5 rounded-full`}></div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      {conversations.slice(0, 5).map((conv, index) => (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{conv.title}</p>
                              <p className="text-sm text-slate-500">{conv.messages.length} messages</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">${conv.totalCost.toFixed(4)}</p>
                            <p className="text-xs text-slate-500">{conv.updatedAt.toLocaleDateString()}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-8 overflow-y-auto custom-scrollbar"
              >
                <div className="max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl font-bold text-gradient mb-3">Settings</h1>
                    <p className="text-slate-600 text-lg">Customize your AI marketplace experience</p>
                  </motion.div>
                  
                  <div className="space-y-6">
                    {/* Preferences */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="card p-6"
                    >
                      <h3 className="text-xl font-semibold text-slate-900 mb-6">Preferences</h3>
                      <div className="space-y-6">
                        {[
                          {
                            title: 'Auto-select best model',
                            description: 'Automatically choose the optimal AI model for each task',
                            defaultChecked: true
                          },
                          {
                            title: 'Show model reasoning',
                            description: 'Display why a specific model was chosen',
                            defaultChecked: true
                          },
                          {
                            title: 'Cost tracking',
                            description: 'Track and display usage costs',
                            defaultChecked: true
                          },
                          {
                            title: 'Performance analytics',
                            description: 'Collect usage data for performance insights',
                            defaultChecked: false
                          }
                        ].map((setting, index) => (
                          <div key={setting.title} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl">
                            <div>
                              <p className="font-medium text-slate-900">{setting.title}</p>
                              <p className="text-sm text-slate-600">{setting.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={setting.defaultChecked} className="sr-only peer" />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Data Management */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card p-6"
                    >
                      <h3 className="text-xl font-semibold text-slate-900 mb-6">Data Management</h3>
                      <div className="space-y-4">
                        <button className="w-full p-4 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300">
                          <div className="font-medium">Clear all conversations</div>
                          <div className="text-sm text-red-500">This action cannot be undone</div>
                        </button>
                        <button className="w-full p-4 text-left text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200 hover:border-blue-300">
                          <div className="font-medium">Export conversation data</div>
                          <div className="text-sm text-blue-500">Download your data as JSON</div>
                        </button>
                        <button className="w-full p-4 text-left text-green-600 hover:bg-green-50 rounded-xl transition-colors border border-green-200 hover:border-green-300">
                          <div className="font-medium">Import conversations</div>
                          <div className="text-sm text-green-500">Restore from backup file</div>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;