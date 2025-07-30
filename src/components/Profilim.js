import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import profilePhoto from "../assets/mno.jpg";
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
import ApiService from "../utils/ApiService";
import MockApiService from "../utils/MockApiService";
import { debounce } from "../utils/debounce";

const Profilim = ({
  userProfile: initialUserProfile,
  onProfileUpdate,
  userId = "user123",
}) => {
  const { t } = useLocalization();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialUserProfile);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [userProfile, setUserProfile] = useState(
    initialUserProfile || {
      name: "MEHMET NURİ ÖĞÜT",
      firstName: "MEHMET NURİ",
      lastName: "ÖĞÜT",
      title: "Öğr. Gör.",
      school: "MANİSA TEKNİK BİLİMLER MESLEK YÜKSEKOKULU",
      university: "MANİSA TEKNİK BİLİMLER MESLEK YÜKSEKOKULU",
      faculty: "MAKİNE VE METAL TEKNOLOJİLERİ",
      department: "ENDÜSTRİYEL KALIPÇILIK",
      email: "mehmetnuri.ogut@cbu.edu.tr",
      phone: "+90 236 201 1163",
      webUrl: "https://avesis.mcbu.edu.tr/mehmetnuri.ogut",
      profilePhoto: profilePhoto,
      otherDetails: "",
    }
  );
  const [apiError, setApiError] = useState("");
  const [showApiError, setShowApiError] = useState(false);

  // Determine which API service to use (real or mock)
  const apiService =
    process.env.REACT_APP_USE_MOCK_API === "true" ? MockApiService : ApiService;

  // Fetch user profile data on component mount
  useEffect(() => {
    // Skip API call if profile was provided as prop
    if (initialUserProfile) {
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setIsLoading(true);
      setApiError("");

      try {
        const profileData = await apiService.fetchUserProfile(userId);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setApiError(error.message || t("serverError"));
        setShowApiError(true);

        // Use mock data as fallback
        setUserProfile(
          MockApiService.mockUserData[userId] || ApiService.getMockUserProfile()
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [initialUserProfile, userId, t]);

  // Initialize form with user profile data - memoized to prevent recalculation
  const initialFormData = useMemo(
    () =>
      userProfile
        ? {
            firstName: userProfile.firstName || "MEHMET NURİ",
            lastName: userProfile.lastName || "ÖĞÜT",
            email: userProfile.email || "",
            phone: userProfile.phone || "",
            university:
              userProfile.school ||
              userProfile.university ||
              "MANİSA TEKNİK BİLİMLER MESLEK YÜKSEKOKULU",
            faculty: userProfile.faculty || "",
            department: userProfile.department || "",
            webUrl: userProfile.webUrl || "",
            otherDetails: userProfile.otherDetails || "",
            profilePhoto: userProfile.profilePhoto || profilePhoto,
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
      // Create updated profile object
      const updatedProfile = {
        ...userProfile,
        ...values,
        name: `${values.firstName} ${values.lastName}`,
        school: values.university,
        university: values.university,
      };

      // Handle photo upload if there's a new photo
      if (uploadedPhoto) {
        try {
          const photoUrl = await apiService.uploadProfilePhoto(uploadedPhoto);
          updatedProfile.profilePhoto = photoUrl;
        } catch (photoError) {
          console.error("Error uploading photo:", photoError);
          setApiError(photoError.message || t("uploadFailed"));
          setShowApiError(true);
          // Continue with profile update even if photo upload fails
        }
      } else if (photoPreview) {
        // Use the preview URL if it was set but no new upload
        updatedProfile.profilePhoto = photoPreview;
      }

      // Update profile via API
      const savedProfile = await apiService.updateUserProfile(updatedProfile);

      // Update local state with saved profile
      setUserProfile(savedProfile);

      // Call the onProfileUpdate callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(savedProfile);
      }

      setIsEditing(false);
      setSaveMessage("Profil başarıyla kaydedildi!");

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
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
    onProfileUpdate,
    t,
    validateAll,
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
                src={photoPreview || userProfile.profilePhoto || profilePhoto}
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
                  : "A"}
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
                ? `${values.firstName || "MEHMET NURİ"} ${
                    values.lastName || "ÖĞÜT"
                  }`
                : userProfile.name || "MEHMET NURİ ÖĞÜT"}
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
              {userProfile.title || "Öğr. Gör."}
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
                aria-label="Profili Düzenle"
              >
                Şifre Değiştir
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
          {/* Modern Personal Information Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ad"
              value={values.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              fullWidth
              variant="outlined"
              size="medium"
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
              inputRef={isEditing ? firstFieldRef : null}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Soyad"
              value={values.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              fullWidth
              variant="outlined"
              size="medium"
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="E-posta"
              value={values.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              fullWidth
              variant="outlined"
              size="medium"
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="Cep Telefonu"
              value={values.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              fullWidth
              variant="outlined"
              size="medium"
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

          <Grid item xs={12}>
            <TextField
              label="Kurum"
              value={values.university || ""}
              onChange={(e) => handleChange("university", e.target.value)}
              onBlur={() => handleBlur("university")}
              fullWidth
              variant="outlined"
              size="medium"
              error={touched.university && !!errors.university}
              helperText={touched.university && errors.university}
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fakülte/Yüksekokul"
              value={values.faculty || ""}
              onChange={(e) => handleChange("faculty", e.target.value)}
              onBlur={() => handleBlur("faculty")}
              fullWidth
              variant="outlined"
              size="medium"
              error={touched.faculty && !!errors.faculty}
              helperText={touched.faculty && errors.faculty}
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="Bölüm"
              value={values.department || ""}
              onChange={(e) => handleChange("department", e.target.value)}
              onBlur={() => handleBlur("department")}
              fullWidth
              variant="outlined"
              size="medium"
              error={touched.department && !!errors.department}
              helperText={touched.department && errors.department}
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

          <Grid item xs={12}>
            <TextField
              label="Web Profili"
              value={values.webUrl || ""}
              onChange={(e) => handleChange("webUrl", e.target.value)}
              onBlur={() => handleBlur("webUrl")}
              fullWidth
              variant="outlined"
              size="medium"
              error={touched.webUrl && !!errors.webUrl}
              helperText={touched.webUrl && errors.webUrl}
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
                type: "url",
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
