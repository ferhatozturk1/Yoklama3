<<<<<<< HEAD
import React from 'react';
import {
  Typography,
  Container,
  Paper,
  Box
} from '@mui/material';

const Yoklama = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
        📊 Yoklama Sayfası
      </Typography>

      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Bu sayfada henüz içerik bulunmamaktadır.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Yakında yeni özellikler eklenecektir.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

=======
import React from 'react';
import {
  Typography,
  Container,
  Paper,
  Box
} from '@mui/material';

const Yoklama = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
        📊 Yoklama Sayfası
      </Typography>

      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Bu sayfada henüz içerik bulunmamaktadır.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Yakında yeni özellikler eklenecektir.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

>>>>>>> b458935077ae6d999bd4305048ef9f3ae0601500
export default Yoklama;