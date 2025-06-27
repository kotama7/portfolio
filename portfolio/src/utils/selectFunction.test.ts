import { fallbackSelectFunction } from './selectFunction';

test('matches keywords to function names', () => {
  expect(fallbackSelectFunction('show me your bio')).toBe('bioGraph');
  expect(fallbackSelectFunction('Tell me your skills')).toBe('skillTree');
});

test('returns undefined when no keywords match', () => {
  expect(fallbackSelectFunction('nonsense input')).toBeUndefined();
});

