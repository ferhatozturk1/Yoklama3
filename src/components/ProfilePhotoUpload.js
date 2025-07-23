import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Avatar,
  Typography,
  Alert,
  IconButton,
  Paper
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoCamera
} from '@mui/icons-material';
import { useLocalization } from '../utils/localization';

const ProfilePhotoUpload = ({
  currentPhoto,
  onPhotoChange,
  onPhotoRemove,
  disabled = false,
  maxSize = 5, // MB
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
}) => {
  const { t } = useLocalization();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentPhoto || '');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return t('invalidFileType');
    }

    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return t('fileTooLarge');
    }

    return null;
  };

  const handleFileSelect = (file) => {
    setError('');
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    // Call parent callback
    onPhotoChange(file, previewUrl);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPreview('');
    setError('');
    onPhotoRemove();
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Current Photo Display */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar
          src={preview}
          sx={{
            width: 120,
            height: 120,
            fontSize: '3rem',
            bgcolor: '#1a237e'
          }}
        >
          {!preview && <PhotoCamera sx={{ fontSize: '3rem' }} />}
        </Avatar>
      </Box>

      {/* Upload Area */}
      <Paper
        elevation={dragOver ? 4 : 1}
        sx={{
          p: 3,
          textAlign: 'center',
          border: dragOver ? '2px dashed #1a237e' : '2px dashed #e0e0e0',
          backgroundColor: dragOver ? '#f3f4f6' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? handleUploadClick : undefined}
      >
        <CloudUpload 
          sx={{ 
            fontSize: '3rem', 
            color: dragOver ? '#1a237e' : '#9e9e9e',
            mb: 1
          }} 
        />
        <Typography variant="body1" sx={{ mb: 1 }}>
          {t('dragDropText')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          JPG, PNG, GIF - Maksimum {maxSize}MB
        </Typography>
      </Paper>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Action Buttons */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          onClick={handleUploadClick}
          disabled={disabled}
          size="small"
        >
          {preview ? t('changePhoto') : t('uploadPhoto')}
        </Button>
        
        {preview && (
          <IconButton
            color="error"
            onClick={handleRemovePhoto}
            disabled={disabled}
            size="small"
          >
            <Delete />
          </IconButton>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ProfilePhotoUpload;