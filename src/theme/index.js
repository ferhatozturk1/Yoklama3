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
  // Modern Typography System
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    
    // Ensure consistent font rendering
    htmlFontSize: 16,
    fontSize: 16, // Increased base font size for better readability
    
    // Responsive font sizes
    responsiveFontSizes: true,
    
    // Standard typography variants with modern styling
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    
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

  // Modern Academic Color Palette
  palette: {
    mode: 'light',
    primary: {
      main: '#1B2E6D',         // Dark Blue - Modern Academic
      light: '#4A90E2',        // Light Blue
      dark: '#0F1B3C',         // Darker Blue
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#4A90E2',         // Light Blue accent
      light: '#7BB3F0',
      dark: '#2B5A8C',
      contrastText: '#FFFFFF'
    },
    accent: {
      main: '#F5A623',         // Orange for highlights
      light: '#FFB84D',
      dark: '#D18B00',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F9FAFB',      // Soft Light Gray
      paper: '#FFFFFF',
      elevated: '#FFFFFF'
    },
    text: {
      primary: '#2C3E50',      // Charcoal Gray
      secondary: '#7F8C8D',
      disabled: '#BDC3C7'
    },
    
    // Enhanced grey palette
    grey: {
      50: '#F8F9FA',
      100: '#E9ECEF',
      200: '#DEE2E6',
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#6C757D',
      600: '#495057',
      700: '#343A40',
      800: '#212529',
      900: '#1A1D20'
    },
    
    // Status colors
    success: {
      main: '#27AE60',
      light: '#58D68D',
      dark: '#1E8449'
    },
    warning: {
      main: '#F39C12',
      light: '#F8C471',
      dark: '#D68910'
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#C0392B'
    },
    info: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2980B9'
    }
  },

  // Spacing system
  spacing: 8, // Base spacing unit (8px)

  // Shape and border radius
  shape: {
    borderRadius: 0
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

    // Modern Card Component
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #DEE2E6',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },

    // Paper component for consistent elevation
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 0,
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.12)',
        },
      }
    },

    // Modern Button Component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1B2E6D 0%, #4A90E2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0F1B3C 0%, #2B5A8C 100%)',
            boxShadow: '0px 4px 8px rgba(27, 46, 109, 0.3)',
          },
        },
        outlined: {
          borderColor: '#1B2E6D',
          color: '#1B2E6D',
          '&:hover': {
            backgroundColor: 'rgba(27, 46, 109, 0.04)',
            borderColor: '#1B2E6D',
          },
        },
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

    // Modern AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2C3E50',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
          borderBottom: '1px solid #E9ECEF',
          '& .MuiTypography-h6': {
            fontWeight: 600,
            letterSpacing: '0.01em'
          }
        }
      }
    },

    // Modern Drawer/Sidebar
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1B2E6D',
          color: '#FFFFFF',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },

    // Enhanced List Items
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
      },
    },

    // Input Fields
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4A90E2',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1B2E6D',
              borderWidth: 2,
            },
          },
        },
      },
    },

    // Select Component
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    // Tab Component
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          '&.Mui-selected': {
            color: '#1B2E6D',
          },
        },
      },
    },
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