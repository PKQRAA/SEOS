'use client';

import { useState } from 'react';
import { Map, Copy, CheckCircle, Download, Plus, Trash2 } from 'lucide-react';

interface SitemapUrl {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState('');
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { loc: '', priority: '0.8', changefreq: 'weekly', lastmod: '' },
  ]);
  const [copied, setCopied] = useState(false);

  const generateSitemap = () => {
    const urlEntries = urls.filter(u => u.loc.trim());
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    urlEntries.forEach(url => {
      xml += `  <url>\n`;
      xml += `    <loc>${url.loc}</loc>\n`;
      if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    return xml;
  };

  const generateIndexSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <sitemap>\n`;
    xml += `    <loc>${baseUrl}/sitemap.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `  </sitemap>\n`;
    xml += `</sitemapindex>`;
    return xml;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSitemap());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateSitemap()], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addUrl = () => {
    setUrls([...urls, { loc: '', priority: '0.6', changefreq: 'weekly', lastmod: '' }]);
  };

  const updateUrl = (index: number, field: keyof SitemapUrl, value: string) => {
    const updated = [...urls];
    updated[index] = { ...updated[index], [field]: value };
    setUrls(updated);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sitemap Generator</h1>
        <p className="text-gray-600">Create XML sitemaps for search engines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">URL Configuration</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {urls.map((url, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">URL {index + 1}</span>
                  {urls.length > 1 && (
                    <button
                      onClick={() => removeUrl(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={url.loc}
                    onChange={(e) => updateUrl(index, 'loc', e.target.value)}
                    placeholder="/page-url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={url.priority}
                      onChange={(e) => updateUrl(index, 'priority', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="1.0">1.0</option>
                      <option value="0.9">0.9</option>
                      <option value="0.8">0.8</option>
                      <option value="0.7">0.7</option>
                      <option value="0.6">0.6</option>
                      <option value="0.5">0.5</option>
                    </select>
                    <select
                      value={url.changefreq}
                      onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="never">Never</option>
                    </select>
                    <input
                      type="date"
                      value={url.lastmod}
                      onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={addUrl}
            className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Another URL
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Generated sitemap.xml</h3>
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
              {generateSitemap()}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Upload sitemap.xml to your website root and submit it to Google Search Console and Bing Webmaster Tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
