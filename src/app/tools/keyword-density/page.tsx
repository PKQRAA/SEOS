'use client';

import { useState } from 'react';
import { Hash, Copy, CheckCircle, AlertTriangle, Info, Globe, RefreshCw, Loader2 } from 'lucide-react';

interface KeywordDensity {
  word: string;
  count: number;
  density: number;
}

export default function KeywordDensity() {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<KeywordDensity[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchContent = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const text = doc.body?.textContent || '';
      setContent(text);
      analyzeDensity(text);
    } catch (error) {
      alert('Could not fetch content. Please check the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeDensity = (text: string) => {
    if (!text.trim()) return;

    const words = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);

    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'were', 'they', 'this', 'that', 'with', 'from', 'your', 'what', 'when', 'where', 'which', 'their', 'there', 'will', 'would', 'more', 'about', 'into', 'than', 'them', 'then', 'some', 'could', 'other', 'these', 'such', 'also', 'just', 'over', 'each', 'very', 'after', 'most', 'only', 'back', 'even', 'well', 'must', 'much', 'same', 'take', 'come', 'made', 'find', 'here', 'many', 'some', 'time']);

    const filteredWords = words.filter(w => !stopWords.has(w));
    const totalWords = filteredWords.length;

    const wordCount: { [key: string]: number } = {};
    filteredWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const density = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: parseFloat(((count / totalWords) * 100).toFixed(2))
      }))
      .sort((a, b) => b.density - a.density)
      .slice(0, 30);

    setResults(density);
    setShowResults(true);
  };

  const analyzeContent = () => {
    if (content.trim()) {
      analyzeDensity(content);
    }
  };

  const copyResults = () => {
    const text = results.map(r => `${r.word}: ${r.density}%`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDensityClass = (density: number) => {
    if (density < 1) return 'text-gray-600';
    if (density <= 3) return 'text-green-600';
    if (density <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalWords = content.split(/\s+/).filter(w => w.length > 0).length;
  const uniqueWords = results.length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Keyword Density Checker</h1>
        <p className="text-gray-600">Analyze keyword density in real web content</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && fetchContent()}
            />
          </div>
          <button
            onClick={fetchContent}
            disabled={isLoading || !url.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Globe className="h-5 w-5" />}
            {isLoading ? 'Fetching...' : 'Fetch URL'}
          </button>
        </div>
        
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Or paste your content here to analyze keyword density..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <button
          onClick={analyzeContent}
          disabled={!content.trim()}
          className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
        >
          Analyze Density
        </button>
      </div>

      {showResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Words</p>
              <p className="text-2xl font-bold text-gray-900">{totalWords.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Unique Words</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueWords}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Top Keywords</h3>
              <button
                onClick={copyResults}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Keyword</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Count</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Density</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{item.word}</td>
                      <td className="px-4 py-2 text-gray-600">{item.count}</td>
                      <td className={`px-4 py-2 font-medium ${getDensityClass(item.density)}`}>
                        {item.density}%
                        {item.density > 5 && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 font-medium">Recommended Keyword Density</p>
              <p className="text-blue-800 text-sm mt-1">
                The ideal keyword density is between 1-3%. Above 5% may be considered keyword stuffing by search engines.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
