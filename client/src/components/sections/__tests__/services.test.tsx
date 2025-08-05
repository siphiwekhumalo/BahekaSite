import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { MemoryRouter } from 'wouter/memory-location';
import Services from '../services';

// Mock framer-motion
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

describe('Services Component', () => {
  test('renders services section title', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  test('displays all services', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText('Software Development')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Design & Engineering')).toBeInTheDocument();
    expect(screen.getByText('Cloud Infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Automation & Consulting')).toBeInTheDocument();
  });

  test('renders service descriptions', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText(/Custom software solutions built with modern technologies/i)).toBeInTheDocument();
    expect(screen.getByText(/User-centered design and engineering solutions/i)).toBeInTheDocument();
    expect(screen.getByText(/Scalable cloud solutions and DevOps practices/i)).toBeInTheDocument();
    expect(screen.getByText(/Strategic technology consulting and automation solutions/i)).toBeInTheDocument();
  });

  test('renders learn more links for each service', () => {
    renderWithRouter(<Services />);
    const learnMoreLinks = screen.getAllByText('Learn More');
    expect(learnMoreLinks).toHaveLength(4);
  });

  test('service cards have hover effects', () => {
    renderWithRouter(<Services />);
    const serviceCards = screen.getAllByText('Learn More').map(link => link.closest('div'));
    serviceCards.forEach(card => {
      expect(card).toHaveClass('hover:shadow-lg');
    });
  });
});