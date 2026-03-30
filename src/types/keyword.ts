export interface Keyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: 'low' | 'medium' | 'high';
  trend: number[];
  related: string[];
}

export interface KeywordCluster {
  id: string;
  name: string;
  keywords: string[];
  avgDifficulty: number;
  totalSearchVolume: number;
}

export interface SearchResult {
  keywords: Keyword[];
  totalCount: number;
  clusters: KeywordCluster[];
}

export interface FilterOptions {
  minSearchVolume: number;
  maxDifficulty: number;
  minCpc: number;
}
