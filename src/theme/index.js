// Enhanced Material-UI Theme with Professional Typography
import { createTheme } from '@mui/material/styles';
import { typographyConfig, typographyColors, typographySpacing } from './typography';

// Create the enhanced theme with professional typography
export const theme = createTheme({
  // Typography configuration
  typography: {
    ...typographyConfig,
    
    // Ensure consistent font rendering
    htmlFontSize: 16,
    fontSize: 14,
    
    // Responsive font sizes
    responsiveFontSizes: true,
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
          // Ensure consistent font rendering
          fontFeatureSettings: '"kern" 1',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
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

// Create responsive theme
export const responsiveTheme = createTheme(theme, {
  // Add responsive typography utilities
  typography: {
    ...theme.typography,
    
    // Custom responsive variants
    welcomeHeading: {
      fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.75rem'
      }
    },
    
    timeDisplay: {
      fontFamily: typographyConfig.fontFamilyMonospace,
      fontSize: 'clamp(1.125rem, 3vw, 1.375rem)',
      fontWeight: 500,
      letterSpacing: '0.02em'
    },
    
    sectionHeading: {
      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.4
    }
  }
});

export default responsiveTheme;