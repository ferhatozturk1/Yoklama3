import { turkishLabels, useLocalization, getLocalizedText } from '../localization';
import { renderHook } from '@testing-library/react-hooks';

describe('Localization Utilities', () => {
  describe('turkishLabels', () => {
    test('contains all required translations', () => {
      // Check for essential categories
      expect(turkishLabels).toHaveProperty('profilePhoto');
      expect(turkishLabels).toHaveProperty('emailInformation');
      expect(turkishLabels).toHaveProperty('firstName');
      expect(turkishLabels).toHaveProperty('lastName');
      expect(turkishLabels).toHaveProperty('editProfile');
      expect(turkishLabels).toHaveProperty('saveProfile');
      expect(turkishLabels).toHaveProperty('uploadPhoto');
      expect(turkishLabels).toHaveProperty('requiredField');
      expect(turkishLabels).toHaveProperty('invalidEmail');
      expect(turkishLabels).toHaveProperty('networkError');
      expect(turkishLabels).toHaveProperty('loading');
      expect(turkishLabels).toHaveProperty('profileSaved');
    });
    
    test('has correct Turkish translations', () => {
      expect(turkishLabels.profilePhoto).toBe('Profil Fotoğrafı');
      expect(turkishLabels.firstName).toBe('Ad');
      expect(turkishLabels.lastName).toBe('Soyad');
      expect(turkishLabels.email).toBe('E-posta');
      expect(turkishLabels.editProfile).toBe('Profili Düzenle');
      expect(turkishLabels.saveProfile).toBe('Profili Kaydet');
      expect(turkishLabels.cancel).toBe('İptal');
      expect(turkishLabels.requiredField).toBe('Bu alan zorunludur.');
    });
  });
  
  describe('useLocalization hook', () => {
    test('returns t function and labels', () => {
      const { result } = renderHook(() => useLocalization());
      
      expect(typeof result.current.t).toBe('function');
      expect(result.current.labels).toEqual(turkishLabels);
    });
    
    test('t function returns translation for existing key', () => {
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.t('firstName')).toBe('Ad');
      expect(result.current.t('lastName')).toBe('Soyad');
      expect(result.current.t('editProfile')).toBe('Profili Düzenle');
    });
    
    test('t function returns key for non-existing key', () => {
      const { result } = renderHook(() => useLocalization());
      
      const nonExistingKey = 'nonExistingKey';
      expect(result.current.t(nonExistingKey)).toBe(nonExistingKey);
    });
  });
  
  describe('getLocalizedText function', () => {
    test('returns translation for existing key', () => {
      expect(getLocalizedText('firstName')).toBe('Ad');
      expect(getLocalizedText('lastName')).toBe('Soyad');
      expect(getLocalizedText('editProfile')).toBe('Profili Düzenle');
    });
    
    test('returns key for non-existing key', () => {
      const nonExistingKey = 'nonExistingKey';
      expect(getLocalizedText(nonExistingKey)).toBe(nonExistingKey);
    });
  });
});