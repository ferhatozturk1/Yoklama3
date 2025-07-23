import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profilim from '../Profilim';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Mock the API services
jest.mock('../../utils/ApiService');
jest.mock('../../utils/MockApiService');

describe('Profilim Component Responsive Design', () => {
  const mockProfile = {
    id: 'user123',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    phone: '+90 555 123 4567',
    university: 'Manisa Celal Bayar Üniversitesi',
    faculty: 'Mühendislik Fakültesi',
    department: 'Bilgisayar Mühendisliği',
    profilePhoto: 'https://example.com/photo.jpg',
  };

  // Create themes with different breakpoints for testing
  const createResponsiveTheme = (width) => createTheme({
    props: { MuiWithWidth: { initialWidth: width } },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  // Mock window.matchMedia for testing responsive design
  beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  test('renders with responsive layout on mobile', () => {
    const mobileTheme = createResponsiveTheme('xs');
    
    const { container } = render(
      <ThemeProvider theme={mobileTheme}>
        <Profilim userProfile={mockProfile} />
      </ThemeProvider>
    );
    
    // Check that the Grid container has responsive spacing
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
    
    // Check that the Grid items stack vertically on mobile
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    gridItems.forEach(item => {
      expect(item).toHaveClass('MuiGrid-grid-xs-12');
    });
  });

  test('renders with responsive layout on desktop', () => {
    const desktopTheme = createResponsiveTheme('md');
    
    const { container } = render(
      <ThemeProvider theme={desktopTheme}>
        <Profilim userProfile={mockProfile} />
      </ThemeProvider>
    );
    
    // Check that the Grid container has responsive spacing
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
    
    // Check that the Grid items are side by side on desktop
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    expect(gridItems[0]).toHaveClass('MuiGrid-grid-md-4');
    expect(gridItems[1]).toHaveClass('MuiGrid-grid-md-8');
  });

  test('renders with responsive padding', () => {
    const { container } = render(<Profilim userProfile={mockProfile} />);
    
    // Check that the Paper components have responsive padding
    const papers = container.querySelectorAll('.MuiPaper-root');
    expect(papers.length).toBeGreaterThan(0);
    
    // We can't directly test the responsive padding in JSDOM,
    // but we can verify the component renders without errors
  });
});