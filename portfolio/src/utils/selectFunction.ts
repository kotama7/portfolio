export const FALLBACK_KEYWORDS = [
  { keyword: 'bio', func: 'bioGraph' },
  { keyword: '経歴', func: 'bioGraph' },
  { keyword: 'skill', func: 'skillTree' },
  { keyword: 'スキル', func: 'skillTree' },
  { keyword: 'interest', func: 'interestGraph' },
  { keyword: '興味', func: 'interestGraph' },
  { keyword: 'personality', func: 'personalityRadar' },
  { keyword: '性格', func: 'personalityRadar' },
  { keyword: 'contact', func: 'contactInfo' },
  { keyword: '連絡', func: 'contactInfo' },
  { keyword: 'portfolio', func: 'portfolioSummary' },
  { keyword: 'ポートフォリオ', func: 'portfolioSummary' },
  { keyword: 'link', func: 'otherSiteLinks' },
  { keyword: 'リンク', func: 'otherSiteLinks' },
  { keyword: 'external', func: 'otherSiteLinks' },
  { keyword: 'profile', func: 'profileInfo' },
  { keyword: 'プロフィール', func: 'profileInfo' },
] as const;

export type FunctionName = typeof FALLBACK_KEYWORDS[number]['func'];

export function fallbackSelectFunction(text: string): FunctionName | undefined {
  const normalized = text.toLowerCase();
  const found = FALLBACK_KEYWORDS.find(({ keyword }) =>
    normalized.includes(keyword)
  );
  return found?.func;
}

