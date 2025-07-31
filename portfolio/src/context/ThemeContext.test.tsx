import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import React from 'react';

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

test('toggles and persists theme', () => {
  render(
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme, toggleTheme }) => (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme}>toggle</button>
          </div>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
  expect(screen.getByTestId('theme').textContent).toBe('light');
  fireEvent.click(screen.getByText('toggle'));
  expect(screen.getByTestId('theme').textContent).toBe('dark');
  expect(localStorage.getItem('theme')).toBe('dark');
});
