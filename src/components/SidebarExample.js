import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

/**
 * Example component showing how to integrate the Sidebar with existing components
 * This can be used as a reference for integration into MainPortal or other components
 */
const SidebarExample = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Content Area */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflow: 'auto',
            backgroundColor: 'background.default'
          }}
        >
          {/* Your existing content goes here */}
          <h2>Main Content Area</h2>
          <p>This is where your existing components and content would be displayed.</p>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarExample;