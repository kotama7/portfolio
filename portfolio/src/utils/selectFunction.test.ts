import { fallbackSelectFunction } from './selectFunction';

test('matches keywords to function names', () => {
  expect(fallbackSelectFunction('show me your bio')).toBe('bioGraph');
  expect(fallbackSelectFunction('Tell me your skills')).toBe('skillTree');
  expect(fallbackSelectFunction('経歴を見せて')).toBe('bioGraph');
  expect(fallbackSelectFunction('スキルを教えて')).toBe('skillTree');
  expect(fallbackSelectFunction('profile')).toBe('profileInfo');
  expect(fallbackSelectFunction('intro')).toBe('briefIntro');
  expect(fallbackSelectFunction('What is your favorite programming language?')).toBe('favoriteLanguage');
  expect(fallbackSelectFunction('thesis')).toBe('thesisSummary');
  expect(fallbackSelectFunction('fusep')).toBe('fusepThesisSummary');
});

test('returns undefined when no keywords match', () => {
  expect(fallbackSelectFunction('nonsense input')).toBeUndefined();
});

