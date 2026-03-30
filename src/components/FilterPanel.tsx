'use client';

import { FilterOptions } from '@/types/keyword';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export default function FilterPanel({ filters, onFiltersChange, onReset, hasFilters }: FilterPanelProps) {
  const handleChange = (key: keyof FilterOptions, value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, [key]: numValue });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Search Volume
          </label>
          <input
            type="number"
            value={filters.minSearchVolume || ''}
            onChange={(e) => handleChange('minSearchVolume', e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Difficulty
          </label>
          <input
            type="number"
            value={filters.maxDifficulty || ''}
            onChange={(e) => handleChange('maxDifficulty', e.target.value)}
            placeholder="100"
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min CPC ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={filters.minCpc || ''}
            onChange={(e) => handleChange('minCpc', e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
