export const FALLBACK_KEYWORDS = [
  { keyword: 'bio', func: 'bioGraph' },
  { keyword: 'skill', func: 'skillTree' },
  { keyword: 'interest', func: 'interestGraph' },
  { keyword: 'personality', func: 'personalityRadar' },
  { keyword: 'contact', func: 'contactInfo' },
  { keyword: 'portfolio', func: 'portfolioSummary' },
  { keyword: 'link', func: 'otherSiteLinks' },
  { keyword: 'external', func: 'otherSiteLinks' },
] as const;

export type FunctionName = typeof FALLBACK_KEYWORDS[number]['func'];

export function fallbackSelectFunction(text: string): FunctionName | undefined {
  const normalized = text.toLowerCase();
  const found = FALLBACK_KEYWORDS.find(({ keyword }) =>
    normalized.includes(keyword)
  );
  return found?.func;
}

