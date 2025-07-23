import React, { useState, useRef, useEffect } from 'react';
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
import { compressImage, createThumbnail, revokeObjectURL } from '../utils/imageCompression';

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

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview !== currentPhoto) {
        revokeObjectURL(preview);
      }
    };
  }, [preview, currentPhoto]);

  // Memoize the file validation function to prevent recreation on each render
  const validateFileMemoized = React.useCallback(validateFile, [acceptedFormats, maxSize, t]);
  
  const handleFileSelect = async (file) => {
    setError('');
    
    const validationError = validateFileMemoized(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Use a web worker for image compression if available
      const compressionPromise = compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.7,
        useWebWorker: true
      });
      
      // Start thumbnail creation in parallel
      const thumbnailPromise = createThumbnail(file);
      
      // Wait for both operations to complete
      const [compressedFile, thumbnailUrl] = await Promise.all([
        compressionPromise,
        thumbnailPromise
      ]);
      
      // Convert compressed blob to File object
      const optimizedFile = new File(
        [compressedFile], 
        file.name, 
        { type: file.type }
      );
      
      setPreview(thumbnailUrl);
      
      // Call parent callback with optimized file
      onPhotoChange(optimizedFile, thumbnailUrl);
    } catch (error) {
      console.error('Image processing error:', error);
      setError(t('uploadFailed'));
    }
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
    // Revoke object URL if it's not the original photo
    if (preview && preview !== currentPhoto) {
      revokeObjectURL(preview);
    }
    
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
          alt={t('profilePhoto')}
          role="img"
          aria-label={preview ? t('currentProfilePhoto') : t('noProfilePhoto')}
        >
          {!preview && <PhotoCamera sx={{ fontSize: '3rem' }} aria-hidden="true" />}
        </Avatar>
      </Box>

      {/* Upload Area */}
      <Paper
        elevation={dragOver ? 4 : 1}
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          border: dragOver ? '2px dashed #1a237e' : '2px dashed #e0e0e0',
          backgroundColor: dragOver ? '#f3f4f6' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1,
          minHeight: { xs: '100px', sm: '120px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? handleUploadClick : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={t('dragDropText')}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleUploadClick();
          }
        }}
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
          {t('fileTypeInfo')}
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
        aria-hidden="true"
        aria-label={t('uploadPhoto')}
      />

      {/* Action Buttons */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          onClick={handleUploadClick}
          disabled={disabled}
          size="small"
          aria-label={preview ? t('changePhoto') : t('uploadPhoto')}
        >
          {preview ? t('changePhoto') : t('uploadPhoto')}
        </Button>
        
        {preview && (
          <IconButton
            color="error"
            onClick={handleRemovePhoto}
            disabled={disabled}
            size="small"
            aria-label={t('removePhoto')}
          >
            <Delete />
          </IconButton>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ProfilePhotoUpload;