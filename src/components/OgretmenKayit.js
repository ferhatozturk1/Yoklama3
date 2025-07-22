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
  Grid,
  InputAdornment,
  IconButton,
  MenuItem
} from '@mui/material';
import { 
  School, 
  Person, 
  Email,
  Lock,
  Subject,
  ArrowBack,
  PersonAdd,
  Visibility,
  VisibilityOff,
  SupervisorAccount
} from '@mui/icons-material';

const OgretmenKayit = () => {
  const [form, setForm] = useState({ 
    ad: '', 
    soyad: '', 
    email: '', 
    sifre: '', 
    sifreTekrar: '',
    brans: '',
    sicilNo: '',
    telefon: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const branslar = [
    'Matematik',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Türkçe',
    'Tarih',
    'Coğrafya',
    'Felsefe',
    'İngilizce',
    'Almanca',
    'Fransızca',
    'Beden Eğitimi',
    'Müzik',
    'Resim',
    'Bilgisayar',
    'Diğer'
  ];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasyon
    if (!form.ad || !form.soyad || !form.email || !form.sifre || !form.sifreTekrar || !form.brans || !form.sicilNo) {
      setError('Zorunlu alanları doldurun!');
      return;
    }

    // E-posta edu.tr doğrulaması
    if (!form.email.endsWith('.edu.tr')) {
      setError('Sadece .edu.tr uzantılı kurumsal e-posta adresleri kabul edilir!');
      return;
    }

    if (form.sifre !== form.sifreTekrar) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    if (form.sifre.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır!');
      return;
    }

    // Demo: Kayıt başarılı
    setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
    setTimeout(() => {
      navigate('/giris');
    }, 2000);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1a237e 30%, #0d47a1 70%, #01579b 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/giris')}
            sx={{ color: 'white', fontWeight: 'bold' }}
          >
            Giriş Sayfasına Dön
          </Button>
        </Box>

        <Paper elevation={10} sx={{ 
          p: 4, 
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SupervisorAccount sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
              Akademik Personel Kayıt
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Akademik personel hesabınızı oluşturmak için bilgilerinizi girin
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ad"
                  name="ad"
                  fullWidth
                  value={form.ad}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Soyad"
                  name="soyad"
                  fullWidth
                  value={form.soyad}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sicil Numarası"
                  name="sicilNo"
                  fullWidth
                  value={form.sicilNo}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Branş"
                  name="brans"
                  select
                  fullWidth
                  value={form.brans}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Subject color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {branslar.map((brans) => (
                    <MenuItem key={brans} value={brans}>
                      {brans}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="E-posta Adresi"
                  name="email"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  required
                  helperText="Sadece .edu.tr uzantılı kurumsal e-posta adresleri kabul edilir"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefon (Opsiyonel)"
                  name="telefon"
                  fullWidth
                  placeholder="0555 123 45 67"
                  value={form.telefon}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Şifre"
                  name="sifre"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={form.sifre}
                  onChange={handleChange}
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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Şifre Tekrar"
                  name="sifreTekrar"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  fullWidth
                  value={form.sifreTekrar}
                  onChange={handleChange}
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
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                          edge="end"
                        >
                          {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {success}
              </Alert>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<PersonAdd />}
              sx={{ 
                mt: 4,
                py: 1.5, 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0d47a1 30%, #01579b 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Akademik Personel Olarak Kayıt Ol
            </Button>
          </form>

          {/* Alt bağlantılar */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Zaten hesabınız var mı?{' '}
              <Link 
                to="/giris" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none', 
                  fontWeight: 'bold' 
                }}
              >
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OgretmenKayit;
