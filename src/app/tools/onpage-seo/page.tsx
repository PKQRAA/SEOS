'use client';

import { useState } from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Search, ExternalLink } from 'lucide-react';

interface OnPageIssue {
  id: number;
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
  recommendation: string;
}

interface OnPageResult {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  wordCount: number;
  issues: OnPageIssue[];
}

export default function OnPageSEO() {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<OnPageResult | null>(null);

  const checkOnPage = () => {
    if (!url.trim()) return;
    setIsChecking(true);

    setTimeout(() => {
      const mockResult: OnPageResult = {
        url: url,
        title: 'Example Page - Best SEO Tips and Guide',
        metaDescription: 'Learn the best SEO tips and strategies to improve your website ranking. Comprehensive guide with practical tips for beginners and experts.',
        h1: ['Best SEO Tips and Strategies', 'Complete SEO Guide 2024'],
        wordCount: 1847,
        issues: [
          { id: 1, type: 'success', title: 'Title Tag', description: 'Title tag is present and well-optimized', recommendation: 'Great! Your title is between 50-60 characters.' },
          { id: 2, type: 'success', title: 'Meta Description', description: 'Meta description is present and optimized', recommendation: 'Good job! Include your target keyword naturally.' },
          { id: 3, type: 'warning', title: 'Multiple H1 Tags', description: 'Found 2 H1 tags on this page', recommendation: 'Consider using only one H1 tag per page for better SEO.' },
          { id: 4, type: 'success', title: 'Content Length', description: 'Word count is good (1,847 words)', recommendation: 'Excellent! Longer content tends to rank better.' },
          { id: 5, type: 'error', title: 'Missing Alt Text', description: '3 images are missing alt text', recommendation: 'Add descriptive alt text to all images for accessibility and SEO.' },
          { id: 6, type: 'warning', title: 'Internal Links', description: 'Only 2 internal links found', recommendation: 'Add more internal links to help search engines discover content.' },
          { id: 7, type: 'success', title: 'Mobile Friendly', description: 'Page is mobile responsive', recommendation: 'Your page works well on mobile devices.' },
          { id: 8, type: 'error', title: 'Missing Schema Markup', description: 'No structured data found', recommendation: 'Add JSON-LD schema markup for rich snippets.' },
        ]
      };
      setResult(mockResult);
      setIsChecking(false);
    }, 2000);
  };

  const successCount = result?.issues.filter(i => i.type === 'success').length || 0;
  const warningCount = result?.issues.filter(i => i.type === 'warning').length || 0;
  const errorCount = result?.issues.filter(i => i.type === 'error').length || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">On-Page SEO Checker</h1>
        <p className="text-gray-600">Analyze and optimize your web pages for better rankings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && checkOnPage()}
            />
          </div>
          <button
            onClick={checkOnPage}
            disabled={isChecking || !url.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
          >
            {isChecking ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{successCount}</p>
              <p className="text-sm text-green-600">Passed</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{warningCount}</p>
              <p className="text-sm text-yellow-600">Warnings</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{errorCount}</p>
              <p className="text-sm text-red-600">Issues</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Page Overview</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Title</p>
                <p className="font-medium text-gray-900">{result.title}</p>
                <p className="text-xs text-gray-400">{result.title.length}/60 characters</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Meta Description</p>
                <p className="text-gray-700">{result.metaDescription}</p>
                <p className="text-xs text-gray-400">{result.metaDescription.length}/160 characters</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">H1 Tags ({result.h1.length})</p>
                {result.h1.map((h, i) => (
                  <p key={i} className="text-gray-700">- {h}</p>
                ))}
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-gray-500">Word Count</p>
                  <p className="font-medium text-gray-900">{result.wordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">URL</p>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 text-sm flex items-center gap-1">
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Issues Found</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {result.issues.map((issue) => (
                <div key={issue.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {issue.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />}
                    {issue.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />}
                    {issue.type === 'error' && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{issue.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Recommendation:</p>
                        <p className="text-sm text-gray-700">{issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
