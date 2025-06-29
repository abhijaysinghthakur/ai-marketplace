import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Target, DollarSign } from 'lucide-react';
import { AIModel } from '../types';
import { aiModels } from '../data/models';
import { ModelCard } from './ModelCard';

export function ModelComparison() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedCapability, setSelectedCapability] = useState('all');
  const [sortBy, setSortBy] = useState('accuracy');

  const providers = ['all', ...Array.from(new Set(aiModels.map(model => model.provider)))];
  const capabilities = ['all', ...Array.from(new Set(aiModels.flatMap(model => model.capabilities)))];

  const filteredModels = aiModels
    .filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
      const matchesCapability = selectedCapability === 'all' || 
                               model.capabilities.includes(selectedCapability);
      
      return matchesSearch && matchesProvider && matchesCapability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'accuracy':
          return b.accuracy - a.accuracy;
        case 'speed':
          const speedOrder = { fast: 3, medium: 2, slow: 1 };
          return speedOrder[b.responseTime] - speedOrder[a.responseTime];
        case 'cost':
          const avgCostA = (a.pricing.inputTokens + a.pricing.outputTokens) / 2;
          const avgCostB = (b.pricing.inputTokens + b.pricing.outputTokens) / 2;
          return avgCostA - avgCostB;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Model Comparison</h1>
        <p className="text-gray-600">
          Compare and explore all available AI models to understand their capabilities and pricing.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Models
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {providers.map(provider => (
                <option key={provider} value={provider}>
                  {provider === 'all' ? 'All Providers' : provider}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capability
            </label>
            <select
              value={selectedCapability}
              onChange={(e) => setSelectedCapability(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {capabilities.map(capability => (
                <option key={capability} value={capability}>
                  {capability === 'all' ? 'All Capabilities' : capability}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="accuracy">Accuracy</option>
              <option value="speed">Speed</option>
              <option value="cost">Cost (Low to High)</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Models</p>
              <p className="text-2xl font-bold text-gray-900">{filteredModels.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(filteredModels.reduce((sum, model) => sum + model.accuracy, 0) / filteredModels.length)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fast Models</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredModels.filter(model => model.responseTime === 'fast').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lowest Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.min(...filteredModels.map(model => model.pricing.inputTokens)).toFixed(4)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No models found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
}