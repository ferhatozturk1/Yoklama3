// Tests for responsive typography utilities
import { 
  fluidTypography, 
  responsiveTypographyMixins, 
  breakpointTypography,
  createResponsiveTypography,
  accessibleTypography,
  performanceTypography 
} from '../theme/responsiveTypography';

describe('Responsive Typography Utilities', () => {
  describe('fluidTypography', () => {
    test('should provide clamp-based font sizes', () => {
      expect(fluidTypography.welcomeHeading.fontSize).toContain('clamp');
      expect(fluidTypography.sectionHeading.fontSize).toContain('clamp');
      expect(fluidTypography.timeDisplay.fontSize).toContain('clamp');
    });

    test('should include fallbacks for browsers without clamp support', () => {
      const welcomeHeading = fluidTypography.welcomeHeading;
      expect(welcomeHeading['@supports not (font-size: clamp(1rem, 1vw, 1rem))']).toBeDefined();
      expect(welcomeHeading['@supports not (font-size: clamp(1rem, 1vw, 1rem))'].fontSize).toBeDefined();
    });

    test('should have appropriate size ranges', () => {
      // Welcome heading should be between 1.75rem and 2.25rem
      expect(fluidTypography.welcomeHeading.fontSize).toMatch(/clamp\(1\.75rem.*2\.25rem\)/);
      
      // Section heading should be between 1.25rem and 1.75rem
      expect(fluidTypography.sectionHeading.fontSize).toMatch(/clamp\(1\.25rem.*1\.75rem\)/);
    });
  });

  describe('responsiveTypographyMixins', () => {
    test('should provide professional heading styles', () => {
      const h1Style = responsiveTypographyMixins.professionalHeading('h1');
      const h2Style = responsiveTypographyMixins.professionalHeading('h2');
      
      expect(h1Style.fontWeight).toBe(700);
      expect(h2Style.fontWeight).toBe(600);
      expect(h1Style.lineHeight).toBe(1.2);
      expect(h2Style.lineHeight).toBe(1.3);
    });

    test('should provide responsive body text styles', () => {
      const body1Style = responsiveTypographyMixins.responsiveBody('body1');
      const body2Style = responsiveTypographyMixins.responsiveBody('body2');
      
      expect(body1Style.lineHeight).toBe(1.6);
      expect(body2Style.lineHeight).toBe(1.5);
      expect(body1Style.fontWeight).toBe(400);
    });

    test('should provide monospace time display styles', () => {
      const timeStyle = responsiveTypographyMixins.responsiveTimeDisplay();
      
      expect(timeStyle.fontFamily).toContain('monospace');
      expect(timeStyle.fontWeight).toBe(500);
      expect(timeStyle.letterSpacing).toBe('0.02em');
    });

    test('should provide caption styles with reduced opacity', () => {
      const captionStyle = responsiveTypographyMixins.responsiveCaption();
      
      expect(captionStyle.opacity).toBe(0.7);
      expect(captionStyle.letterSpacing).toBe('0.02em');
    });
  });

  describe('breakpointTypography', () => {
    test('should provide different sizes for different breakpoints', () => {
      expect(breakpointTypography.mobile.hero).toBe('2rem');
      expect(breakpointTypography.tablet.hero).toBe('2.5rem');
      expect(breakpointTypography.desktop.hero).toBe('3rem');
    });

    test('should have consistent scaling across breakpoints', () => {
      const mobileHero = parseFloat(breakpointTypography.mobile.hero);
      const tabletHero = parseFloat(breakpointTypography.tablet.hero);
      const desktopHero = parseFloat(breakpointTypography.desktop.hero);
      
      expect(tabletHero).toBeGreaterThan(mobileHero);
      expect(desktopHero).toBeGreaterThan(tabletHero);
    });
  });

  describe('createResponsiveTypography', () => {
    test('should create clamp-based responsive typography', () => {
      const result = createResponsiveTypography('1rem', '2rem', '20rem', '80rem');
      
      expect(result.fontSize).toContain('clamp');
      expect(result.fontSize).toContain('1rem');
      expect(result.fontSize).toContain('2rem');
    });

    test('should include fallback styles', () => {
      const result = createResponsiveTypography('1rem', '2rem');
      
      expect(result['@supports not (font-size: clamp(1rem, 1vw, 1rem))']).toBeDefined();
      expect(result['@supports not (font-size: clamp(1rem, 1vw, 1rem))'].fontSize).toBeDefined();
    });

    test('should calculate correct slope for fluid typography', () => {
      const result = createResponsiveTypography('1rem', '2rem', '20rem', '80rem');
      
      // The slope should be calculated correctly
      // (2 - 1) / (80 - 20) = 1/60 = 0.0167
      expect(result.fontSize).toMatch(/0\.0167vw/);
    });
  });

  describe('accessibleTypography', () => {
    test('should provide minimum font sizes', () => {
      expect(accessibleTypography.minimumSizes.mobile).toBe('0.875rem'); // 14px
      expect(accessibleTypography.minimumSizes.desktop).toBe('1rem'); // 16px
    });

    test('should provide high contrast colors', () => {
      expect(accessibleTypography.highContrast.primary).toBe('rgba(0, 0, 0, 0.87)');
      expect(accessibleTypography.highContrast.secondary).toBe('rgba(0, 0, 0, 0.6)');
    });

    test('should provide appropriate line heights', () => {
      expect(accessibleTypography.lineHeights.tight).toBe(1.2);
      expect(accessibleTypography.lineHeights.relaxed).toBe(1.6);
    });
  });

  describe('performanceTypography', () => {
    test('should include font display swap', () => {
      expect(performanceTypography.fontDisplay).toBe('swap');
    });

    test('should include font optimization properties', () => {
      const optimization = performanceTypography.fontOptimization;
      
      expect(optimization.fontFeatureSettings).toBe('"kern" 1');
      expect(optimization.textRendering).toBe('optimizeLegibility');
      expect(optimization.WebkitFontSmoothing).toBe('antialiased');
      expect(optimization.MozOsxFontSmoothing).toBe('grayscale');
    });

    test('should provide preload hints', () => {
      expect(performanceTypography.preloadHints).toContain('system-ui');
      expect(performanceTypography.preloadHints).toContain('-apple-system');
    });
  });
});

describe('Typography Integration', () => {
  test('should maintain consistent font size relationships', () => {
    // Hero should be larger than welcome heading
    const heroMin = parseFloat(fluidTypography.hero.fontSize.match(/clamp\(([\d.]+)rem/)[1]);
    const welcomeMin = parseFloat(fluidTypography.welcomeHeading.fontSize.match(/clamp\(([\d.]+)rem/)[1]);
    
    expect(heroMin).toBeGreaterThan(welcomeMin);
  });

  test('should provide appropriate viewport-based scaling', () => {
    // All fluid typography should use viewport units
    Object.values(fluidTypography).forEach(style => {
      if (style.fontSize && typeof style.fontSize === 'string') {
        expect(style.fontSize).toMatch(/\d+vw/);
      }
    });
  });

  test('should maintain accessibility standards', () => {
    // Check that minimum sizes meet accessibility requirements
    const captionMin = parseFloat(fluidTypography.caption.fontSize.match(/clamp\(([\d.]+)rem/)[1]);
    const bodyMin = parseFloat(fluidTypography.bodyFluid.fontSize.match(/clamp\(([\d.]+)rem/)[1]);
    
    // Caption should be at least 12px (0.75rem)
    expect(captionMin).toBeGreaterThanOrEqual(0.75);
    
    // Body text should be at least 14px (0.875rem)
    expect(bodyMin).toBeGreaterThanOrEqual(0.875);
  });
});