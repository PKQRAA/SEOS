'use client';

import { Keyword, KeywordCluster } from '@/types/keyword';
import { BarChart3, TrendingUp, Target, DollarSign } from 'lucide-react';

interface StatsPanelProps {
  keywords: Keyword[];
  clusters: KeywordCluster[];
}

export default function StatsPanel({ keywords, clusters }: StatsPanelProps) {
  const totalSearchVolume = keywords.reduce((sum, k) => sum + k.searchVolume, 0);
  const avgDifficulty = keywords.length > 0 
    ? Math.round(keywords.reduce((sum, k) => sum + k.difficulty, 0) / keywords.length)
    : 0;
  const avgCpc = keywords.length > 0
    ? keywords.reduce((sum, k) => sum + k.cpc, 0) / keywords.length
    : 0;
  const easyKeywords = keywords.filter(k => k.difficulty <= 33).length;

  const stats = [
    {
      label: 'Total Keywords',
      value: keywords.length.toLocaleString(),
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Search Volume',
      value: formatLargeNumber(totalSearchVolume),
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      label: 'Avg Difficulty',
      value: avgDifficulty.toString(),
      icon: BarChart3,
      color: avgDifficulty <= 33 ? 'bg-green-500' : avgDifficulty <= 66 ? 'bg-yellow-500' : 'bg-red-500'
    },
    {
      label: 'Avg CPC',
      value: `$${avgCpc.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clusters.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Keyword Clusters</h3>
          <div className="space-y-3">
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{cluster.name}</p>
                  <p className="text-sm text-gray-500">{cluster.keywords.length} keywords</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatLargeNumber(cluster.totalSearchVolume)} vol
                  </p>
                  <p className={`text-xs ${
                    cluster.avgDifficulty <= 33 ? 'text-green-600' :
                    cluster.avgDifficulty <= 66 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {cluster.avgDifficulty} avg difficulty
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {easyKeywords > 0 && keywords.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800">
            <span className="font-semibold">{easyKeywords} easy keywords</span> found (difficulty ≤ 33) - great opportunities for quick wins!
          </p>
        </div>
      )}
    </div>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}
