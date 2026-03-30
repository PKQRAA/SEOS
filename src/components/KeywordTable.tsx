'use client';

import { Keyword } from '@/types/keyword';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KeywordTableProps {
  keywords: Keyword[];
  onKeywordClick: (keyword: string) => void;
}

function DifficultyBadge({ difficulty }: { difficulty: number }) {
  const getDifficultyClass = () => {
    if (difficulty <= 33) return 'bg-green-100 text-green-800';
    if (difficulty <= 66) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyLabel = () => {
    if (difficulty <= 33) return 'Easy';
    if (difficulty <= 66) return 'Medium';
    return 'Hard';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyClass()}`}>
      {getDifficultyLabel()} ({difficulty})
    </span>
  );
}

function CompetitionIndicator({ competition }: { competition: string }) {
  const getColorClass = () => {
    switch (competition) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${getColorClass()}`} />
      <span className="text-sm text-gray-600 capitalize">{competition}</span>
    </div>
  );
}

function TrendChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  const firstHalf = data.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
  const secondHalf = data.slice(6).reduce((a, b) => a + b, 0) / 6;
  const trend = secondHalf - firstHalf;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end h-6 gap-0.5">
        {data.map((value, i) => (
          <div
            key={i}
            className="w-1.5 bg-primary-300 rounded-sm"
            style={{ height: `${((value - min) / range) * 100}%` }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 flex items-center gap-1">
        {trend > 5 ? (
          <TrendingUp className="h-3 w-3 text-green-600" />
        ) : trend < -5 ? (
          <TrendingDown className="h-3 w-3 text-red-600" />
        ) : (
          <Minus className="h-3 w-3 text-gray-400" />
        )}
      </span>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function KeywordTable({ keywords, onKeywordClick }: KeywordTableProps) {
  if (keywords.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No keywords found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Search Volume
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CPC ($)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Competition
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {keywords.map((keyword, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onKeywordClick(keyword.keyword)}
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{keyword.keyword}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-900 font-medium">{formatNumber(keyword.searchVolume)}</span>
                  <span className="text-gray-500 text-sm ml-1">/mo</span>
                </td>
                <td className="px-6 py-4">
                  <DifficultyBadge difficulty={keyword.difficulty} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-900">${keyword.cpc.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <CompetitionIndicator competition={keyword.competition} />
                </td>
                <td className="px-6 py-4">
                  <TrendChart data={keyword.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
