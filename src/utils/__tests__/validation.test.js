import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateMaxLength,
  validateProfileForm,
  useFormValidation
} from '../validation';
import { renderHook, act } from '@testing-library/react-hooks';
import { getLocalizedText } from '../localization';

// Mock the localization module
jest.mock('../localization', () => ({
  getLocalizedText: jest.fn(key => {
    const translations = {
      requiredField: 'Bu alan zorunludur.',
      invalidEmail: 'Geçerli bir e-posta adresi girin.',
      invalidPhone: 'Geçerli bir telefon numarası girin.'
    };
    return translations[key] || key;
  })
}));

describe('Validation Functions', () => {
  describe('validateRequired', () => {
    test('returns error message for empty values', () => {
      expect(validateRequired('')).toBe('Bu alan zorunludur.');
      expect(validateRequired(null)).toBe('Bu alan zorunludur.');
      expect(validateRequired(undefined)).toBe('Bu alan zorunludur.');
      expect(validateRequired('   ')).toBe('Bu alan zorunludur.');
    });
    
    test('returns null for valid values', () => {
      expect(validateRequired('test')).toBeNull();
      expect(validateRequired(0)).toBeNull();
      expect(validateRequired(false)).toBeNull();
    });
  });
  
  describe('validateEmail', () => {
    test('returns error message for invalid emails', () => {
      expect(validateEmail('')).toBe('Bu alan zorunludur.');
      expect(validateEmail('notanemail')).toBe('Geçerli bir e-posta adresi girin.');
      expect(validateEmail('missing@domain')).toBe('Geçerli bir e-posta adresi girin.');
      expect(validateEmail('@nodomain.com')).toBe('Geçerli bir e-posta adresi girin.');
    });
    
    test('returns null for valid emails', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name+tag@example.co.uk')).toBeNull();
      expect(validateEmail('user-name@domain.com')).toBeNull();
    });
  });
  
  describe('validatePhone', () => {
    test('returns error message for invalid phone numbers', () => {
      expect(validatePhone('')).toBe('Bu alan zorunludur.');
      expect(validatePhone('123')).toBe('Geçerli bir telefon numarası girin.');
      expect(validatePhone('1234567890')).toBe('Geçerli bir telefon numarası girin.');
      expect(validatePhone('+1234567890')).toBe('Geçerli bir telefon numarası girin.');
    });
    
    test('returns null for valid Turkish phone numbers', () => {
      expect(validatePhone('+905551234567')).toBeNull();
      expect(validatePhone('05551234567')).toBeNull();
      expect(validatePhone('5551234567')).toBeNull();
      expect(validatePhone('0555 123 4567')).toBeNull();
      expect(validatePhone('+90 555 123 4567')).toBeNull();
    });
  });
  
  describe('validateMinLength', () => {
    test('returns error message for strings shorter than min length', () => {
      expect(validateMinLength('', 3, 'Ad')).toBe('Bu alan zorunludur.');
      expect(validateMinLength('ab', 3, 'Ad')).toBe('Ad en az 3 karakter olmalıdır.');
    });
    
    test('returns null for strings with valid length', () => {
      expect(validateMinLength('abc', 3, 'Ad')).toBeNull();
      expect(validateMinLength('abcdef', 3, 'Ad')).toBeNull();
    });
  });
  
  describe('validateMaxLength', () => {
    test('returns error message for strings longer than max length', () => {
      expect(validateMaxLength('abcdef', 5, 'Ad')).toBe('Ad en fazla 5 karakter olabilir.');
    });
    
    test('returns null for strings with valid length', () => {
      expect(validateMaxLength('abc', 5, 'Ad')).toBeNull();
      expect(validateMaxLength('abcde', 5, 'Ad')).toBeNull();
      expect(validateMaxLength('', 5, 'Ad')).toBeNull();
    });
  });
  
  describe('validateProfileForm', () => {
    test('validates required fields', () => {
      const result = validateProfileForm({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('firstName');
      expect(result.errors).toHaveProperty('lastName');
      expect(result.errors).toHaveProperty('email');
      expect(result.errors).toHaveProperty('university');
    });
    
    test('validates email format', () => {
      const result = validateProfileForm({
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'invalid-email',
        university: 'Test University'
      });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('email');
      expect(result.errors.email).toBe('Geçerli bir e-posta adresi girin.');
    });
    
    test('validates phone format if provided', () => {
      const result = validateProfileForm({
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@example.com',
        university: 'Test University',
        phone: '123456' // Invalid Turkish phone
      });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('phone');
      expect(result.errors.phone).toBe('Geçerli bir telefon numarası girin.');
    });
    
    test('validates field lengths', () => {
      const longString = 'a'.repeat(101);
      const result = validateProfileForm({
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@example.com',
        university: longString,
        phone: '+905551234567'
      });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('university');
    });
    
    test('returns isValid true for valid profile', () => {
      const result = validateProfileForm({
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@example.com',
        university: 'Test University',
        phone: '+905551234567',
        faculty: 'Engineering',
        department: 'Computer Science'
      });
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });
  
  describe('useFormValidation hook', () => {
    test('initializes with provided values', () => {
      const initialValues = {
        firstName: 'Ahmet',
        lastName: 'Yılmaz'
      };
      
      const { result } = renderHook(() => useFormValidation(initialValues));
      
      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
    
    test('handles field change', () => {
      const { result } = renderHook(() => useFormValidation({}));
      
      act(() => {
        result.current.handleChange('firstName', 'Ahmet');
      });
      
      expect(result.current.values.firstName).toBe('Ahmet');
    });
    
    test('validates field on blur', () => {
      const { result } = renderHook(() => useFormValidation({}));
      
      act(() => {
        result.current.handleChange('email', 'invalid-email');
        result.current.handleBlur('email');
      });
      
      expect(result.current.touched.email).toBe(true);
      expect(result.current.errors.email).toBe('Geçerli bir e-posta adresi girin.');
    });
    
    test('validates all fields', () => {
      const { result } = renderHook(() => useFormValidation({
        firstName: '',
        lastName: 'Yılmaz',
        email: 'invalid-email'
      }));
      
      let isValid;
      act(() => {
        isValid = result.current.validateAll();
      });
      
      expect(isValid).toBe(false);
      expect(result.current.errors.firstName).toBeTruthy();
      expect(result.current.errors.email).toBeTruthy();
      expect(result.current.touched.firstName).toBe(true);
      expect(result.current.touched.lastName).toBe(true);
      expect(result.current.touched.email).toBe(true);
    });
    
    test('resets form state', () => {
      const { result } = renderHook(() => useFormValidation({
        firstName: 'Ahmet',
        lastName: 'Yılmaz'
      }));
      
      act(() => {
        result.current.handleChange('firstName', 'Mehmet');
        result.current.handleBlur('firstName');
      });
      
      expect(result.current.values.firstName).toBe('Mehmet');
      
      const newValues = {
        firstName: 'Ali',
        lastName: 'Demir'
      };
      
      act(() => {
        result.current.resetForm(newValues);
      });
      
      expect(result.current.values).toEqual(newValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });
});