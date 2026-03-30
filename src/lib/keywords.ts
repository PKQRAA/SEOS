import { Keyword, KeywordCluster, FilterOptions } from '@/types/keyword';

const keywordModifiers = [
  'best', 'top', 'free', 'cheap', 'online', 'near me', 'reviews', '2024',
  'how to', 'what is', 'why', 'guide', 'tutorial', 'examples', 'ideas',
  'tips', 'tools', 'software', 'app', 'platform', 'service', 'solution'
];

const seedKeywords = [
  'marketing', 'seo', 'content', 'digital', 'social media', 'advertising',
  'branding', 'analytics', 'email', 'video', 'mobile', 'ecommerce',
  'website', 'blog', 'youtube', 'instagram', 'facebook', 'twitter'
];

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateKeywordSuggestions(seed: string): Keyword[] {
  const random = seededRandom(hashString(seed));
  const keywords: Keyword[] = [];
  const baseTerm = seed.toLowerCase().trim();

  keywords.push({
    keyword: baseTerm,
    searchVolume: Math.floor(random() * 100000) + 1000,
    difficulty: Math.floor(random() * 100),
    cpc: Math.round(random() * 10 * 100) / 100,
    competition: random() > 0.66 ? 'high' : random() > 0.33 ? 'medium' : 'low',
    trend: Array(12).fill(0).map(() => Math.floor(random() * 100)),
    related: []
  });

  const modifierCount = Math.floor(random() * 8) + 4;
  const shuffledModifiers = [...keywordModifiers].sort(() => random() - 0.5);
  
  for (let i = 0; i < modifierCount; i++) {
    const modifier = shuffledModifiers[i];
    const keyword = `${modifier} ${baseTerm}`;
    const sv = Math.floor(random() * 50000) + 100;
    const diff = Math.floor(random() * 100);
    
    keywords.push({
      keyword,
      searchVolume: sv,
      difficulty: diff,
      cpc: Math.round((random() * 15 + 0.5) * 100) / 100,
      competition: diff > 66 ? 'high' : diff > 33 ? 'medium' : 'low',
      trend: Array(12).fill(0).map(() => Math.floor(random() * 100)),
      related: []
    });

    if (random() > 0.5) {
      const secondModifier = shuffledModifiers[(i + 1) % shuffledModifiers.length];
      keywords.push({
        keyword: `${modifier} ${secondModifier} ${baseTerm}`,
        searchVolume: Math.floor(random() * 10000) + 50,
        difficulty: Math.floor(random() * 100),
        cpc: Math.round((random() * 8 + 0.3) * 100) / 100,
        competition: random() > 0.5 ? 'medium' : 'low',
        trend: Array(12).fill(0).map(() => Math.floor(random() * 100)),
        related: []
      });
    }
  }

  const relatedCount = Math.floor(random() * 5) + 3;
  const shuffledSeeds = [...seedKeywords].filter(k => k !== baseTerm.split(' ')[0]).sort(() => random() - 0.5);
  
  for (let i = 0; i < relatedCount; i++) {
    const relatedKeyword = `${baseTerm.split(' ')[0]} ${shuffledSeeds[i]}`;
    keywords[0].related.push(relatedKeyword);
    
    keywords.push({
      keyword: relatedKeyword,
      searchVolume: Math.floor(random() * 30000) + 200,
      difficulty: Math.floor(random() * 100),
      cpc: Math.round((random() * 12 + 0.2) * 100) / 100,
      competition: random() > 0.5 ? 'medium' : 'low',
      trend: Array(12).fill(0).map(() => Math.floor(random() * 100)),
      related: []
    });
  }

  return keywords.sort((a, b) => b.searchVolume - a.searchVolume);
}

export function calculateDifficulty(keyword: string): number {
  const random = seededRandom(hashString(keyword));
  const baseLength = keyword.length;
  const wordCount = keyword.split(' ').length;
  
  let difficulty = random() * 40 + 30;
  
  if (baseLength < 20) difficulty += 15;
  if (wordCount < 3) difficulty += 10;
  if (keyword.includes('best') || keyword.includes('top')) difficulty += 15;
  if (keyword.includes('free')) difficulty -= 10;
  
  return Math.min(100, Math.max(0, Math.floor(difficulty)));
}

export function clusterKeywords(keywords: Keyword[]): KeywordCluster[] {
  const clusters: KeywordCluster[] = [];
  const used = new Set<number>();
  
  const exactMatches = keywords.filter(k => !k.keyword.includes(' '));
  const longTail = keywords.filter(k => k.keyword.includes(' '));
  
  if (exactMatches.length > 0) {
    const mainCluster: KeywordCluster = {
      id: 'main',
      name: 'Core Keywords',
      keywords: exactMatches.map(k => k.keyword),
      avgDifficulty: Math.round(exactMatches.reduce((sum, k) => sum + k.difficulty, 0) / exactMatches.length),
      totalSearchVolume: exactMatches.reduce((sum, k) => sum + k.searchVolume, 0)
    };
    clusters.push(mainCluster);
    exactMatches.forEach((k, i) => used.add(keywords.indexOf(k)));
  }

  const byWordCount: { [key: number]: Keyword[] } = {};
  longTail.forEach((k, idx) => {
    const wc = k.keyword.split(' ').length;
    if (!byWordCount[wc]) byWordCount[wc] = [];
    byWordCount[wc].push(k);
  });

  Object.entries(byWordCount).forEach(([wc, kws]) => {
    const cluster: KeywordCluster = {
      id: `cluster-${wc}`,
      name: `${wc}-Word Keywords`,
      keywords: kws.map(k => k.keyword),
      avgDifficulty: Math.round(kws.reduce((sum, k) => sum + k.difficulty, 0) / kws.length),
      totalSearchVolume: kws.reduce((sum, k) => sum + k.searchVolume, 0)
    };
    clusters.push(cluster);
  });

  return clusters;
}

export function filterKeywords(keywords: Keyword[], filters: FilterOptions): Keyword[] {
  return keywords.filter(k => 
    k.searchVolume >= filters.minSearchVolume &&
    k.difficulty <= filters.maxDifficulty &&
    k.cpc >= filters.minCpc
  );
}

export function exportToCSV(keywords: Keyword[]): string {
  const headers = ['Keyword', 'Search Volume', 'Difficulty', 'CPC', 'Competition'];
  const rows = keywords.map(k => [
    k.keyword,
    k.searchVolume.toString(),
    k.difficulty.toString(),
    k.cpc.toString(),
    k.competition
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportToJSON(keywords: Keyword[]): string {
  return JSON.stringify(keywords, null, 2);
}
