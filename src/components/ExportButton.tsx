'use client';

import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Check } from 'lucide-react';
import { Keyword } from '@/types/keyword';
import { exportToCSV, exportToJSON } from '@/lib/keywords';

interface ExportButtonProps {
  keywords: Keyword[];
}

export default function ExportButton({ keywords }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const handleExport = (format: 'csv' | 'json') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = exportToCSV(keywords);
      filename = 'keywords.csv';
      mimeType = 'text/csv';
    } else {
      content = exportToJSON(keywords);
      filename = 'keywords.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(format);
    setTimeout(() => {
      setExported(null);
      setShowMenu(false);
    }, 2000);
  };

  if (keywords.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Download className="h-4 w-4" />
        Export ({keywords.length})
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Export as CSV</span>
              {exported === 'csv' && <Check className="h-4 w-4 text-green-500 ml-auto" />}
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <FileJson className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Export as JSON</span>
              {exported === 'json' && <Check className="h-4 w-4 text-green-500 ml-auto" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
