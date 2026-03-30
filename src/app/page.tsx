'use client';

import { useState, useCallback } from 'react';
import { SearchResult, FilterOptions } from '@/types/keyword';
import ToolsSidebar from '@/components/ToolsSidebar';
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SEOS</h1>
                <p className="text-xs text-gray-500">All-in-One SEO Platform</p>
              </div>
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        <ToolsSidebar />
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

            <div className="mb-8 max-w-3xl mx-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('keyword') as HTMLInputElement;
                if (input.value.trim()) handleSearch(input.value.trim());
              }}>
                <div className="relative">
                  <input
                    type="text"
                    name="keyword"
                    placeholder="Enter a seed keyword to research..."
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Searching...' : 'Research'}
                  </button>
                </div>
              </form>
              <p className="mt-3 text-sm text-gray-500 text-center">
                Enter a keyword to discover related terms, search volumes, and difficulty scores
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3 max-w-3xl mx-auto">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {results && results.keywords.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Results for "{currentSeed}"
                    <span className="text-gray-500 font-normal ml-2">
                      ({results.totalCount} keywords)
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Keywords</p>
                    <p className="text-2xl font-bold text-gray-900">{results.keywords.length}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Volume</p>
                    <p className="text-2xl font-bold text-gray-900">{(results.keywords.reduce((sum, k) => sum + k.searchVolume, 0) / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500 mb-1">Avg Difficulty</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {Math.round(results.keywords.reduce((sum, k) => sum + k.difficulty, 0) / results.keywords.length)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500 mb-1">Easy Keywords</p>
                    <p className="text-2xl font-bold text-green-600">
                      {results.keywords.filter(k => k.difficulty <= 33).length}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Keyword</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Volume</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Difficulty</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">CPC</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Competition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.keywords.slice(0, 20).map((keyword, index) => (
                          <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleKeywordClick(keyword.keyword)}>
                            <td className="px-6 py-4 font-medium text-gray-900">{keyword.keyword}</td>
                            <td className="px-6 py-4 text-gray-600">{keyword.searchVolume.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                keyword.difficulty <= 33 ? 'bg-green-100 text-green-800' :
                                keyword.difficulty <= 66 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {keyword.difficulty}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">${keyword.cpc.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className="capitalize text-gray-600">{keyword.competition}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                    <p className="text-sm text-gray-600">Start with a broad term related to your niche</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Analyze Results</h4>
                    <p className="text-sm text-gray-600">Review search volume, difficulty, and competition data</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Export & Create</h4>
                    <p className="text-sm text-gray-600">Download your keywords and start creating content</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

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
