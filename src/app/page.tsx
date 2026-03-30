'use client';

import { useState, useCallback } from 'react';
import { SearchResult, FilterOptions } from '@/types/keyword';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import KeywordTable from '@/components/KeywordTable';
import FilterPanel from '@/components/FilterPanel';
import StatsPanel from '@/components/StatsPanel';
import ExportButton from '@/components/ExportButton';
import { AlertCircle, Sparkles, Code, Heart } from 'lucide-react';

const defaultFilters: FilterOptions = {
  minSearchVolume: 0,
  maxDifficulty: 100,
  minCpc: 0
};

export default function Home() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [currentSeed, setCurrentSeed] = useState<string>('');

  const handleSearch = useCallback(async (keyword: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentSeed(keyword);
    
    try {
      const params = new URLSearchParams({
        seed: keyword,
        minVolume: filters.minSearchVolume.toString(),
        maxDifficulty: filters.maxDifficulty.toString(),
        minCpc: filters.minCpc.toString()
      });
      
      const response = await fetch(`/api/keywords?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch keywords');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch keyword data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const handleKeywordClick = (keyword: string) => {
    if (keyword !== currentSeed) {
      handleSearch(keyword);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (currentSeed) {
      const params = new URLSearchParams({
        seed: currentSeed,
        minVolume: newFilters.minSearchVolume.toString(),
        maxDifficulty: newFilters.maxDifficulty.toString(),
        minCpc: newFilters.minCpc.toString()
      });
      
      fetch(`/api/keywords?${params}`)
        .then(res => res.json())
        .then(data => setResults(data))
        .catch(console.error);
    }
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = filters.minSearchVolume > 0 || 
    filters.maxDifficulty < 100 || 
    filters.minCpc > 0;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            100% Free & Open Source
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Keyword Research Made Simple
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thousands of keyword ideas with search volume, difficulty scores, 
            and CPC data. No API keys required.
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {results && results.keywords.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Results for &quot;{currentSeed}&quot;
                <span className="text-gray-500 font-normal ml-2">
                  ({results.totalCount} keywords)
                </span>
              </h3>
              <ExportButton keywords={results.keywords} />
            </div>

            <StatsPanel keywords={results.keywords} clusters={results.clusters} />

            <FilterPanel
              filters={filters}
              onFiltersChange={handleFilterChange}
              onReset={handleResetFilters}
              hasFilters={hasActiveFilters}
            />

            <KeywordTable
              keywords={results.keywords}
              onKeywordClick={handleKeywordClick}
            />
          </div>
        )}

        {results && results.keywords.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">
              No keywords match your filter criteria. Try adjusting your filters.
            </p>
          </div>
        )}

        {!results && !isLoading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Getting Started
              </h3>
              <p className="text-gray-600">
                Enter a seed keyword above to discover related keywords and their metrics
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Enter Seed Keyword</h4>
                <p className="text-sm text-gray-600">
                  Start with a broad term related to your niche
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Analyze Results</h4>
                <p className="text-sm text-gray-600">
                  Review search volume, difficulty, and competition data
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Export & Create</h4>
                <p className="text-sm text-gray-600">
                  Download your keywords and start creating content
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Code className="h-5 w-5" />
                <span className="text-sm">MIT License</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Made for the community</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Built with Next.js. Data is estimated/simulated for demonstration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
