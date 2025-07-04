import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the chatbox component so it doesn't fail during tests
jest.mock('react-chatbox-component', () => ({
  ChatBox: () => <div data-testid="chatbox" />,
}));

beforeAll(() => {
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        getRandomValues: (arr: Uint8Array) => require('crypto').randomFillSync(arr)
      }
    });
  }
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
  class MockObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockObserver,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn(),
  });
});

test('renders chatbox', () => {
  render(<App />);
  expect(screen.getByTestId('chatbox')).toBeInTheDocument();
});
