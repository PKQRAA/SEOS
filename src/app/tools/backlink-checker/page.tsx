'use client';

import { useState } from 'react';
import { Search, Link2, ExternalLink, AlertTriangle, CheckCircle, XCircle, Globe } from 'lucide-react';

interface BacklinkData {
  url: string;
  domain: string;
  authority: number;
  linkingPages: number;
  doFollow: boolean;
  anchor: string;
}

export default function BacklinkChecker() {
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [backlinks, setBacklinks] = useState<BacklinkData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const checkBacklinks = () => {
    if (!domain.trim()) return;
    setIsChecking(true);

    setTimeout(() => {
      const mockBacklinks: BacklinkData[] = [
        { url: 'https://blog.example.com/seo-guide', domain: 'blog.example.com', authority: 65, linkingPages: 12, doFollow: true, anchor: 'SEO guide' },
        { url: 'https://news.site.org/marketing-tips', domain: 'news.site.org', authority: 72, linkingPages: 8, doFollow: true, anchor: 'click here' },
        { url: 'https://wiki.resource.net/learn/seo', domain: 'wiki.resource.net', authority: 58, linkingPages: 5, doFollow: false, anchor: 'SEO tools' },
        { url: 'https://forum.community.com/discussion', domain: 'forum.community.com', authority: 45, linkingPages: 3, doFollow: true, anchor: 'helpful resource' },
        { url: 'https://directory.business.com/seo', domain: 'directory.business.com', authority: 38, linkingPages: 1, doFollow: false, anchor: 'website' },
        { url: 'https://resource.edu/tutorial/seo', domain: 'resource.edu', authority: 88, linkingPages: 15, doFollow: true, anchor: 'best SEO practices' },
        { url: 'https://article.publisher.io/tips-2024', domain: 'article.publisher.io', authority: 55, linkingPages: 7, doFollow: true, anchor: 'learn more' },
        { url: 'https://blog.startup.io/strategies', domain: 'blog.startup.io', authority: 62, linkingPages: 4, doFollow: true, anchor: 'SEO strategies' },
      ];
      setBacklinks(mockBacklinks);
      setShowResults(true);
      setIsChecking(false);
    }, 1500);
  };

  const totalLinks = backlinks.length;
  const doFollowCount = backlinks.filter(b => b.doFollow).length;
  const noFollowCount = totalLinks - doFollowCount;
  const avgAuthority = Math.round(backlinks.reduce((sum, b) => sum + b.authority, 0) / totalLinks);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Backlink Checker</h1>
        <p className="text-gray-600">Analyze backlinks pointing to any website</p>
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
              onKeyDown={(e) => e.key === 'Enter' && checkBacklinks()}
            />
          </div>
          <button
            onClick={checkBacklinks}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Backlinks</p>
              <p className="text-2xl font-bold text-gray-900">{totalLinks}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Do-Follow Links</p>
              <p className="text-2xl font-bold text-green-600">{doFollowCount}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">No-Follow Links</p>
              <p className="text-2xl font-bold text-gray-600">{noFollowCount}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Avg. Authority</p>
              <p className="text-2xl font-bold text-primary-600">{avgAuthority}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Backlink Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Domain Authority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Links</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Anchor Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {backlinks.map((backlink, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <a href={backlink.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 text-sm flex items-center gap-1">
                          {backlink.domain} <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          backlink.authority >= 70 ? 'bg-green-100 text-green-800' :
                          backlink.authority >= 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {backlink.authority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{backlink.linkingPages}</td>
                      <td className="px-4 py-3">
                        {backlink.doFollow ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" /> Do-Follow
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <XCircle className="h-3 w-3" /> No-Follow
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 italic">"{backlink.anchor}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
