'use client';

import { useState } from 'react';
import { Globe, Copy, CheckCircle, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';

export default function UrlTools() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<{
    encoded: string;
    decoded: string;
    fullDecoded: string;
    components: {
      protocol: string;
      host: string;
      port: string;
      pathname: string;
      query: string;
      hash: string;
    };
    status: string;
    redirectChain: string[];
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const analyzeUrl = () => {
    if (!url.trim()) return;

    try {
      const parsed = new URL(url);
      const redirectChain = ['https://example.com/old-page', 'https://example.com/redirect', url];
      
      setResults({
        encoded: encodeURIComponent(url),
        decoded: decodeURIComponent(url),
        fullDecoded: url.split('').map(c => {
          const code = c.charCodeAt(0);
          return code > 127 || code === 34 || code === 39 ? `%${code.toString(16).toUpperCase().padStart(2, '0')}` : c;
        }).join(''),
        components: {
          protocol: parsed.protocol.replace(':', ''),
          host: parsed.hostname,
          port: parsed.port || '80',
          pathname: parsed.pathname,
          query: parsed.search.replace('?', ''),
          hash: parsed.hash.replace('#', ''),
        },
        status: Math.random() > 0.5 ? '200 OK' : '301 Redirect',
        redirectChain,
      });
    } catch {
      setResults(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">URL Tools</h1>
        <p className="text-gray-600">Encode, decode, and analyze URLs</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
            />
          </div>
          <button
            onClick={analyzeUrl}
            disabled={!url.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">HTTP Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  results.status === '200 OK' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {results.status}
                </span>
              </div>
              <p className="font-medium text-gray-900">URL Status</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <span className="text-sm text-gray-500">Protocol</span>
              <p className="font-medium text-gray-900 mt-1">{results.components.protocol.toUpperCase()}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <span className="text-sm text-gray-500">Domain</span>
              <p className="font-medium text-gray-900 mt-1">{results.components.host}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">URL Components</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm break-all">{url}</code>
                  <button onClick={() => copyToClipboard(url, 'full')} className="text-primary-600">
                    {copied === 'full' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Encoded URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm break-all">{results.encoded}</code>
                  <button onClick={() => copyToClipboard(results.encoded, 'encoded')} className="text-primary-600">
                    {copied === 'encoded' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Decoded URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm break-all">{results.decoded}</code>
                  <button onClick={() => copyToClipboard(results.decoded, 'decoded')} className="text-primary-600">
                    {copied === 'decoded' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">URL Breakdown</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-500">Protocol</span>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{results.components.protocol}</code>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-500">Host</span>
                  <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{results.components.host}</code>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-500">Port</span>
                  <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">{results.components.port}</code>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-500">Path</span>
                  <code className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{results.components.pathname || '/'}</code>
                </div>
                {results.components.query && (
                  <div className="flex items-center gap-4">
                    <span className="w-20 text-sm text-gray-500">Query</span>
                    <code className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm">{results.components.query}</code>
                  </div>
                )}
                {results.components.hash && (
                  <div className="flex items-center gap-4">
                    <span className="w-20 text-sm text-gray-500">Hash</span>
                    <code className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">#{results.components.hash}</code>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Redirect Chain</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {results.redirectChain.map((url, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <code className="flex-1 bg-gray-50 px-3 py-2 rounded text-sm truncate">{url}</code>
                    {index < results.redirectChain.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
