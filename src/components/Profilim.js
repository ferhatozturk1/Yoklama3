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
  const [userProfile, setUserProfile] = useState(initialUserProfile);
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
            firstName:
              userProfile.firstName || userProfile.name?.split(" ")[0] || "",
            lastName:
              userProfile.lastName ||
              (userProfile.name?.split(" ").length > 1
                ? userProfile.name.split(" ").slice(1).join(" ")
                : "") ||
              "",
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
            profilePhoto: userProfile.profilePhoto || "",
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
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4, position: "relative" }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#1a237e", mb: 4 }}
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

      {/* Main two-column layout - responsive for different screen sizes */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Left Profile Section (narrower) */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              textAlign: "center",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: 2,
            }}
          >
            {/* Profile Photo Section */}
            {isEditing ? (
              <Suspense
                fallback={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                    }}
                  >
                    <CircularProgress size={40} />
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
                src={photoPreview || userProfile.profilePhoto}
                alt={"Profil fotoğrafı: " + (userProfile.name || "Kullanıcı")}
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  fontSize: "3rem",
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

            {/* User title and name */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "#1a237e",
                  mb: 0.5,
                }}
              >
                {userProfile.title || "Öğretim Görevlisi"}{" "}
                {isEditing
                  ? `${values.firstName || ""} ${values.lastName || ""}`
                  : userProfile.name || "MEHMET NURİ ÖĞÜT"}
              </Typography>
            </Box>

            {/* University affiliation */}
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: "#1a237e",
                fontWeight: "medium",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              {isEditing
                ? values.university
                : userProfile.school ||
                  userProfile.university ||
                  "MANİSA TEKNİK BİLİMLER MESLEK YÜKSEKOKULU"}
            </Typography>

            {/* Faculty and Department */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {isEditing
                ? values.faculty
                : userProfile.faculty || "MAKİNE VE METAL TEKNOLOJİLERİ"}
              {(isEditing ? values.department : userProfile.department) && (
                <>
                  <br />
                  {isEditing
                    ? values.department
                    : userProfile.department || "ENDÜSTRİYEL KALIPÇILIK"}
                </>
              )}
            </Typography>

            {/* Left side form fields */}
            <Box sx={{ mt: 2, width: "100%" }}>
              {/* Contact Information Section */}
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2,
                  color: "#1a237e",
                  fontWeight: "bold",
                  borderBottom: "2px solid #1a237e",
                  pb: 0.5,
                }}
              >
                İletişim Bilgileri
              </Typography>

              {/* Email field */}
              <TextField
                label="E-posta"
                value={values.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />

              {/* Phone Number field */}
              <TextField
                label="Ofis Telefonu"
                value={values.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />

              {/* Web URL field */}
              <TextField
                label="Web Profili"
                value={values.webUrl || ""}
                onChange={(e) => handleChange("webUrl", e.target.value)}
                onBlur={() => handleBlur("webUrl")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.webUrl && !!errors.webUrl}
                helperText={touched.webUrl && errors.webUrl}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />

              {/* Other Details field */}
              <TextField
                label="Ek Bilgiler"
                value={values.otherDetails || ""}
                onChange={(e) => handleChange("otherDetails", e.target.value)}
                onBlur={() => handleBlur("otherDetails")}
                fullWidth
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Profile Section (wider) */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
            }}
          >
            {/* "Only visible on this screen" note */}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 10,
                right: 16,
                color: "text.secondary",
                fontSize: "0.7rem",
                fontStyle: "italic",
              }}
            >
              Sadece bu ekranda görünür
            </Typography>

            {/* Personal Information Fields */}
            <Box sx={{ mt: 3 }}>
              {/* Personal Information Section */}
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: "#1a237e",
                  fontWeight: "bold",
                  borderBottom: "2px solid #1a237e",
                  pb: 1,
                }}
              >
                Kişisel Bilgiler
              </Typography>

              {/* First Name field */}
              <TextField
                label="Ad"
                value={values.firstName || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
                inputRef={isEditing ? firstFieldRef : null}
                inputProps={{
                  "aria-required": "true",
                  "aria-invalid":
                    touched.firstName && !!errors.firstName ? "true" : "false",
                }}
                aria-describedby={
                  touched.firstName && errors.firstName
                    ? `firstName-error`
                    : undefined
                }
              />

              {/* Last Name field */}
              <TextField
                label="Soyad"
                value={values.lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
                inputProps={{
                  "aria-required": "true",
                  "aria-invalid":
                    touched.lastName && !!errors.lastName ? "true" : "false",
                }}
                aria-describedby={
                  touched.lastName && errors.lastName
                    ? `lastName-error`
                    : undefined
                }
              />

              {/* Email field */}
              <TextField
                label="E-posta"
                value={values.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
                inputProps={{
                  "aria-required": "true",
                  "aria-invalid":
                    touched.email && !!errors.email ? "true" : "false",
                  type: "email",
                }}
                aria-describedby={
                  touched.email && errors.email ? `email-error` : undefined
                }
              />

              {/* Office Phone field */}
              <TextField
                label="Ofis Telefonu"
                value={values.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />

              {/* Institutional Information Section */}
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  mt: 4,
                  color: "#1a237e",
                  fontWeight: "bold",
                  borderBottom: "2px solid #1a237e",
                  pb: 1,
                }}
              >
                Kurumsal Bilgiler
              </Typography>

              {/* University field */}
              <TextField
                label="Kurum"
                value={values.university || ""}
                onChange={(e) => handleChange("university", e.target.value)}
                onBlur={() => handleBlur("university")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.university && !!errors.university}
                helperText={touched.university && errors.university}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />

              {/* Faculty field */}
              <TextField
                label="Fakülte/Yüksekokul"
                value={values.faculty || ""}
                onChange={(e) => handleChange("faculty", e.target.value)}
                onBlur={() => handleBlur("faculty")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.faculty && !!errors.faculty}
                helperText={touched.faculty && errors.faculty}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />

              {/* Department field */}
              <TextField
                label="Bölüm"
                value={values.department || ""}
                onChange={(e) => handleChange("department", e.target.value)}
                onBlur={() => handleBlur("department")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.department && !!errors.department}
                helperText={touched.department && errors.department}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
              />

              {/* Web Profile field */}
              <TextField
                label="Web Profili"
                value={values.webUrl || ""}
                onChange={(e) => handleChange("webUrl", e.target.value)}
                onBlur={() => handleBlur("webUrl")}
                fullWidth
                variant="outlined"
                margin="normal"
                error={touched.webUrl && !!errors.webUrl}
                helperText={touched.webUrl && errors.webUrl}
                InputProps={{
                  readOnly: !isEditing,
                  sx: { borderRadius: 1 },
                }}
                sx={{ mb: 2 }}
                inputProps={{
                  type: "url",
                }}
              />
            </Box>

            {/* Edit/Save/Cancel Buttons */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEditClick}
                  disabled={isSaving}
                  sx={{
                    bgcolor: "#1a237e",
                    "&:hover": {
                      bgcolor: "#0d1642",
                    },
                  }}
                  ref={editButtonRef}
                  aria-label="Profili Düzenle"
                >
                  Profili Düzenle
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    sx={{
                      bgcolor: "#1a237e",
                      "&:hover": {
                        bgcolor: "#0d1642",
                      },
                    }}
                  >
                    {isSaving ? "Kaydediliyor..." : "Profili Kaydet"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancelClick}
                    disabled={isSaving}
                  >
                    İptal
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Wrap component with React.memo to prevent unnecessary re-renders
export default React.memo(Profilim);
