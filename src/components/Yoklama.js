import React from "react";
import { Typography, Container, Paper, Box } from "@mui/material";

const Yoklama = () => {
  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        mt: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 }, 
        pb: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
        px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
        maxWidth: { xs: "100%", sm: "100%", md: "1200px", lg: "1400px", xl: "1800px" },
        mx: "auto"
      }}
    >
      <Typography
        variant="h4"
        sx={{ 
          fontWeight: "bold", 
          color: "#1a237e", 
          mb: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem", lg: "2.25rem", xl: "2.5rem" }
        }}
      >
        📊 Yoklama Sayfası
      </Typography>

      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
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

export default Yoklama;
