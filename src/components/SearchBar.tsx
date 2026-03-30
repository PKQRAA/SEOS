'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a seed keyword to research..."
          className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="hidden sm:inline">Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Research</span>
            </>
          )}
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-500 text-center">
        Enter a keyword to discover related terms, search volumes, and difficulty scores
      </p>
    </form>
  );
}
