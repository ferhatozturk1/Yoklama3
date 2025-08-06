import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, accessToken, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Yükleme tamamlandıysa ve kullanıcı authenticated değilse
    if (!isLoading && !isAuthenticated) {
      console.log('🔒 ProtectedRoute - Yetkisiz erişim, giriş sayfasına yönlendiriliyor');
      console.log('Current path:', location.pathname);
      console.log('User:', user);
      console.log('Access Token:', !!accessToken);
      
      // Mevcut sayfayı kaydet ki giriş sonrası geri dönebilsin
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/giris-yap', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname, user, accessToken]);

  // Yükleme durumu
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Oturum kontrol ediliyor...
        </Typography>
      </Box>
    );
  }

  // Authenticated değilse null döndür (navigate zaten çalışacak)
  if (!isAuthenticated) {
    return null;
  }

  // Token kontrolü
  if (!accessToken) {
    console.log('⚠️ ProtectedRoute - Access token bulunamadı');
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: 'error.main' }}>
          Erişim token'ı bulunamadı. Lütfen tekrar giriş yapın.
        </Typography>
      </Box>
    );
  }

  // Her şey yolunda, children'ı render et
  console.log('✅ ProtectedRoute - Erişim onaylandı');
  return children;
};

export default ProtectedRoute;
