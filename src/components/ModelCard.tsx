import React from 'react';
import { AIModel } from '../types';
import { Clock, Zap, Target, DollarSign } from 'lucide-react';

interface ModelCardProps {
  model: AIModel;
  isSelected?: boolean;
  confidence?: number;
  reasoning?: string;
  onClick?: () => void;
}

export function ModelCard({ model, isSelected, confidence, reasoning, onClick }: ModelCardProps) {
  const getResponseTimeColor = (time: string) => {
    switch (time) {
      case 'fast': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'slow': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div 
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-primary-300'
      }`}
      onClick={onClick}
    >
      {isSelected && confidence && (
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {confidence}% match
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{model.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
            <p className="text-sm text-gray-600">{model.provider}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getResponseTimeColor(model.responseTime)}`}>
            <Clock className="w-3 h-3 inline mr-1" />
            {model.responseTime}
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{model.description}</p>

      {reasoning && isSelected && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Why this model:</strong> {reasoning}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Target className={`w-4 h-4 ${getAccuracyColor(model.accuracy)}`} />
          <span className="text-sm text-gray-600">
            {model.accuracy}% accuracy
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            ${model.pricing.inputTokens.toFixed(4)}/1K tokens
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Capabilities</h4>
        <div className="flex flex-wrap gap-1">
          {model.capabilities.slice(0, 4).map((capability) => (
            <span
              key={capability}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {capability}
            </span>
          ))}
          {model.capabilities.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{model.capabilities.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths</h4>
        <div className="flex flex-wrap gap-1">
          {model.strengths.slice(0, 3).map((strength) => (
            <span
              key={strength}
              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
            >
              {strength}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}