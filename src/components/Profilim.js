import React from 'react';
import {
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button
} from '@mui/material';
import { Edit } from '@mui/icons-material';

const Profilim = ({ userProfile }) => {
  if (!userProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
          👤 Profilim
        </Typography>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Profil bilgileri yükleniyor...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4, position: 'relative' }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
        👤 Profilim
      </Typography>

      {/* Main two-column layout */}
      <Grid container spacing={4}>
        {/* Left Profile Section (narrower) */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Avatar with user initial */}
            <Avatar
              src={userProfile.profilePhoto}
              alt={userProfile.name}
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 2,
                fontSize: '3rem',
                bgcolor: '#1a237e'
              }}
            >
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
            
            {/* User title and name */}
            <Box sx={{ mb: 1 }}>
              <Typography 
                variant="caption" 
                component="span" 
                sx={{ 
                  mr: 0.5, 
                  fontWeight: 'medium',
                  color: 'text.secondary'
                }}
              >
                {userProfile.title || 'Dr.'}
              </Typography>
              <Typography 
                variant="body1" 
                component="span" 
                sx={{ fontWeight: 'bold' }}
              >
                {userProfile.name || 'xxx'}
              </Typography>
            </Box>
            
            {/* University affiliation */}
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 3 }}
            >
              {userProfile.school || 'Manisa Celal Bayar University'}
            </Typography>
            
            {/* Editable fields section */}
            <Box sx={{ mt: 2, width: '100%' }}>
              {/* Profile Photo field */}
              <TextField
                label="Profile Photo"
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Email Information field */}
              <TextField
                label="Email Information"
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Phone Number field */}
              <TextField
                label="Phone Number"
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Compulsory Education Info field */}
              <TextField
                label="Compulsory Education Info"
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Other Details field */}
              <TextField
                label="Other Details"
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Profile Section (wider) */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* "Only visible on this screen" note */}
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 16, 
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontStyle: 'italic'
              }}
            >
              Only visible on this screen
            </Typography>
            
            {/* Personal Information Fields */}
            <Box sx={{ mt: 3 }}>
              {/* First Name field */}
              <TextField
                label="First Name"
                value={userProfile.firstName || userProfile.name?.split(' ')[0] || ''}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Last Name field */}
              <TextField
                label="Last Name"
                value={userProfile.lastName || (userProfile.name?.split(' ').length > 1 ? 
                  userProfile.name.split(' ').slice(1).join(' ') : '') || ''}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Email field */}
              <TextField
                label="Email"
                value={userProfile.email || ''}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Phone Number field */}
              <TextField
                label="Phone Number"
                value={userProfile.phone || ''}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* University field */}
              <TextField
                label="University"
                value={userProfile.school || 'Manisa Celal Bayar University'}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Faculty field */}
              <TextField
                label="Faculty"
                value={userProfile.faculty || ''}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Department field */}
              <TextField
                label="Department"
                value={userProfile.department || ''}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: { borderRadius: 1 }
                }}
                sx={{ mb: 2 }}
              />
            </Box>
            
            {/* Edit Profile Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
              <Button 
                variant="contained" 
                startIcon={<Edit />}
                sx={{ 
                  bgcolor: '#1a237e',
                  '&:hover': {
                    bgcolor: '#0d1642'
                  }
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profilim;