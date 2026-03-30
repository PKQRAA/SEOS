'use client';

import { useState } from 'react';
import { List, CheckCircle, AlertTriangle, Plus, Trash2, Copy, CheckCircle as CopyIcon, Globe, RefreshCw, Loader2 } from 'lucide-react';

interface Heading {
  level: number;
  text: string;
  count: number;
}

export default function HeadingChecker() {
  const [html, setHtml] = useState('');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<Heading[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedHeadings, setAddedHeadings] = useState<{ level: number; text: string }[]>([
    { level: 1, text: '' },
  ]);

  const fetchAndAnalyze = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      const content = await response.text();
      setHtml(content);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
      const headings: Heading[] = [];
      let match;
      const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

      const hElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      hElements.forEach((el) => {
        const level = parseInt(el.tagName.charAt(1));
        const text = el.textContent?.trim() || '';
        if (text) {
          counts[level]++;
          if (!headings.some(h => h.level === level && h.text === text)) {
            headings.push({ level, text, count: 1 });
          } else {
            const existing = headings.find(h => h.level === level && h.text === text);
            if (existing) existing.count++;
          }
        }
      });

      setResults(headings.sort((a, b) => a.level - b.level));
      setShowResults(true);
    } catch (error) {
      alert('Could not fetch the URL. Please check if the URL is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeHeadings = () => {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    const headings: Heading[] = [];
    const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    let match;
    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      counts[level]++;
      
      if (!headings.some(h => h.level === level && h.text === text)) {
        headings.push({ level, text, count: 1 });
      } else {
        const existing = headings.find(h => h.level === level && h.text === text);
        if (existing) existing.count++;
      }
    }

    setResults(headings.sort((a, b) => a.level - b.level));
    setShowResults(true);
  };

  const copyAsHtml = () => {
    const htmlContent = addedHeadings
      .filter(h => h.text.trim())
      .map(h => `<h${h.level}>${h.text}</h${h.level}>`)
      .join('\n');
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addHeading = () => {
    setAddedHeadings([...addedHeadings, { level: 2, text: '' }]);
  };

  const updateHeading = (index: number, field: 'level' | 'text', value: string | number) => {
    const updated = [...addedHeadings];
    updated[index] = { ...updated[index], [field]: value };
    setAddedHeadings(updated);
  };

  const removeHeading = (index: number) => {
    setAddedHeadings(addedHeadings.filter((_, i) => i !== index));
  };

  const h1Count = results.filter(h => h.level === 1).length;
  const h1Issues = h1Count !== 1;
  const hasSkippedLevels = checkSkippedLevels(results);

  const function checkSkippedLevels(headings: Heading[]): boolean {
    const levels = headings.map(h => h.level).sort((a, b) => a - b);
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 1) return true;
    }
    return false;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Heading Structure Checker</h1>
        <p className="text-gray-600">Analyze and create proper heading hierarchy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Fetch & Analyze URL</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to analyze headings..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => e.key === 'Enter' && fetchAndAnalyze()}
              />
              <button
                onClick={fetchAndAnalyze}
                disabled={isLoading || !url.trim()}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                Fetch
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Or Paste HTML</h3>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Paste your HTML content here to analyze heading structure..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
            />
            <button
              onClick={analyzeHeadings}
              disabled={!html.trim()}
              className="mt-4 w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
            >
              Analyze Headings
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Generate Headings</h3>
              <button
                onClick={copyAsHtml}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                {copied ? <CopyIcon className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
            </div>
            <div className="space-y-3">
              {addedHeadings.map((heading, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={heading.level}
                    onChange={(e) => updateHeading(index, 'level', parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                    <option value={5}>H5</option>
                    <option value={6}>H6</option>
                  </select>
                  <input
                    type="text"
                    value={heading.text}
                    onChange={(e) => updateHeading(index, 'text', e.target.value)}
                    placeholder={`Heading ${heading.level} text...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {addedHeadings.length > 1 && (
                    <button
                      onClick={() => removeHeading(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addHeading}
              className="mt-3 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" />
              Add Heading
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {showResults && (
            <>
              <div className={`rounded-xl p-4 ${h1Issues || hasSkippedLevels ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center gap-3">
                  {h1Issues || hasSkippedLevels ? (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                  <div>
                    <p className={`font-medium ${h1Issues || hasSkippedLevels ? 'text-yellow-800' : 'text-green-800'}`}>
                      H1 Tag Status: {h1Issues ? `${h1Count} found (should be 1)` : 'Good'}
                      {hasSkippedLevels && ' - Skipped heading levels'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Heading Distribution</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((level) => {
                      const found = results.filter(h => h.level === level);
                      return (
                        <div key={level} className="flex items-center gap-4">
                          <span className={`w-12 font-bold ${
                            level === 1 ? 'text-xl text-red-600' :
                            level === 2 ? 'text-lg text-orange-600' :
                            level === 3 ? 'text-base text-yellow-600' :
                            'text-sm text-gray-600'
                          }`}>
                            H{level}
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                level === 1 ? 'bg-red-500' :
                                level === 2 ? 'bg-orange-500' :
                                level === 3 ? 'bg-yellow-500' :
                                level === 4 ? 'bg-green-500' :
                                level === 5 ? 'bg-blue-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${Math.min(100, found.length * 20)}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm text-gray-600">{found.length}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Detected Headings ({results.length})</h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                  {results.map((heading, index) => (
                    <div key={index} className="p-3 flex items-start gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        heading.level === 1 ? 'bg-red-100 text-red-800' :
                        heading.level === 2 ? 'bg-orange-100 text-orange-800' :
                        heading.level === 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        H{heading.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{heading.text}</p>
                        {heading.count > 1 && (
                          <p className="text-xs text-gray-500">Found {heading.count} times</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {results.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No headings found
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">Best Practices</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use exactly one H1 tag per page</li>
                  <li>• Don't skip heading levels (H1 → H3)</li>
                  <li>• Use headings to structure content logically</li>
                  <li>• Include target keywords in headings</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
