import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
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
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";

// Lazy load the ProfilePhotoUpload component with prefetching
const ProfilePhotoUpload = lazy(() => {
  // Prefetch the component when idle
  const prefetchPromise = import("./ProfilePhotoUpload");
  // Return the promise to React.lazy
  return prefetchPromise;
});

import { useLocalization } from "../utils/localization";
import { useFormValidation } from "../utils/validation";
import { debounce } from "../utils/debounce";
import { updateLecturerProfile } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

const Profilim = ({
  userProfile: initialUserProfile,
  onProfileUpdate,
}) => {
  const { t } = useLocalization();
  const { user, accessToken, loadUserProfile, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [userProfile, setUserProfile] = useState(initialUserProfile || null);
  const [apiError, setApiError] = useState("");
  const [showApiError, setShowApiError] = useState(false);

  console.log("Profilim component initialized with user:", user);

  // Profil bilgilerini AuthContext'ten yükle
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (initialUserProfile) {
        setUserProfile(initialUserProfile);
        setIsLoading(false);
        return;
      }

      if (!user || !accessToken) {
        console.warn("⚠️ User veya accessToken bulunamadı");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setApiError("");
        
        console.log("📋 AuthContext üzerinden profil bilgileri yükleniyor...");
        const profileData = await loadUserProfile();
        
        if (profileData) {
          setUserProfile(profileData);
          console.log("✅ Profil bilgileri başarıyla yüklendi:", profileData);
        } else {
          console.warn("⚠️ Profil bilgileri alınamadı");
          setApiError("Profil bilgileri yüklenemedi");
          setShowApiError(true);
        }
      } catch (error) {
        console.error("❌ Profil yükleme hatası:", error);
        setApiError(error.message || "Profil bilgileri yüklenemedi");
        setShowApiError(true);
        
        // Hata durumunda boş profil göster
        setUserProfile({
          name: "",
          firstName: "",
          lastName: "",
          title: "",
          email: "",
          phone: "",
          profilePhoto: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, accessToken, initialUserProfile, loadUserProfile]);

  // Initialize form with user profile data - memoized to prevent recalculation
  const initialFormData = useMemo(
    () =>
      userProfile
        ? {
            title: userProfile.title || "",
            firstName: userProfile.firstName || "",
            lastName: userProfile.lastName || "",
            email: userProfile.email || "",
            phone: userProfile.phone || "",
            university: userProfile.school || userProfile.university || "",
            faculty: userProfile.faculty || "",
            department: userProfile.department || "",
            webUrl: userProfile.webUrl || "",
            otherDetails: userProfile.otherDetails || "",
            profilePhoto: userProfile.profilePhoto || null,
          }
        : {},
    [userProfile]
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation(initialFormData);

  if (!userProfile || isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1a237e", mb: 4 }}
        >
          👤 {t("myProfile")}
        </Typography>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Profil yükleniyor...
          </Typography>
        </Paper>
      </Container>
    );
  }

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setSaveMessage("");
  }, []);

  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
    resetForm(initialFormData);
    setUploadedPhoto(null);
    setPhotoPreview(null);
    setSaveMessage("");
  }, [initialFormData, resetForm]);

  // Define the save function
  const saveProfile = async () => {
    if (!validateAll()) {
      return;
    }

    setIsSaving(true);
    setApiError("");

    try {
      if (!user || !accessToken) {
        throw new Error("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.");
      }

      // API'ye gönderilecek veriyi hazırla (yeni şemaya göre)
      const profileUpdateData = {
        title: values.title || userProfile.title || "",
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        department_id: userProfile.department_id || "", // Departman ID'si
        phone: values.phone || null,
      };

      console.log("🔄 Profil güncelleme verisi (yeni şema):", profileUpdateData);

      // Handle photo upload if there's a new photo
      if (uploadedPhoto) {
        try {
          console.log("📸 Fotoğraf yükleme işlemi başlatılıyor...");
          // TODO: Fotoğraf upload API'si implement edilecek
          // const photoUrl = await uploadProfilePhoto(uploadedPhoto);
          // profileUpdateData.profile_photo = photoUrl;
        } catch (photoError) {
          console.error("Fotoğraf yükleme hatası:", photoError);
          setApiError(photoError.message || "Fotoğraf yüklenemedi");
          setShowApiError(true);
        }
      }

      // Gerçek API kullanarak profili güncelle
      const savedProfile = await updateLecturerProfile(
        user.id, 
        profileUpdateData, 
        accessToken
      );
      
      // Local state'i güncelle (yeni şemaya göre)
      const updatedUserProfile = {
        ...userProfile,
        id: savedProfile.id,
        name: `${savedProfile.first_name || values.firstName} ${savedProfile.last_name || values.lastName}`,
        firstName: savedProfile.first_name || values.firstName,
        lastName: savedProfile.last_name || values.lastName,
        title: savedProfile.title || values.title || userProfile.title,
        email: savedProfile.email || values.email,
        phone: savedProfile.phone || values.phone,
        department_id: savedProfile.department_id || userProfile.department_id,
        profilePhoto: savedProfile.profile_photo || null,
        created_at: savedProfile.created_at || userProfile.created_at,
      };
      
      setUserProfile(updatedUserProfile);
      
      // AuthContext'teki kullanıcı bilgilerini de güncelle
      const updatedUser = {
        ...user,
        first_name: savedProfile.first_name || values.firstName,
        last_name: savedProfile.last_name || values.lastName,
        title: savedProfile.title || values.title || user.title,
        email: savedProfile.email || values.email,
        phone: savedProfile.phone || values.phone,
      };
      setUser(updatedUser);
      
      console.log("✅ Profil başarıyla güncellendi:", updatedUserProfile);

      // Call the onProfileUpdate callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(updatedUserProfile);
      }

      setIsEditing(false);
      setSaveMessage("Profil başarıyla kaydedildi!");

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("❌ Profil kaydetme hatası:", error);
      setApiError(error.message || t("serverError"));
      setShowApiError(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Create a memoized saveProfile function to prevent unnecessary recreations
  const memoizedSaveProfile = useCallback(saveProfile, [
    values,
    uploadedPhoto,
    photoPreview,
    userProfile,
    user,
    accessToken,
    onProfileUpdate,
    t,
    validateAll,
    setUser,
  ]);

  // Create a debounced version of the save function to prevent multiple rapid saves
  const handleSaveClick = useCallback(
    debounce(() => {
      memoizedSaveProfile();
    }, 300),
    [memoizedSaveProfile]
  );

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handlePhotoChange = useCallback((file, preview) => {
    setUploadedPhoto(file);
    setPhotoPreview(preview);
  }, []);

  const handlePhotoRemove = useCallback(() => {
    setUploadedPhoto(null);
    setPhotoPreview(null);
  }, []);

  // Handle closing the API error snackbar
  const handleCloseApiError = useCallback(() => {
    setShowApiError(false);
  }, []);

  // Create a ref for the first focusable element when entering edit mode
  const firstFieldRef = React.useRef(null);

  // Create a ref for the edit button to return focus after canceling
  const editButtonRef = React.useRef(null);

  // Focus management for edit mode
  React.useEffect(() => {
    if (isEditing && firstFieldRef.current) {
      // Focus the first field when entering edit mode
      firstFieldRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 2, position: "relative" }}>
      {/* Modern Page Title */}
      <Typography
        variant="h4"
        sx={{ 
          fontWeight: 600, 
          color: "#1a237e", 
          mb: 3,
          fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
          letterSpacing: "-0.02em",
        }}
        tabIndex="0"
        role="heading"
        aria-level="1"
      >
        👤 Profilim
      </Typography>

      {/* Success Message */}
      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      {/* API Error Snackbar */}
      <Snackbar
        open={showApiError}
        autoHideDuration={6000}
        onClose={handleCloseApiError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseApiError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {apiError}
        </Alert>
      </Snackbar>

      {/* Loading Indicator */}
      {isSaving && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Kaydediliyor...</Typography>
        </Box>
      )}

      {/* Modern Card Layout */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          position: "relative",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
          border: "1px solid rgba(26, 35, 126, 0.08)",
          boxShadow: "0 4px 20px rgba(26, 35, 126, 0.08)",
        }}
      >
        {/* Profile Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2,
            mb: 2,
            mt: 1,
          }}
        >
          {/* Profile Photo */}
          <Box sx={{ textAlign: "center", flexShrink: 0 }}>
            {isEditing ? (
              <Suspense
                fallback={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 80,
                      width: 80,
                    }}
                  >
                    <CircularProgress size={30} />
                  </Box>
                }
              >
                <ProfilePhotoUpload
                  currentPhoto={photoPreview || userProfile.profilePhoto}
                  onPhotoChange={handlePhotoChange}
                  onPhotoRemove={handlePhotoRemove}
                  disabled={isSaving}
                />
              </Suspense>
            ) : (
              <Avatar
                src={photoPreview || userProfile.profilePhoto || null}
                alt={"Profil fotoğrafı: " + (userProfile.name || "Kullanıcı")}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2rem",
                  bgcolor: "#1a237e",
                }}
                role="img"
                aria-label={
                  "Profil fotoğrafı: " + (userProfile.name || "Kullanıcı")
                }
              >
                {userProfile.name
                  ? userProfile.name.charAt(0).toUpperCase()
                  : "?"}
              </Avatar>
            )}
          </Box>

          {/* Modern Profile Info */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", sm: "flex-start" },
              minHeight: 80,
              gap: 0.5,
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 600,
                color: "#1a237e",
                textAlign: { xs: "center", sm: "left" },
                fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {isEditing
                ? `${values.firstName || ""} ${values.lastName || ""}`
                : userProfile.name || "Kullanıcı"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                textAlign: { xs: "center", sm: "left" },
                fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              {userProfile.title || ""}
            </Typography>
          </Box>

          {/* Edit/Save/Cancel Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditClick}
                disabled={isSaving}
                sx={{
                  background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "0 2px 8px rgba(26, 35, 126, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0d1642 0%, #1a237e 100%)",
                    boxShadow: "0 4px 12px rgba(26, 35, 126, 0.3)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                ref={editButtonRef}
                aria-label="Profil Düzenle"
              >
                Düzenle
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  sx={{
                    background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                    fontWeight: 500,
                    textTransform: "none",
                    boxShadow: "0 2px 8px rgba(26, 35, 126, 0.2)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #0d1642 0%, #1a237e 100%)",
                      boxShadow: "0 4px 12px rgba(26, 35, 126, 0.3)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelClick}
                  disabled={isSaving}
                  sx={{
                    borderColor: "#cbd5e1",
                    color: "#64748b",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#94a3b8",
                      backgroundColor: "#f8fafc",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  İptal
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Modern Form Fields */}
        <Grid container spacing={2.5}>
          {/* Ünvan Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ünvan"
              value={values.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.title && !!errors.title}
              helperText={touched.title && errors.title}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
              inputRef={isEditing ? firstFieldRef : null}
            />
          </Grid>

          {/* Ad Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ad"
              value={values.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.firstName && !!errors.firstName}
              helperText={touched.firstName && errors.firstName}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

          {/* Soyad Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Soyad"
              value={values.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.lastName && !!errors.lastName}
              helperText={touched.lastName && errors.lastName}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

          {/* E-posta Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="E-posta"
              value={values.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
              inputProps={{
                type: "email",
              }}
            />
          </Grid>

          {/* Telefon Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cep Telefonu"
              value={values.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

        </Grid>
      </Paper>
    </Container>
  );
};

// Wrap component with React.memo to prevent unnecessary re-renders
export default React.memo(Profilim);
