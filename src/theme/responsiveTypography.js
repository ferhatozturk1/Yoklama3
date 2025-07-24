// Responsive Typography Utilities
// This file provides reusable responsive font size utilities with fluid typography
// and fallbacks for browsers that don't support modern CSS features

// Fluid typography using clamp() with fallbacks
export const fluidTypography = {
  // Hero text - largest headings
  hero: {
    fontSize: 'clamp(2rem, 5vw, 3rem)', // 32px to 48px
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: '2rem',      // 32px fallback
        sm: '2.25rem',   // 36px fallback
        md: '2.5rem',    // 40px fallback
        lg: '3rem'       // 48px fallback
      }
    }
  },

  // Welcome heading - main page greeting
  welcomeHeading: {
    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', // 28px to 36px
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: '1.75rem',   // 28px fallback
        sm: '2rem',      // 32px fallback
        md: '2.125rem',  // 34px fallback
        lg: '2.25rem'    // 36px fallback
      }
    }
  },

  // Section headings
  sectionHeading: {
    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', // 20px to 28px
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: '1.25rem',   // 20px fallback
        sm: '1.375rem',  // 22px fallback
        md: '1.5rem',    // 24px fallback
        lg: '1.75rem'    // 28px fallback
      }
    }
  },

  // Card titles and subsection headings
  cardTitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.375rem)', // 16px to 22px
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: '1rem',      // 16px fallback
        sm: '1.125rem',  // 18px fallback
        md: '1.25rem',   // 20px fallback
        lg: '1.375rem'   // 22px fallback
      }
    }
  },

  // Time display - monospace with fluid sizing
  timeDisplay: {
    fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', // 18px to 24px
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: '1.125rem',  // 18px fallback
        sm: '1.25rem',   // 20px fallback
        md: '1.375rem',  // 22px fallback
        lg: '1.5rem'     // 24px fallback
      }
    }
  },

  // Body text with responsive scaling
  bodyFluid: {
    fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', // 14px to 18px
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: '0.875rem',  // 14px fallback
        sm: '1rem',      // 16px fallback
        md: '1.125rem'   // 18px fallback
      }
    }
  },

  // Small text and captions
  caption: {
    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', // 12px to 14px
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: '0.75rem',   // 12px fallback
        sm: '0.8125rem', // 13px fallback
        md: '0.875rem'   // 14px fallback
      }
    }
  }
};

// Responsive typography mixins for common patterns
export const responsiveTypographyMixins = {
  // Professional heading with responsive sizing
  professionalHeading: (level = 'h2') => {
    const headingStyles = {
      h1: {
        ...fluidTypography.hero,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em'
      },
      h2: {
        ...fluidTypography.welcomeHeading,
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em'
      },
      h3: {
        ...fluidTypography.sectionHeading,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0'
      },
      h4: {
        ...fluidTypography.cardTitle,
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0'
      }
    };
    
    return headingStyles[level] || headingStyles.h2;
  },

  // Responsive body text with optimal line height
  responsiveBody: (variant = 'body1') => ({
    ...fluidTypography.bodyFluid,
    fontWeight: variant === 'body1' ? 400 : 400,
    lineHeight: variant === 'body1' ? 1.6 : 1.5,
    letterSpacing: '0'
  }),

  // Time display with monospace font
  responsiveTimeDisplay: () => ({
    ...fluidTypography.timeDisplay,
    fontFamily: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      '"Roboto Mono"',
      'Consolas',
      '"Courier New"',
      'monospace'
    ].join(','),
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em'
  }),

  // Caption text with reduced opacity
  responsiveCaption: () => ({
    ...fluidTypography.caption,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    opacity: 0.7
  })
};

// Breakpoint-specific utilities
export const breakpointTypography = {
  // Mobile-first responsive font sizes
  mobile: {
    hero: '2rem',           // 32px
    heading: '1.75rem',     // 28px
    subheading: '1.25rem',  // 20px
    body: '0.875rem',       // 14px
    caption: '0.75rem'      // 12px
  },
  
  tablet: {
    hero: '2.5rem',         // 40px
    heading: '2rem',        // 32px
    subheading: '1.5rem',   // 24px
    body: '1rem',           // 16px
    caption: '0.8125rem'    // 13px
  },
  
  desktop: {
    hero: '3rem',           // 48px
    heading: '2.25rem',     // 36px
    subheading: '1.75rem',  // 28px
    body: '1.125rem',       // 18px
    caption: '0.875rem'     // 14px
  }
};

// Utility functions for creating responsive typography
export const createResponsiveTypography = (minSize, maxSize, minViewport = '20rem', maxViewport = '80rem') => {
  // Convert rem values to numbers for calculation
  const minSizeNum = parseFloat(minSize);
  const maxSizeNum = parseFloat(maxSize);
  const minViewportNum = parseFloat(minViewport);
  const maxViewportNum = parseFloat(maxViewport);
  
  // Calculate the slope for fluid typography
  const slope = (maxSizeNum - minSizeNum) / (maxViewportNum - minViewportNum);
  const yAxisIntersection = -minViewportNum * slope + minSizeNum;
  
  return {
    fontSize: `clamp(${minSize}, ${yAxisIntersection.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${maxSize})`,
    '@supports not (font-size: clamp(1rem, 1vw, 1rem))': {
      fontSize: {
        xs: minSize,
        md: `${(minSizeNum + (maxSizeNum - minSizeNum) * 0.5).toFixed(3)}rem`,
        lg: maxSize
      }
    }
  };
};

// Accessibility utilities
export const accessibleTypography = {
  // Ensure minimum font sizes for readability
  minimumSizes: {
    mobile: '0.875rem',     // 14px minimum on mobile
    desktop: '1rem'         // 16px minimum on desktop
  },
  
  // High contrast text colors
  highContrast: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)'
  },
  
  // Line height recommendations for accessibility
  lineHeights: {
    tight: 1.2,    // For large headings
    normal: 1.4,   // For medium headings
    relaxed: 1.6,  // For body text
    loose: 1.8     // For dense text blocks
  }
};

// Performance optimization utilities
export const performanceTypography = {
  // Font loading optimization
  fontDisplay: 'swap',
  
  // Prevent layout shift during font loading
  fontOptimization: {
    fontFeatureSettings: '"kern" 1',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  },
  
  // Preload hints for critical fonts
  preloadHints: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont'
  ]
};

export default {
  fluidTypography,
  responsiveTypographyMixins,
  breakpointTypography,
  createResponsiveTypography,
  accessibleTypography,
  performanceTypography
};