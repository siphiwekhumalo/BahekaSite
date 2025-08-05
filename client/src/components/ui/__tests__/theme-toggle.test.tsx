import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/theme-context';
import { ThemeToggle } from '../theme-toggle';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeToggle Component', () => {
  test('renders theme toggle button', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('displays theme options in dropdown', () => {
    renderWithTheme(<ThemeToggle />);
    
    // Click the toggle button
    fireEvent.click(screen.getByRole('button'));
    
    // Check that theme options are displayed
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  test('changes theme when option is selected', () => {
    renderWithTheme(<ThemeToggle />);
    
    // Click the toggle button
    fireEvent.click(screen.getByRole('button'));
    
    // Select dark theme
    fireEvent.click(screen.getByText('Dark'));
    
    // Check that dark class is applied to document
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('respects system theme preference', () => {
    // Mock matchMedia to return dark theme preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderWithTheme(<ThemeToggle />);
    
    // Click the toggle button
    fireEvent.click(screen.getByRole('button'));
    
    // Select system theme
    fireEvent.click(screen.getByText('System'));
    
    // Should apply dark theme based on system preference
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});