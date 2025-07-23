import { turkishLabels, getLocalizedText, useLocalization } from '../localization';
import { renderHook } from '@testing-library/react';

describe('Localization', () => {
  describe('turkishLabels', () => {
    test('should contain all required profile labels', () => {
      expect(turkishLabels.profilePhoto).toBe("Profil Fotoğrafı");
      expect(turkishLabels.emailInformation).toBe("E-posta Bilgileri");
      expect(turkishLabels.phoneNumber).toBe("Telefon Numarası");
      expect(turkishLabels.compulsoryEducation).toBe("Zorunlu Eğitim Bilgileri");
      expect(turkishLabels.otherDetails).toBe("Diğer Detaylar");
      expect(turkishLabels.faculty).toBe("Fakülte");
      expect(turkishLabels.department).toBe("Bölüm");
      expect(turkishLabels.university).toBe("Üniversite");
      expect(turkishLabels.editProfile).toBe("Profili Düzenle");
    });

    test('should contain form field labels', () => {
      expect(turkishLabels.firstName).toBe("Ad");
      expect(turkishLabels.lastName).toBe("Soyad");
      expect(turkishLabels.email).toBe("E-posta");
      expect(turkishLabels.phone).toBe("Telefon");
    });

    test('should contain action labels', () => {
      expect(turkishLabels.saveProfile).toBe("Profili Kaydet");
      expect(turkishLabels.cancel).toBe("İptal");
    });

    test('should contain error messages', () => {
      expect(turkishLabels.requiredField).toBe("Bu alan zorunludur.");
      expect(turkishLabels.invalidEmail).toBe("Geçerli bir e-posta adresi girin.");
      expect(turkishLabels.invalidPhone).toBe("Geçerli bir telefon numarası girin.");
    });
  });

  describe('getLocalizedText', () => {
    test('should return correct Turkish text for valid keys', () => {
      expect(getLocalizedText('profilePhoto')).toBe("Profil Fotoğrafı");
      expect(getLocalizedText('editProfile')).toBe("Profili Düzenle");
    });

    test('should return the key itself for invalid keys', () => {
      expect(getLocalizedText('nonExistentKey')).toBe('nonExistentKey');
    });
  });

  describe('useLocalization hook', () => {
    test('should provide t function and labels object', () => {
      const { result } = renderHook(() => useLocalization());
      
      expect(typeof result.current.t).toBe('function');
      expect(result.current.labels).toBe(turkishLabels);
    });

    test('t function should return correct translations', () => {
      const { result } = renderHook(() => useLocalization());
      const { t } = result.current;
      
      expect(t('profilePhoto')).toBe("Profil Fotoğrafı");
      expect(t('editProfile')).toBe("Profili Düzenle");
    });

    test('t function should return key for missing translations', () => {
      const { result } = renderHook(() => useLocalization());
      const { t } = result.current;
      
      expect(t('missingKey')).toBe('missingKey');
    });
  });
});