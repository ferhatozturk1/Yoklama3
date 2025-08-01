import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

const Profilim = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [showApiError, setShowApiError] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email_update: "",
    phone: "",
    department_id: ""
  });
  
  const { user, updateProfile, loading } = useAuth();
  const { departments, fetchDepartments, systemIds } = useData();

  // Departmanları yükle - sadece bir kez
  useEffect(() => {
    if (departments.length === 0 && systemIds.faculty_id) {
      fetchDepartments(systemIds.faculty_id);
    }
  }, []); // Boş dependency array - sadece mount'ta çalışsın

  // Form'u kullanıcı bilgileri ile doldur
  useEffect(() => {
    if (user) {
      setEditForm({
        title: user.title || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email_update: user.email || "",
        phone: user.phone || "",
        department_id: user.department_id || ""
      });
    }
  }, [user]);

  // Save profile function
  const saveProfile = async () => {
    setApiError("");

    try {
      // Profil güncelleme verilerini hazırla
      const profileData = {
        title: editForm.title,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email_update: editForm.email_update,
        phone: editForm.phone,
        department_id: editForm.department_id
      };

      // API üzerinden profil güncelle
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setIsEditing(false);
        setSaveMessage("Profil başarıyla güncellendi!");
        
        // Başarı mesajını 3 saniye sonra temizle
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setApiError(error.message || "Profil güncellenirken bir hata oluştu");
      setShowApiError(true);
    }
  };

  const titles = [
    "Prof. Dr.",
    "Doç. Dr.", 
    "Dr. Öğr. Üyesi",
    "Dr.",
    "Öğr. Gör.",
    "Arş. Gör.",
    "Okutman"
  ];

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
            color: "white",
            p: 4,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
              opacity: 0.3,
            },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={user?.profile_photo}
                alt={user?.name}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0) || user?.first_name?.charAt(0) || "U"}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                }}
              >
                {user?.name || `${user?.first_name} ${user?.last_name}`}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                }}
              >
                {user?.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.8,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                }}
              >
                {user?.email}
              </Typography>
            </Grid>
            <Grid item>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  Profili Düzenle
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveProfile}
                    disabled={loading}
                    sx={{
                      background: "rgba(34, 197, 94, 0.9)",
                      "&:hover": {
                        background: "rgba(34, 197, 94, 1)",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Kaydet"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      color: "white",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.8)",
                        background: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    İptal
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: 4 }}>
          {/* Success Message */}
          {saveMessage && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
              }}
            >
              {saveMessage}
            </Alert>
          )}

          {/* Error Message */}
          <Snackbar
            open={showApiError}
            autoHideDuration={6000}
            onClose={() => setShowApiError(false)}
          >
            <Alert
              onClose={() => setShowApiError(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {apiError}
            </Alert>
          </Snackbar>

          <Grid container spacing={3}>
            {/* Unvan */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unvan"
                value={isEditing ? editForm.title : user?.title || ""}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                fullWidth
                variant="outlined"
                size="medium"
                select={isEditing}
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  },
                }}
              >
                {isEditing && titles.map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Ad */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ad"
                value={isEditing ? editForm.first_name : user?.first_name || ""}
                onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                fullWidth
                variant="outlined"
                size="medium"
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  },
                }}
              />
            </Grid>

            {/* Soyad */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Soyad"
                value={isEditing ? editForm.last_name : user?.last_name || ""}
                onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                fullWidth
                variant="outlined"
                size="medium"
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  },
                }}
              />
            </Grid>

            {/* E-posta */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="E-posta"
                value={isEditing ? editForm.email_update : user?.email || ""}
                onChange={(e) => setEditForm({...editForm, email_update: e.target.value})}
                fullWidth
                variant="outlined"
                size="medium"
                type="email"
                helperText={isEditing ? "E-posta değiştirirken dikkatli olun. Bu e-posta zaten kullanımda olabilir." : ""}
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  },
                }}
              />
            </Grid>

            {/* Telefon */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cep Telefonu"
                value={isEditing ? editForm.phone : user?.phone || ""}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                fullWidth
                variant="outlined"
                size="medium"
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  },
                }}
              />
            </Grid>

            {/* Departman */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Departman"
                value={isEditing ? 
                  departments.find(d => d.id === editForm.department_id)?.name || "" : 
                  departments.find(d => d.id === user?.department_id)?.name || ""
                }
                onChange={(e) => {
                  const selectedDept = departments.find(d => d.name === e.target.value);
                  if (selectedDept) {
                    setEditForm({...editForm, department_id: selectedDept.id});
                  }
                }}
                fullWidth
                variant="outlined"
                size="medium"
                select={isEditing}
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  },
                }}
              >
                {isEditing && departments.map((department) => (
                  <MenuItem key={department.id} value={department.name}>
                    {department.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Kurum */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kurum"
                value="Orta Doğu Teknik Üniversitesi"
                fullWidth
                variant="outlined"
                size="medium"
                InputProps={{
                  readOnly: true,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>

            {/* Fakülte */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fakülte"
                value="Mühendislik Fakültesi"
                fullWidth
                variant="outlined"
                size="medium"
                InputProps={{
                  readOnly: true,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profilim;