'use client';

import { useState } from 'react';
import { Share2, Copy, CheckCircle, Download, Image, Globe, FileText } from 'lucide-react';

export default function OpenGraphGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [type, setType] = useState('website');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [copied, setCopied] = useState(false);

  const generateOGTags = () => {
    const tags: string[] = [];
    
    tags.push(`<meta property="og:title" content="${title}">`);
    tags.push(`<meta property="og:description" content="${description}">`);
    tags.push(`<meta property="og:url" content="${url}">`);
    tags.push(`<meta property="og:type" content="${type}">`);
    if (imageUrl) tags.push(`<meta property="og:image" content="${imageUrl}">`);
    if (siteName) tags.push(`<meta property="og:site_name" content="${siteName}">`);
    
    tags.push('');
    tags.push(`<meta name="twitter:card" content="${twitterCard}">`);
    tags.push(`<meta name="twitter:title" content="${title}">`);
    tags.push(`<meta name="twitter:description" content="${description}">`);
    if (imageUrl) tags.push(`<meta name="twitter:image" content="${imageUrl}">`);
    
    return tags.join('\n');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateOGTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewSizes = [
    { platform: 'Facebook', size: '1200 x 630', icon: Share2, color: 'bg-blue-600' },
    { platform: 'Twitter', size: '1200 x 675', icon: Globe, color: 'bg-sky-500' },
    { platform: 'LinkedIn', size: '1200 x 627', icon: Share2, color: 'bg-blue-700' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Open Graph Generator</h1>
        <p className="text-gray-600">Create Open Graph and Twitter Card meta tags</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter page title"
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter meta description"
                maxLength={155}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/155 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Your Site Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="product">Product</option>
                  <option value="video">Video</option>
                  <option value="music">Music</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Card</label>
                <select
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Generated Tags</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-48">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {generateOGTags() || '<!-- Enter values to generate tags -->'}
              </pre>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="space-y-4">
              {previewSizes.map((preview) => (
                <div key={preview.platform} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
                    <preview.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{preview.platform}</span>
                    <span className="text-xs text-gray-500 ml-auto">{preview.size}</span>
                  </div>
                  <div className="p-3">
                    {imageUrl && (
                      <div 
                        className="w-full h-24 bg-gray-200 rounded mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                    )}
                    <p className="font-medium text-gray-900 text-sm truncate">{title || 'Page Title'}</p>
                    <p className="text-gray-600 text-xs line-clamp-2 mt-1">{description || 'Page description will appear here...'}</p>
                    <p className="text-gray-500 text-xs mt-1">{url || 'example.com'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 mb-2">Recommended Image Sizes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Facebook: 1200 x 630 pixels</li>
              <li>• Twitter: 1200 x 675 pixels</li>
              <li>• LinkedIn: 1200 x 627 pixels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
