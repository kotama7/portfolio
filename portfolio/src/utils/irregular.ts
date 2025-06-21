export function respondToIrregularInput(text: string): string | null {
  const keywords = [
    'bio',
    'skill',
    'interest',
    'personality',
    'contact',
    'portfolio',
    'link',
    'external',
  ];

  const normalized = text.toLowerCase();
  const isRegular = keywords.some((kw) => normalized.includes(kw));
  if (!text.trim() || !isRegular) {
    return 'Sorry, I could not understand your request.';
  }
  return null;
}
