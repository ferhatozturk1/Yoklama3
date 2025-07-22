import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Container,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  School, 
  Login, 
  Visibility, 
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';

const GirisYap = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun!');
      return;
    }

    // Demo: Sadece akademik personel girişi
    if (email === 'ogretmen@example.com' && password === '1234') {
      navigate('/ogretmen-panel');
    } else {
      setError('Geçersiz e-posta veya şifre!');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Akademik Personel Yoklama Sistemi
          </Typography>
        </Box>

        <Paper elevation={10} sx={{ 
          p: 4, 
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <School sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
              Giriş Yap
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hesabınıza giriş yaparak devam edin
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="E-posta Adresi"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<Login />}
              sx={{ 
                py: 1.5, 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 70%, #01579b 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0d47a1 30%, #01579b 70%, #004c8c 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.4)'
                },
                transition: 'all 0.3s ease',
                mb: 3
              }}
            >
              Giriş Yap
            </Button>
          </form>

          {/* Demo Bilgileri */}
          <Box sx={{ 
            bgcolor: '#f3f5ff', 
            p: 2, 
            borderRadius: 2, 
            mb: 3,
            border: '1px solid #c5cae9'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#1a237e' }}>
              🎯 Demo Giriş Bilgileri:
            </Typography>
            <Typography variant="body2">
              <strong>Akademik Personel:</strong> ogretmen@example.com / 1234
            </Typography>
          </Box>

          {/* Alt bağlantılar */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Hesabınız yok mu?{' '}
              <Link 
                to="/ogretmen-kayit" 
                style={{ 
                  color: '#1a237e', 
                  textDecoration: 'none', 
                  fontWeight: 'bold' 
                }}
              >
                Akademik Personel Kayıt Ol
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default GirisYap;
