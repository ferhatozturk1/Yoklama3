// Custom hook for responsive typography utilities
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { 
  fluidTypography, 
  responsiveTypographyMixins, 
  breakpointTypography,
  createResponsiveTypography 
} from '../theme/responsiveTypography';

/**
 * Custom hook that provides responsive typography utilities
 * @returns {Object} Typography utilities and helpers
 */
export const useResponsiveTypography = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Get current breakpoint typography
  const getCurrentBreakpointTypography = () => {
    if (isMobile) return breakpointTypography.mobile;
    if (isTablet) return breakpointTypography.tablet;
    return breakpointTypography.desktop;
  };

  // Helper function to get responsive font size based on current breakpoint
  const getResponsiveFontSize = (type) => {
    const currentBreakpoint = getCurrentBreakpointTypography();
    return currentBreakpoint[type] || currentBreakpoint.body;
  };

  // Helper function to create custom responsive typography
  const createCustomResponsiveTypography = (minSize, maxSize, minViewport, maxViewport) => {
    return createResponsiveTypography(minSize, maxSize, minViewport, maxViewport);
  };

  // Get fluid typography styles
  const getFluidTypography = (variant) => {
    return fluidTypography[variant] || fluidTypography.bodyFluid;
  };

  // Get responsive typography mixin
  const getResponsiveMixin = (type, level) => {
    switch (type) {
      case 'heading':
        return responsiveTypographyMixins.professionalHeading(level);
      case 'body':
        return responsiveTypographyMixins.responsiveBody(level);
      case 'time':
        return responsiveTypographyMixins.responsiveTimeDisplay();
      case 'caption':
        return responsiveTypographyMixins.responsiveCaption();
      default:
        return responsiveTypographyMixins.responsiveBody();
    }
  };

  // Check if browser supports clamp()
  const supportsClamp = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const testElement = document.createElement('div');
      testElement.style.fontSize = 'clamp(1rem, 2vw, 2rem)';
      return testElement.style.fontSize.includes('clamp');
    } catch (error) {
      return false;
    }
  };

  // Get fallback typography for older browsers
  const getFallbackTypography = (variant) => {
    const fluidStyle = fluidTypography[variant];
    if (!fluidStyle || supportsClamp()) {
      return fluidStyle;
    }
    
    // Return fallback styles for browsers that don't support clamp()
    return fluidStyle['@supports not (font-size: clamp(1rem, 1vw, 1rem))'];
  };

  return {
    // Current breakpoint information
    isMobile,
    isTablet,
    isDesktop,
    
    // Typography utilities
    fluidTypography,
    responsiveTypographyMixins,
    breakpointTypography,
    
    // Helper functions
    getCurrentBreakpointTypography,
    getResponsiveFontSize,
    createCustomResponsiveTypography,
    getFluidTypography,
    getResponsiveMixin,
    getFallbackTypography,
    supportsClamp,
    
    // Convenience methods for common patterns
    welcomeHeading: () => getFluidTypography('welcomeHeading'),
    sectionHeading: () => getFluidTypography('sectionHeading'),
    cardTitle: () => getFluidTypography('cardTitle'),
    timeDisplay: () => getFluidTypography('timeDisplay'),
    bodyFluid: () => getFluidTypography('bodyFluid'),
    caption: () => getFluidTypography('caption'),
    
    // Professional heading mixins
    h1: () => getResponsiveMixin('heading', 'h1'),
    h2: () => getResponsiveMixin('heading', 'h2'),
    h3: () => getResponsiveMixin('heading', 'h3'),
    h4: () => getResponsiveMixin('heading', 'h4'),
    
    // Body text mixins
    body1: () => getResponsiveMixin('body', 'body1'),
    body2: () => getResponsiveMixin('body', 'body2'),
    
    // Special mixins
    time: () => getResponsiveMixin('time'),
    captionText: () => getResponsiveMixin('caption')
  };
};

/**
 * Higher-order component that provides responsive typography context
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component with typography utilities
 */
export const withResponsiveTypography = (Component) => {
  return function WrappedComponent(props) {
    const typography = useResponsiveTypography();
    return <Component {...props} typography={typography} />;
  };
};

export default useResponsiveTypography;