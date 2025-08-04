import { useState, useCallback } from 'react';

// Validation rules
const validationRules = {
  title: {
    required: true,
    message: "Ünvan gereklidir"
  },
  firstName: {
    required: true,
    minLength: 2,
    message: "Ad en az 2 karakter olmalıdır"
  },
  lastName: {
    required: true,
    minLength: 2,
    message: "Soyad en az 2 karakter olmalıdır"
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Geçerli bir e-posta adresi girin"
  },
  phone: {
    required: false,
    pattern: /^(\+90|0)?[0-9]{10}$/,
    message: "Geçerli bir telefon numarası girin"
  },
  university: {
    required: false,
    minLength: 2,
    message: "Kurum adı en az 2 karakter olmalıdır"
  },
  faculty: {
    required: false,
    minLength: 2,
    message: "Fakülte adı en az 2 karakter olmalıdır"
  },
  department: {
    required: false,
    minLength: 2,
    message: "Bölüm adı en az 2 karakter olmalıdır"
  },
  webUrl: {
    required: false,
    pattern: /^https?:\/\/.+/,
    message: "Geçerli bir web adresi girin (http:// veya https:// ile başlamalı)"
  }
};

// Validate single field
const validateField = (name, value, rules = validationRules) => {
  const rule = rules[name];
  if (!rule) return null;

  // Required validation
  if (rule.required && (!value || value.trim() === '')) {
    return rule.message || `${name} gereklidir`;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return null;
  }

  // Min length validation
  if (rule.minLength && value.length < rule.minLength) {
    return rule.message || `${name} en az ${rule.minLength} karakter olmalıdır`;
  }

  // Max length validation
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.message || `${name} en fazla ${rule.maxLength} karakter olmalıdır`;
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.message || `${name} geçerli formatta değil`;
  }

  return null;
};

// Custom hook for form validation
export const useFormValidation = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle field change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Handle field blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [values]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  }, [values]);

  // Reset form
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  // Check if form has errors
  const hasErrors = Object.values(errors).some(error => error !== null);

  // Check if form is dirty (has changes)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    hasErrors,
    isDirty,
    setValues
  };
};

// Utility function to validate email domain
export const validateEmailDomain = (email, requiredDomain) => {
  if (!email || !requiredDomain) return false;
  return email.toLowerCase().endsWith(requiredDomain.toLowerCase());
};

// Utility function to format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format Turkish phone numbers
  if (digits.startsWith('90')) {
    return `+${digits}`;
  } else if (digits.startsWith('0')) {
    return `+90${digits.slice(1)}`;
  } else if (digits.length === 10) {
    return `+90${digits}`;
  }
  
  return phone;
};

// Utility function to validate Turkish phone number
export const isValidTurkishPhone = (phone) => {
  if (!phone) return false;
  
  const digits = phone.replace(/\D/g, '');
  
  // Check various Turkish phone formats
  return (
    /^90[0-9]{10}$/.test(digits) || // +90XXXXXXXXXX
    /^0[0-9]{10}$/.test(digits) ||  // 0XXXXXXXXXX
    /^[0-9]{10}$/.test(digits)      // XXXXXXXXXX
  );
};

export default {
  useFormValidation,
  validateField,
  validateEmailDomain,
  formatPhoneNumber,
  isValidTurkishPhone,
  validationRules
};