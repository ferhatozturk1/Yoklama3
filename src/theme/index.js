// Enhanced Material-UI Theme with Professional Typography
import { createTheme } from '@mui/material/styles';
import { typographyConfig, typographyColors, typographySpacing } from './typography';
import { 
  fluidTypography, 
  responsiveTypographyMixins, 
  performanceTypography,
  accessibleTypography 
} from './responsiveTypography';

// Create the enhanced theme with professional typography
export const theme = createTheme({
  // Typography configuration with responsive utilities
  typography: {
    ...typographyConfig,
    
    // Ensure consistent font rendering
    htmlFontSize: 16,
    fontSize: 14,
    
    // Responsive font sizes
    responsiveFontSizes: true,
    
    // Add fluid typography variants
    welcomeHeading: {
      ...fluidTypography.welcomeHeading,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      ...performanceTypography.fontOptimization
    },
    
    timeDisplay: {
      ...fluidTypography.timeDisplay,
      fontFamily: typographyConfig.fontFamilyMonospace,
      fontWeight: 500,
      letterSpacing: '0.02em',
      ...performanceTypography.fontOptimization
    },
    
    sectionHeading: {
      ...fluidTypography.sectionHeading,
      fontWeight: 600,
      lineHeight: 1.4,
      ...performanceTypography.fontOptimization
    },
    
    cardTitle: {
      ...fluidTypography.cardTitle,
      fontWeight: 500,
      lineHeight: 1.4,
      ...performanceTypography.fontOptimization
    },
    
    bodyFluid: {
      ...fluidTypography.bodyFluid,
      fontWeight: 400,
      lineHeight: accessibleTypography.lineHeights.relaxed,
      ...performanceTypography.fontOptimization
    },
    
    captionFluid: {
      ...fluidTypography.caption,
      fontWeight: 400,
      lineHeight: accessibleTypography.lineHeights.normal,
      letterSpacing: '0.02em',
      opacity: 0.7,
      ...performanceTypography.fontOptimization
    }
  },

  // Color palette with accessibility in mind
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e',         // Deep blue for primary elements
      light: '#3f51b5',        // Lighter blue
      dark: '#0d47a1',         // Darker blue
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#9c27b0',         // Purple accent
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    text: typographyColors.text,
    background: typographyColors.background,
    
    // Additional colors for better contrast
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  },

  // Spacing system
  spacing: 8, // Base spacing unit (8px)

  // Shape and border radius
  shape: {
    borderRadius: 8
  },

  // Component overrides for consistent typography
  components: {
    // Typography component overrides
    MuiTypography: {
      styleOverrides: {
        root: {
          // Ensure consistent font rendering with performance optimization
          ...performanceTypography.fontOptimization
        },
        h1: {
          marginBottom: typographySpacing.margins.textGap
        },
        h2: {
          marginBottom: typographySpacing.margins.textGap
        },
        h3: {
          marginBottom: typographySpacing.margins.elementGap
        },
        h4: {
          marginBottom: typographySpacing.margins.elementGap
        },
        h5: {
          marginBottom: typographySpacing.margins.elementGap
        },
        h6: {
          marginBottom: typographySpacing.margins.elementGap
        },
        body1: {
          marginBottom: typographySpacing.margins.elementGap
        },
        body2: {
          marginBottom: typographySpacing.margins.elementGap
        }
      }
    },

    // Paper component for consistent elevation
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none' // Remove default gradient
        }
      }
    },

    // Button typography
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase
          fontWeight: 500,
          fontSize: '0.875rem',
          letterSpacing: '0.02em'
        }
      }
    },

    // Table typography improvements
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: 1.5
        },
        head: {
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '0.01em'
        }
      }
    },

    // Chip component typography
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.02em'
        }
      }
    },

    // AppBar typography
    MuiAppBar: {
      styleOverrides: {
        root: {
          '& .MuiTypography-h6': {
            fontWeight: 600,
            letterSpacing: '0.01em'
          }
        }
      }
    }
  },

  // Breakpoints for responsive design
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

// Export responsive typography utilities for use in components
export { 
  fluidTypography, 
  responsiveTypographyMixins, 
  performanceTypography,
  accessibleTypography 
} from './responsiveTypography';

export default theme;