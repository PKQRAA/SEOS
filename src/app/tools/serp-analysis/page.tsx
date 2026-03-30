'use client';

import { useState } from 'react';
import { Search, Globe, TrendingUp, ExternalLink, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface SERPResult {
  position: number;
  url: string;
  title: string;
  snippet: string;
  isAds: boolean;
  isLocal: boolean;
}

export default function SERPAnalysis() {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SERPResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const analyzeSERP = () => {
    if (!keyword.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const mockResults: SERPResult[] = [
        { position: 1, url: 'https://example.com/best-seo-tips-2024', title: 'Best SEO Tips & Strategies for 2024 - Complete Guide', snippet: 'Discover the most effective SEO strategies for 2024. Our comprehensive guide covers technical SEO, content optimization, and link building...', isAds: false, isLocal: false },
        { position: 2, url: 'https://moz.com/seo-tips', title: 'SEO Tips for Beginners | Moz', snippet: 'Learn the fundamentals of SEO with Moz. Essential tips for improving your website visibility and ranking on Google...', isAds: false, isLocal: false },
        { position: 3, url: 'https://ahrefs.com/blog/seo-tips', title: '22 Practical SEO Tips That Actually Work | Ahrefs', snippet: 'Looking for SEO tips that deliver results? Here are 22 actionable strategies backed by data and real-world testing...', isAds: false, isLocal: false },
        { position: 4, url: 'https://searchengineland.com/seo-guide', title: 'The Complete SEO Guide for 2024', snippet: 'Everything you need to know about search engine optimization. From keyword research to technical SEO...', isAds: false, isLocal: false },
        { position: 5, url: 'https://example.com/seo-services', title: 'Professional SEO Services | Company Name', snippet: 'Getranked on page 1 with our proven SEO services. Free consultation available...', isAds: false, isLocal: false },
        { position: 6, url: 'https://semrush.com/learn/seo', title: 'SEO Basics: A Beginner\'s Guide to SEO', snippet: 'New to SEO? Start here. Learn the fundamentals of search engine optimization...', isAds: false, isLocal: false },
        { position: 7, url: 'https://backlinko.com/seo-tips', title: 'SEO Tips & Strategies - Backlinko', snippet: 'Actionable link building strategies and SEO tips from Brian Dean...', isAds: false, isLocal: false },
        { position: 8, url: 'https://example.org/how-to-seo', title: 'How to Do SEO: A Complete Step-by-Step Guide', snippet: 'Step-by-step guide to improving your website SEO. No technical skills required...', isAds: false, isLocal: false },
        { position: 9, url: 'https://neilpatel.com/seo/', title: 'What is SEO? - Neil Patel', snippet: 'The ultimate guide to SEO. Learn how to rank higher and get more traffic...', isAds: false, isLocal: false },
        { position: 10, url: 'https://example.net/seo-checklist', title: 'Free SEO Checklist for 2024', snippet: 'Download our free SEO checklist and never miss an optimization opportunity...', isAds: false, isLocal: false },
      ];
      setResults(mockResults);
      setShowResults(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getPositionClass = (pos: number) => {
    if (pos <= 3) return 'bg-green-100 text-green-800';
    if (pos <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SERP Analysis Tool</h1>
        <p className="text-gray-600">Analyze search engine results pages and understand ranking factors</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword to analyze..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && analyzeSERP()}
            />
          </div>
          <button
            onClick={analyzeSERP}
            disabled={isAnalyzing || !keyword.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {showResults && (
        <div className="space-y-4">
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-primary-800 font-medium">SERP Analysis Complete</p>
              <p className="text-primary-700 text-sm">Top 10 results for "{keyword}"</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {results.map((result) => (
                <div key={result.position} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${getPositionClass(result.position)}`}>
                      {result.position}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 font-medium truncate">
                          {result.title}
                        </a>
                        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{result.snippet}</p>
                      <p className="text-gray-500 text-xs truncate">{result.url}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">Top 3 Positions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">High competition keywords</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="font-medium">Avg. Content Length</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,850</p>
              <p className="text-sm text-gray-500">Words per top result</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Featured Snippets</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Opportunities available</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
