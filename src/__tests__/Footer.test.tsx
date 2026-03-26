import { render, screen } from '@testing-library/react';
import { Footer } from '../components/layout/Footer';

describe('Footer Component', () => {
  it('renders the correct copyright text', () => {
    render(<Footer />);
    // Check if AlgoSim text is present in the footer
    const currentYear = new Date().getFullYear();
    const copyrightElement = screen.getByText(`© ${currentYear} AlgoSim. All rights reserved.`);
    expect(copyrightElement).toBeInTheDocument();
  });
});
