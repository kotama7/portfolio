import { respondToIrregularInput } from './irregular';

test('returns null for regular requests', () => {
  expect(respondToIrregularInput('Show me your bio')).toBeNull();
});

test('returns message for irregular requests', () => {
  expect(respondToIrregularInput('random text')).toBe(
    'Sorry, I could not understand your request.'
  );
});
