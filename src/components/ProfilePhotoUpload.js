import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  PhotoCamera,
  Delete,
  Edit
} from '@mui/icons-material';

const ProfilePhotoUpload = ({
  currentPhoto,
  onPhotoChange,
  onPhotoRemove,
  disabled = false,
  size = 80
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentPhoto);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError('');

    // Call parent callback
    if (onPhotoChange) {
      onPhotoChange(file, url);
    }

    // Close dialog
    setShowDialog(false);
  };

  // Handle photo removal
  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setError('');
    
    if (onPhotoRemove) {
      onPhotoRemove();
    }
    
    setShowDialog(false);
  };

  // Open file dialog
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          src={previewUrl}
          alt="Profil fotoğrafı"
          sx={{
            width: size,
            height: size,
            fontSize: `${size / 3}rem`,
            bgcolor: '#1a237e',
            cursor: disabled ? 'default' : 'pointer'
          }}
          onClick={disabled ? undefined : () => setShowDialog(true)}
        >
          {!previewUrl && 'A'}
        </Avatar>
        
        {!disabled && (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              bgcolor: '#1a237e',
              color: 'white',
              width: 28,
              height: 28,
              '&:hover': {
                bgcolor: '#0d1b5e'
              }
            }}
            onClick={() => setShowDialog(true)}
          >
            <Edit fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Photo Management Dialog */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Profil Fotoğrafı
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Avatar
              src={previewUrl}
              alt="Profil fotoğrafı önizleme"
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                fontSize: '2rem',
                bgcolor: '#1a237e'
              }}
            >
              {!previewUrl && 'A'}
            </Avatar>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              JPG, PNG veya GIF formatında, maksimum 5MB boyutunda fotoğraf yükleyebilirsiniz.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<PhotoCamera />}
                onClick={handleUploadClick}
                sx={{
                  bgcolor: '#1a237e',
                  '&:hover': { bgcolor: '#0d1b5e' }
                }}
              >
                Fotoğraf Seç
              </Button>

              {previewUrl && (
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={handleRemovePhoto}
                  color="error"
                >
                  Kaldır
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </>
  );
};

export default ProfilePhotoUpload;