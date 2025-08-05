import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { MemoryRouter } from 'wouter/memory-location';
import Hero from '../hero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Router hook={MemoryRouter}>
      {component}
    </Router>
  );
};

describe('Hero Component', () => {
  test('renders hero heading', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText('Building the')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();
    expect(screen.getByText('of Technology')).toBeInTheDocument();
  });

  test('displays company description', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText(/craft cutting-edge software solutions/i)).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('View Our Work')).toBeInTheDocument();
  });

  test('displays team statistics', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText('Projects Delivered')).toBeInTheDocument();
    expect(screen.getByText('Happy Clients')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
  });

  test('renders security and quality badges', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText('Enterprise Security')).toBeInTheDocument();
    expect(screen.getByText('Quality Assured')).toBeInTheDocument();
  });
});