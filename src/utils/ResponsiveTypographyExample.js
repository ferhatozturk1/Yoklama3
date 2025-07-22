// Example component demonstrating responsive typography utilities
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useResponsiveTypography } from './useResponsiveTypography';

/**
 * Example component showing how to use responsive typography utilities
 * This component demonstrates various responsive typography patterns
 */
const ResponsiveTypographyExample = () => {
  const typography = useResponsiveTypography();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1" gutterBottom>
        Responsive Typography Examples
      </Typography>

      <Grid container spacing={3}>
        {/* Fluid Typography Examples */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Fluid Typography
            </Typography>
            
            {/* Welcome Heading Example */}
            <Typography 
              sx={typography.welcomeHeading()}
              gutterBottom
            >
              Welcome Heading (Fluid)
            </Typography>
            
            {/* Section Heading Example */}
            <Typography 
              sx={typography.sectionHeading()}
              gutterBottom
            >
              Section Heading (Fluid)
            </Typography>
            
            {/* Time Display Example */}
            <Typography 
              sx={typography.timeDisplay()}
              gutterBottom
            >
              14:30:25 (Time Display)
            </Typography>
            
            {/* Body Text Example */}
            <Typography 
              sx={typography.bodyFluid()}
              gutterBottom
            >
              This is fluid body text that scales smoothly between different screen sizes using clamp() functions with fallbacks for older browsers.
            </Typography>
            
            {/* Caption Example */}
            <Typography 
              sx={typography.caption()}
            >
              Caption text with reduced opacity
            </Typography>
          </Paper>
        </Grid>

        {/* Professional Heading Mixins */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Professional Headings
            </Typography>
            
            <Typography sx={typography.h1()} gutterBottom>
              H1 Professional Heading
            </Typography>
            
            <Typography sx={typography.h2()} gutterBottom>
              H2 Professional Heading
            </Typography>
            
            <Typography sx={typography.h3()} gutterBottom>
              H3 Professional Heading
            </Typography>
            
            <Typography sx={typography.h4()} gutterBottom>
              H4 Professional Heading
            </Typography>
            
            <Typography sx={typography.body1()} gutterBottom>
              Professional body text with optimal line height and spacing for readability.
            </Typography>
            
            <Typography sx={typography.body2()}>
              Secondary body text with appropriate sizing and contrast.
            </Typography>
          </Paper>
        </Grid>

        {/* Breakpoint Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Current Breakpoint Information
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography 
                sx={{ 
                  p: 1, 
                  bgcolor: typography.isMobile ? 'primary.main' : 'grey.200',
                  color: typography.isMobile ? 'white' : 'text.primary',
                  borderRadius: 1
                }}
              >
                Mobile: {typography.isMobile ? 'Active' : 'Inactive'}
              </Typography>
              
              <Typography 
                sx={{ 
                  p: 1, 
                  bgcolor: typography.isTablet ? 'primary.main' : 'grey.200',
                  color: typography.isTablet ? 'white' : 'text.primary',
                  borderRadius: 1
                }}
              >
                Tablet: {typography.isTablet ? 'Active' : 'Inactive'}
              </Typography>
              
              <Typography 
                sx={{ 
                  p: 1, 
                  bgcolor: typography.isDesktop ? 'primary.main' : 'grey.200',
                  color: typography.isDesktop ? 'white' : 'text.primary',
                  borderRadius: 1
                }}
              >
                Desktop: {typography.isDesktop ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
            
            <Typography sx={{ mt: 2 }}>
              Clamp Support: {typography.supportsClamp() ? 'Supported' : 'Not Supported (Using Fallbacks)'}
            </Typography>
          </Paper>
        </Grid>

        {/* Custom Responsive Typography */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Custom Responsive Typography
            </Typography>
            
            <Typography 
              sx={typography.createCustomResponsiveTypography('1rem', '2rem', '20rem', '60rem')}
              gutterBottom
            >
              Custom fluid text: 1rem to 2rem between 20rem and 60rem viewport
            </Typography>
            
            <Typography 
              sx={typography.createCustomResponsiveTypography('0.875rem', '1.5rem', '25rem', '80rem')}
            >
              Another custom fluid text: 0.875rem to 1.5rem between 25rem and 80rem viewport
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResponsiveTypographyExample;