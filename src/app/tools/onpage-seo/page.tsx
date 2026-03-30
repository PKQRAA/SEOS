'use client';

import { useState } from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Search, ExternalLink, Globe } from 'lucide-react';

interface OnPageIssue {
  id: number;
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
  recommendation: string;
}

export default function OnPageSEO() {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const checkOnPage = async () => {
    if (!url.trim()) return;
    setIsChecking(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || '';
      const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const h1Tags = Array.from(doc.querySelectorAll('h1')).map(el => el.textContent || '');
      const h2Tags = Array.from(doc.querySelectorAll('h2')).map(el => el.textContent || '');
      const images = Array.from(doc.querySelectorAll('img'));
      const imagesWithoutAlt = images.filter(img => !img.getAttribute('alt')).length;
      const links = Array.from(doc.querySelectorAll('a[href]'));
      const externalLinks = links.filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('http') && !href.includes(new URL(url).hostname);
      }).length;
      const internalLinks = links.filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('/') || href.includes(new URL(url).hostname);
      }).length;

      const textContent = doc.body?.textContent || '';
      const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

      const hasOGTags = doc.querySelector('meta[property="og:title"]') !== null;
      const hasTwitterCard = doc.querySelector('meta[name="twitter:card"]') !== null;
      const hasCanonical = doc.querySelector('link[rel="canonical"]') !== null;
      const hasViewport = doc.querySelector('meta[name="viewport"]') !== null;

      const issues: OnPageIssue[] = [];

      if (title.length >= 50 && title.length <= 60) {
        issues.push({ id: 1, type: 'success', title: 'Title Tag', description: `Title is optimal (${title.length} characters)`, recommendation: 'Great! Your title is within the recommended range.' });
      } else if (title.length > 0) {
        issues.push({ id: 2, type: 'warning', title: 'Title Tag Length', description: `Title is ${title.length} characters`, recommendation: 'Recommended: 50-60 characters for best results.' });
      } else {
        issues.push({ id: 3, type: 'error', title: 'Missing Title', description: 'No title tag found', recommendation: 'Add a title tag to your page.' });
      }

      if (metaDesc.length >= 150 && metaDesc.length <= 160) {
        issues.push({ id: 4, type: 'success', title: 'Meta Description', description: `Meta description is optimal (${metaDesc.length} characters)`, recommendation: 'Well optimized!' });
      } else if (metaDesc.length > 0) {
        issues.push({ id: 5, type: 'warning', title: 'Meta Description Length', description: `Meta description is ${metaDesc.length} characters`, recommendation: 'Recommended: 150-160 characters.' });
      } else {
        issues.push({ id: 6, type: 'error', title: 'Missing Meta Description', description: 'No meta description found', recommendation: 'Add a meta description for better CTR.' });
      }

      if (h1Tags.length === 1) {
        issues.push({ id: 7, type: 'success', title: 'H1 Tag', description: `Found exactly 1 H1 tag`, recommendation: 'Perfect! One H1 per page.' });
      } else if (h1Tags.length > 1) {
        issues.push({ id: 8, type: 'error', title: 'Multiple H1 Tags', description: `Found ${h1Tags.length} H1 tags`, recommendation: 'Use only one H1 tag per page.' });
      } else {
        issues.push({ id: 9, type: 'warning', title: 'Missing H1', description: 'No H1 tag found', recommendation: 'Add an H1 tag with your target keyword.' });
      }

      if (imagesWithoutAlt === 0) {
        issues.push({ id: 10, type: 'success', title: 'Image Alt Text', description: 'All images have alt text', recommendation: 'Great for accessibility!' });
      } else {
        issues.push({ id: 11, type: 'warning', title: 'Missing Alt Text', description: `${imagesWithoutAlt} images missing alt text`, recommendation: 'Add descriptive alt text to all images.' });
      }

      if (wordCount >= 300) {
        issues.push({ id: 12, type: 'success', title: 'Content Length', description: `${wordCount} words`, recommendation: 'Good content length!' });
      } else {
        issues.push({ id: 13, type: 'warning', title: 'Short Content', description: `Only ${wordCount} words`, recommendation: 'Consider adding more content (300+ words recommended).' });
      }

      if (hasOGTags) {
        issues.push({ id: 14, type: 'success', title: 'Open Graph Tags', description: 'OG tags present', recommendation: 'Good for social sharing!' });
      } else {
        issues.push({ id: 15, type: 'warning', title: 'Missing OG Tags', description: 'No Open Graph tags found', recommendation: 'Add OG tags for better social media sharing.' });
      }

      if (hasCanonical) {
        issues.push({ id: 16, type: 'success', title: 'Canonical URL', description: 'Canonical tag present', recommendation: 'Prevents duplicate content issues.' });
      } else {
        issues.push({ id: 17, type: 'warning', title: 'Missing Canonical', description: 'No canonical tag found', recommendation: 'Add a canonical tag to prevent duplicate content.' });
      }

      if (externalLinks > 0) {
        issues.push({ id: 18, type: 'success', title: 'External Links', description: `${externalLinks} external links`, recommendation: 'Links to authoritative sources.' });
      }

      if (internalLinks >= 3) {
        issues.push({ id: 19, type: 'success', title: 'Internal Linking', description: `${internalLinks} internal links`, recommendation: 'Good site structure!' });
      } else {
        issues.push({ id: 20, type: 'warning', title: 'Internal Linking', description: `Only ${internalLinks} internal links`, recommendation: 'Add more internal links for better crawlability.' });
      }

      setResult({
        url,
        title,
        metaDescription: metaDesc,
        h1: h1Tags,
        h2: h2Tags.slice(0, 5),
        wordCount,
        imagesTotal: images.length,
        imagesWithoutAlt,
        externalLinks,
        internalLinks,
        issues
      });
    } catch (err) {
      setError('Could not fetch the website. Make sure the URL is correct and the site allows requests.');
    } finally {
      setIsChecking(false);
    }
  };

  const successCount = result?.issues.filter((i: any) => i.type === 'success').length || 0;
  const warningCount = result?.issues.filter((i: any) => i.type === 'warning').length || 0;
  const errorCount = result?.issues.filter((i: any) => i.type === 'error').length || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">On-Page SEO Analyzer</h1>
        <p className="text-gray-600">Analyze any website for real SEO issues and recommendations</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze (e.g., https://example.com)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && checkOnPage()}
            />
          </div>
          <button
            onClick={checkOnPage}
            disabled={isChecking || !url.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            {isChecking ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Title</p>
                  <p className="font-medium text-gray-900">{result.title || 'Not found'}</p>
                  <p className="text-xs text-gray-400">{result.title?.length || 0}/60 characters</p>
                </div>
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 flex items-center gap-1">
                  Visit <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Meta Description</p>
                <p className="text-gray-700">{result.metaDescription || 'Not found'}</p>
                <p className="text-xs text-gray-400">{result.metaDescription?.length || 0}/160 characters</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">H1 Tags ({result.h1.length})</p>
                  {result.h1.map((h: string, i: number) => (
                    <p key={i} className="text-gray-700">- {h}</p>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stats</p>
                  <p className="text-sm">Words: {result.wordCount}</p>
                  <p className="text-sm">Images: {result.imagesTotal} ({result.imagesWithoutAlt} missing alt)</p>
                  <p className="text-sm">Internal Links: {result.internalLinks}</p>
                  <p className="text-sm">External Links: {result.externalLinks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Issues & Recommendations</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {result.issues.map((issue: any) => (
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
