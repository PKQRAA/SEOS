'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, Link2, Shield, FileText, Code, Map, 
  Hash, Globe, Lock, List, Image, Share2, ArrowLeft,
  Menu, X
} from 'lucide-react';
import { useState } from 'react';

const tools = [
  { name: 'Keyword Research', href: '/', icon: Search, color: 'bg-blue-500' },
  { name: 'SERP Analysis', href: '/tools/serp-analysis', icon: Globe, color: 'bg-green-500' },
  { name: 'Backlink Checker', href: '/tools/backlink-checker', icon: Link2, color: 'bg-purple-500' },
  { name: 'Domain Authority', href: '/tools/domain-authority', icon: Shield, color: 'bg-orange-500' },
  { name: 'On-Page SEO', href: '/tools/onpage-seo', icon: FileText, color: 'bg-red-500' },
  { name: 'Meta Tag Generator', href: '/tools/meta-tag-generator', icon: Code, color: 'bg-pink-500' },
  { name: 'Robots.txt Generator', href: '/tools/robots-txt', icon: Code, color: 'bg-indigo-500' },
  { name: 'Sitemap Generator', href: '/tools/sitemap-generator', icon: Map, color: 'bg-teal-500' },
  { name: 'Keyword Density', href: '/tools/keyword-density', icon: Hash, color: 'bg-cyan-500' },
  { name: 'URL Tools', href: '/tools/url-tools', icon: Globe, color: 'bg-slate-500' },
  { name: 'SSL Checker', href: '/tools/ssl-checker', icon: Lock, color: 'bg-emerald-500' },
  { name: 'Heading Checker', href: '/tools/heading-checker', icon: List, color: 'bg-amber-500' },
  { name: 'Open Graph', href: '/tools/open-graph', icon: Share2, color: 'bg-rose-500' },
];

export default function ToolsSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary-600 text-white p-4 rounded-full shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto pb-20 lg:pb-0
      `}>
        <div className="p-4 lg:p-6">
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>

          <div className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              SEO Tools
            </h2>
          </div>

          <nav className="space-y-1">
            {tools.map((tool) => {
              const isActive = pathname === tool.href;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <div className={`${tool.color} p-1.5 rounded-md`}>
                    <tool.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{tool.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-1">Pro Tip</h3>
              <p className="text-xs text-primary-100">
                Use these tools together for comprehensive SEO analysis!
              </p>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
