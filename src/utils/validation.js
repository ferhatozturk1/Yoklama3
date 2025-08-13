import React, { useState, useEffect, useCallback } from 'react';
import { getLocalizedText } from './localization';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Turkish phone number regex (supports various formats)
const PHONE_REGEX = /^(\+90|0)?[5][0-9]{9}$/;

/**
 * Validates if a field is required and not empty
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return getLocalizedText('requiredField');
  }
  return null;
};

/**
 * Validates email format
 */
export const validateEmail = (email) => {
  if (!email) {
    return getLocalizedText('requiredField');
  }
  
  if (!EMAIL_REGEX.test(email.trim())) {
    return getLocalizedText('invalidEmail');
  }
  
  return null;
};

/**
 * Validates Turkish phone number format
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return getLocalizedText('requiredField');
  }
  
  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (!PHONE_REGEX.test(cleanPhone)) {
    return getLocalizedText('invalidPhone');
  }
  
  return null;
};

/**
 * Validates that a string has minimum length
 */
export const validateMinLength = (value, minLength, fieldName) => {
  if (!value) {
    return getLocalizedText('requiredField');
  }
  
  if (value.trim().length < minLength) {
    return `${fieldName} en az ${minLength} karakter olmalıdır.`;
  }
  
  return null;
};

/**
 * Validates that a string has maximum length
 */
export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} en fazla ${maxLength} karakter olabilir.`;
  }
  
  return null;
};

/**
 * Validates the entire profile form
 */
export const validateProfileForm = (profile) => {
  const errors = {};
  
  // Validate required fields
  const requiredFields = [
    { key: 'firstName', label: 'Ad' },
    { key: 'lastName', label: 'Soyad' },
    { key: 'email', label: 'E-posta' },
    { key: 'university', label: 'Üniversite' }
  ];
  
  requiredFields.forEach(({ key, label }) => {
    const error = validateRequired(profile[key], label);
    if (error) {
      errors[key] = error;
    }
  });
  
  // Validate email format
  if (profile.email && !errors.email) {
    const emailError = validateEmail(profile.email);
    if (emailError) {
      errors.email = emailError;
    }
  }
  
  // Phone validation disabled - no validation for phone field
  
  // Validate field lengths
  const fieldLengths = [
    { key: 'firstName', max: 50, label: 'Ad' },
    { key: 'lastName', max: 50, label: 'Soyad' },
    { key: 'university', max: 100, label: 'Üniversite' },
    { key: 'faculty', max: 100, label: 'Fakülte' },
    { key: 'department', max: 100, label: 'Bölüm' },
    { key: 'compulsoryEducation', max: 500, label: 'Zorunlu Eğitim Bilgileri' },
    { key: 'otherDetails', max: 1000, label: 'Diğer Detaylar' }
  ];
  
  fieldLengths.forEach(({ key, max, label }) => {
    if (profile[key] && !errors[key]) {
      const lengthError = validateMaxLength(profile[key], max, label);
      if (lengthError) {
        errors[key] = lengthError;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Custom hook for form validation
 */
export const useFormValidation = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // initialValues değiştiğinde values'ı güncelle
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);
  
  const validateField = useCallback((fieldName, value) => {
    let error = null;
    
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
      case 'university':
        error = validateRequired(value, fieldName);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        // Phone validation disabled - no validation for phone field
        break;
      default:
        break;
    }
    
    return error;
  }, []);
  
  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => {
      const newValues = {
        ...prev,
        [fieldName]: value
      };
      return newValues;
    });
    
    // Validate field if it has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  }, [validateField, touched]);
  
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    const error = validateField(fieldName, values[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, [validateField, values]);
  
  const validateAll = useCallback(() => {
    const validation = validateProfileForm(values);
    setErrors(validation.errors);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    return validation.isValid;
  }, [values]);
  
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};