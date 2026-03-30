import { NextRequest, NextResponse } from 'next/server';
import { generateKeywordSuggestions, clusterKeywords, filterKeywords } from '@/lib/keywords';
import { FilterOptions } from '@/types/keyword';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const seed = searchParams.get('seed');
  
  if (!seed) {
    return NextResponse.json(
      { error: 'Seed keyword is required' },
      { status: 400 }
    );
  }

  const minVolume = parseInt(searchParams.get('minVolume') || '0');
  const maxDifficulty = parseInt(searchParams.get('maxDifficulty') || '100');
  const minCpc = parseFloat(searchParams.get('minCpc') || '0');

  const filters: FilterOptions = {
    minSearchVolume: minVolume,
    maxDifficulty,
    minCpc
  };

  const keywords = generateKeywordSuggestions(seed);
  const filtered = filterKeywords(keywords, filters);
  const clusters = clusterKeywords(filtered);

  return NextResponse.json({
    keywords: filtered,
    totalCount: filtered.length,
    clusters
  });
}
