'use client';

import { useState } from 'react';
import { Search, Globe, Shield, TrendingUp, ExternalLink } from 'lucide-react';

interface MetricData {
  name: string;
  score: number;
  maxScore: number;
  category: string;
}

export default function DomainAuthority() {
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const checkDomain = () => {
    if (!domain.trim()) return;
    setIsChecking(true);

    setTimeout(() => {
      const mockMetrics: MetricData[] = [
        { name: 'Domain Authority', score: 45, maxScore: 100, category: 'Overall' },
        { name: 'Page Authority', score: 38, maxScore: 100, category: 'Overall' },
        { name: 'Trust Flow', score: 32, maxScore: 100, category: 'Quality' },
        { name: 'Citation Flow', score: 41, maxScore: 100, category: 'Quantity' },
        { name: 'Spam Score', score: 12, maxScore: 100, category: 'Quality' },
        { name: 'Root Domains', score: 156, maxScore: 10000, category: 'Backlinks' },
        { name: 'Total Backlinks', score: 892, maxScore: 100000, category: 'Backlinks' },
        { name: 'Social Shares', score: 234, maxScore: 10000, category: 'Social' },
      ];
      setMetrics(mockMetrics);
      setShowResults(true);
      setIsChecking(false);
    }, 1500);
  };

  const da = metrics.find(m => m.name === 'Domain Authority')?.score || 0;
  const pa = metrics.find(m => m.name === 'Page Authority')?.score || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Domain Authority Checker</h1>
        <p className="text-gray-600">Check DA, PA, and other domain metrics</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && checkDomain()}
            />
          </div>
          <button
            onClick={checkDomain}
            disabled={isChecking || !domain.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            {isChecking ? 'Checking...' : 'Check'}
          </button>
        </div>
      </div>

      {showResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm opacity-80">Domain Authority</span>
              </div>
              <p className="text-4xl font-bold mb-1">{da}</p>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${da}%` }} />
              </div>
              <p className="text-xs opacity-80 mt-2">Out of 100</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-500">Page Authority</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{pa}</p>
              <p className="text-xs text-gray-500 mt-2">Estimated potential</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-500">Linking Domains</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{metrics.find(m => m.name === 'Root Domains')?.score || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Unique domains</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Detailed Metrics</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{metric.name}</p>
                      <p className="text-xs text-gray-500">{metric.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-600">{metric.score}</p>
                      <p className="text-xs text-gray-400">/ {metric.maxScore}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What is Domain Authority?</h4>
            <p className="text-sm text-blue-800">
              Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how likely 
              a website is to rank on search engine result pages (SERPs). DA scores range from 1 to 100, with 
              higher scores corresponding to a greater ability to rank.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
