import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  getLecturerProfile,
  updateLecturerProfile,
  getCurrentUser,
  transformApiProfileToComponent,
  transformComponentProfileToApi
} from '../api/lecturer';

const ProfileTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Get current user from session
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleFetchProfile = async () => {
    if (!currentUser?.id) {
      setError('Kullanıcı oturumu bulunamadı');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiProfile = await getLecturerProfile(currentUser.id);
      const transformedProfile = transformApiProfileToComponent(apiProfile);
      setProfileData(transformedProfile);
      setSuccess('Profil başarıyla yüklendi!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser?.id || !profileData) {
      setError('Profil verisi bulunamadı');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Example update - change phone number
      const updatedData = {
        ...profileData,
        phone: '+90 555 123 4567' // Example new phone
      };

      const apiData = transformComponentProfileToApi(updatedData);
      const updatedApiProfile = await updateLecturerProfile(currentUser.id, apiData);
      const transformedUpdated = transformApiProfileToComponent(updatedApiProfile);
      
      setProfileData(transformedUpdated);
      setSuccess('Profil başarıyla güncellendi!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#1a237e' }}>
        🧪 Profil API Test
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Current User Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Oturum Bilgileri
              </Typography>
              {currentUser ? (
                <Box>
                  <Typography variant="body2">
                    <strong>ID:</strong> {currentUser.id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {currentUser.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Ad:</strong> {currentUser.first_name} {currentUser.last_name}
                  </Typography>
                </Box>
              ) : (
                <Typography color="error">
                  Oturum bilgisi bulunamadı
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* API Test Buttons */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                API Test İşlemleri
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleFetchProfile}
                  disabled={loading || !currentUser?.id}
                  sx={{ bgcolor: '#1a237e' }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Profil Getir (GET)'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleUpdateProfile}
                  disabled={loading || !profileData}
                  sx={{ borderColor: '#1a237e', color: '#1a237e' }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Profil Güncelle (PUT)'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Data Display */}
        {profileData && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                📋 Profil Verileri
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Ünvan:</strong> {profileData.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Ad Soyad:</strong> {profileData.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {profileData.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Telefon:</strong> {profileData.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Üniversite:</strong> {profileData.university}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Fakülte:</strong> {profileData.faculty}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Bölüm:</strong> {profileData.department}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* API Endpoints Info */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📡 API Endpoints
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>GET:</strong> /lecturer_data/lecturers/{'{lecturer_id}'}/
        </Typography>
        <Typography variant="body2">
          <strong>PUT:</strong> /lecturer_data/lecturers/{'{lecturer_id}'}/
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfileTest;