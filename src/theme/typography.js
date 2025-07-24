// Professional Typography Configuration
// This file contains the enhanced typography system for a modern, professional look

export const typographyConfig = {
  // Professional font stack with system fonts for optimal performance
  fontFamily: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),

  // Monospace font stack for time displays and code
  fontFamilyMonospace: [
    'SF Mono',
    'Monaco',
    'Inconsolata',
    '"Roboto Mono"',
    'Consolas',
    '"Courier New"',
    'monospace'
  ].join(','),

  // Professional typography scale with responsive sizing
  h1: {
    fontSize: '2.5rem',        // 40px - Hero headings
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    '@media (max-width:600px)': {
      fontSize: '2rem'         // 32px on mobile
    }
  },

  h2: {
    fontSize: '2rem',          // 32px - Main page headings
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    '@media (max-width:600px)': {
      fontSize: '1.75rem'      // 28px on mobile
    }
  },

  h3: {
    fontSize: '1.5rem',        // 24px - Section headings
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0',
    '@media (max-width:600px)': {
      fontSize: '1.375rem'     // 22px on mobile
    }
  },

  h4: {
    fontSize: '1.25rem',       // 20px - Subsection headings
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0',
    '@media (max-width:600px)': {
      fontSize: '1.125rem'     // 18px on mobile
    }
  },

  h5: {
    fontSize: '1.125rem',      // 18px - Card titles
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0'
  },

  h6: {
    fontSize: '1rem',          // 16px - Small headings
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0'
  },

  // Body text with improved readability
  body1: {
    fontSize: '1rem',          // 16px - Primary body text
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0',
    '@media (max-width:600px)': {
      fontSize: '0.875rem'     // 14px on mobile
    }
  },

  body2: {
    fontSize: '0.875rem',      // 14px - Secondary body text
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0'
  },

  // Captions and metadata
  caption: {
    fontSize: '0.75rem',       // 12px - Small text, timestamps
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    opacity: 0.7
  },

  // Button text
  button: {
    fontSize: '0.875rem',      // 14px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    textTransform: 'none'      // Prevent uppercase transformation
  }
};

// Responsive font size utilities
export const responsiveFontSizes = {
  // Welcome heading - professional size
  welcomeHeading: {
    fontSize: {
      xs: '1.75rem',           // 28px mobile
      sm: '2rem',              // 32px tablet
      md: '2.125rem',          // 34px desktop
      lg: '2.25rem'            // 36px large screens
    },
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em'
  },

  // Time display - monospace for better readability
  timeDisplay: {
    fontSize: {
      xs: '1.125rem',          // 18px mobile
      sm: '1.25rem',           // 20px tablet
      md: '1.375rem'           // 22px desktop
    },
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em'
  },

  // Section headings
  sectionHeading: {
    fontSize: {
      xs: '1.25rem',           // 20px mobile
      sm: '1.375rem',          // 22px tablet
      md: '1.5rem'             // 24px desktop
    },
    fontWeight: 600,
    lineHeight: 1.4
  },

  // Card titles
  cardTitle: {
    fontSize: {
      xs: '1rem',              // 16px mobile
      sm: '1.125rem',          // 18px tablet
      md: '1.25rem'            // 20px desktop
    },
    fontWeight: 500,
    lineHeight: 1.4
  },

  // Body text with responsive scaling
  bodyResponsive: {
    fontSize: {
      xs: '0.875rem',          // 14px mobile
      sm: '1rem'               // 16px tablet+
    },
    lineHeight: 1.6
  }
};

// Color and contrast utilities for accessibility
export const typographyColors = {
  primary: {
    main: '#1a237e',           // Deep blue for headings
    light: '#3f51b5',          // Lighter blue for secondary text
    dark: '#0d47a1'            // Darker blue for emphasis
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',      // High contrast for body text
    secondary: 'rgba(0, 0, 0, 0.6)',     // Medium contrast for secondary text
    disabled: 'rgba(0, 0, 0, 0.38)',     // Low contrast for disabled text
    hint: 'rgba(0, 0, 0, 0.38)'          // Subtle text for hints
  },
  background: {
    paper: '#ffffff',
    default: '#fafafa'
  }
};

// Spacing system based on typography scale
export const typographySpacing = {
  // Vertical rhythm based on line height
  baseLineHeight: 1.5,
  
  // Spacing multipliers
  spacing: {
    xs: '0.25rem',             // 4px
    sm: '0.5rem',              // 8px
    md: '1rem',                // 16px
    lg: '1.5rem',              // 24px
    xl: '2rem',                // 32px
    xxl: '3rem'                // 48px
  },

  // Margin utilities for consistent spacing
  margins: {
    sectionGap: '2rem',        // Between major sections
    cardGap: '1.5rem',         // Between cards
    textGap: '1rem',           // Between text blocks
    elementGap: '0.5rem'       // Between related elements
  }
};