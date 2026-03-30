'use client';

import { useState } from 'react';
import { Code, Copy, CheckCircle, Download } from 'lucide-react';

export default function RobotsTxtGenerator() {
  const [siteUrl, setSiteUrl] = useState('');
  const [allowGoogle, setAllowGoogle] = useState(true);
  const [allowBing, setAllowBing] = useState(true);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [disallowPaths, setDisallowPaths] = useState<string[]>(['']);
  const [crawlDelay, setCrawlDelay] = useState('');
  const [copied, setCopied] = useState(false);

  const generateRobotsTxt = () => {
    const lines: string[] = [];
    
    lines.push(`User-agent: *`);
    
    if (allowGoogle) {
      lines.push(`Allow: /`);
    }
    
    if (sitemapUrl) {
      lines.push(`Sitemap: ${sitemapUrl}`);
    }
    
    lines.push('');
    lines.push(`# Crawl-delay for all bots`);
    lines.push(`Crawl-delay: ${crawlDelay || '1'}`);
    lines.push('');
    
    if (allowGoogle) {
      lines.push(`User-agent: Googlebot`);
      lines.push(`Allow: /`);
      lines.push(``);
    }
    
    if (allowBing) {
      lines.push(`User-agent: Bingbot`);
      lines.push(`Allow: /`);
      lines.push(``);
    }
    
    lines.push(`User-agent: *`);
    const paths = disallowPaths.filter(p => p.trim());
    if (paths.length > 0) {
      paths.forEach(path => {
        lines.push(`Disallow: ${path}`);
      });
    } else {
      lines.push(`Disallow:`);
    }
    
    return lines.join('\n');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateRobotsTxt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateRobotsTxt()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addDisallowPath = () => {
    setDisallowPaths([...disallowPaths, '']);
  };

  const updateDisallowPath = (index: number, value: string) => {
    const updated = [...disallowPaths];
    updated[index] = value;
    setDisallowPaths(updated);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Robots.txt Generator</h1>
        <p className="text-gray-600">Create robots.txt file for your website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sitemap URL</label>
              <input
                type="text"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crawl Delay (seconds)</label>
              <input
                type="number"
                value={crawlDelay}
                onChange={(e) => setCrawlDelay(e.target.value)}
                placeholder="1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allow Search Engines</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowGoogle}
                    onChange={(e) => setAllowGoogle(e.target.checked)}
                    className="rounded text-primary-600"
                  />
                  <span className="text-sm">Allow Googlebot</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowBing}
                    onChange={(e) => setAllowBing(e.target.checked)}
                    className="rounded text-primary-600"
                  />
                  <span className="text-sm">Allow Bingbot</span>
                </label>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Disallowed Paths</label>
                <button
                  onClick={addDisallowPath}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Path
                </button>
              </div>
              <div className="space-y-2">
                {disallowPaths.map((path, index) => (
                  <input
                    key={index}
                    type="text"
                    value={path}
                    onChange={(e) => updateDisallowPath(index, e.target.value)}
                    placeholder="/admin/ or /private/"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Generated robots.txt</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadFile}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {generateRobotsTxt()}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Place the robots.txt file in the root directory of your website (e.g., example.com/robots.txt).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
