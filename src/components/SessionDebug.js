import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { getCurrentUser } from '../api/lecturer';

const SessionDebug = () => {
  const [sessionData, setSessionData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const refreshData = () => {
    // Get all session storage data
    const data = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      try {
        const value = sessionStorage.getItem(key);
        data[key] = JSON.parse(value);
      } catch {
        data[key] = sessionStorage.getItem(key);
      }
    }
    setSessionData(data);

    // Get current user
    const user = getCurrentUser();
    setCurrentUser(user);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const createMockSession = () => {
    const mockUser = {
      id: "mock-user-id",
      first_name: "MEHMET NURİ",
      last_name: "ÖĞÜT",
      title: "Öğr. Gör.",
      email: "mehmetnuri.ogut@cbu.edu.tr",
      phone: "+90 236 201 1163",
      profile_photo: null,
      department: {
        id: "mock-dept-id",
        name: "ENDÜSTRİYEL KALIPÇILIK",
        faculty: {
          name: "MAKİNE VE METAL TEKNOLOJİLERİ",
          university: {
            name: "MANİSA TEKNİK BİLİMLER MESLEK YÜKSEKOKULU"
          }
        }
      },
      department_id: "mock-dept-id",
      created_at: new Date().toISOString()
    };

    sessionStorage.setItem("user", JSON.stringify(mockUser));
    sessionStorage.setItem("token", "mock-token-123");
    refreshData();
  };

  const clearSession = () => {
    sessionStorage.clear();
    refreshData();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#1a237e' }}>
        🔍 Session Debug
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={refreshData}>
          Yenile
        </Button>
        <Button variant="outlined" onClick={createMockSession}>
          Mock Session Oluştur
        </Button>
        <Button variant="outlined" color="error" onClick={clearSession}>
          Session Temizle
        </Button>
      </Box>

      {/* Current User */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current User (getCurrentUser())
        </Typography>
        {currentUser ? (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Kullanıcı bulundu!
            </Alert>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          </Box>
        ) : (
          <Alert severity="error">
            Kullanıcı bulunamadı
          </Alert>
        )}
      </Paper>

      {/* Session Storage */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Session Storage Data
        </Typography>
        {Object.keys(sessionData).length > 0 ? (
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        ) : (
          <Alert severity="warning">
            Session storage boş
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default SessionDebug;