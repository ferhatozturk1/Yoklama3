# Design Document

## Overview

This design document outlines the enhancement of the existing profile management system (`Profilim.js`) to support Turkish localization, file upload functionality for profile photos, and API integration. The design maintains the current two-column layout while adding dynamic functionality and improved user experience.

## Architecture

### Component Structure
```
Profilim (Enhanced)
├── ProfilePhotoUpload (New)
├── ProfileForm (Enhanced)
├── LocalizationProvider (New)
├── ApiService (New)
└── ValidationUtils (New)
```

### State Management
The component will use React hooks for state management:
- `useState` for form data, editing mode, and UI states
- `useEffect` for API calls and data loading
- Custom hooks for file upload and validation

### Data Flow
1. Component mounts → API call to fetch user data
2. User data received → Populate form fields
3. User clicks edit → Enable editing mode
4. User uploads photo → Validate and preview
5. User saves changes → Validate and send to API
6. API response → Update UI and show feedback

## Components and Interfaces

### 1. Enhanced Profilim Component

**Props:**
```javascript
interface ProfilimProps {
  userProfile?: UserProfile;
  onProfileUpdate?: (profile: UserProfile) => void;
  apiEndpoint?: string;
}
```

**State:**
```javascript
interface ProfilimState {
  profile: UserProfile;
  isEditing: boolean;
  isLoading: boolean;
  errors: ValidationErrors;
  uploadedPhoto: File | null;
  photoPreview: string | null;
}
```

### 2. ProfilePhotoUpload Component

**Purpose:** Handle file upload functionality for profile photos

**Props:**
```javascript
interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (file: File, preview: string) => void;
  onPhotoRemove: () => void;
  disabled?: boolean;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}
```

**Features:**
- Drag and drop support
- File validation (type, size)
- Image preview
- Error handling
- Turkish error messages

### 3. LocalizationProvider

**Purpose:** Provide Turkish translations for all UI text

**Structure:**
```javascript
const turkishLabels = {
  profilePhoto: "Profil Fotoğrafı",
  emailInformation: "E-posta Bilgileri",
  phoneNumber: "Telefon Numarası",
  compulsoryEducation: "Zorunlu Eğitim Bilgileri",
  otherDetails: "Diğer Detaylar",
  faculty: "Fakülte",
  department: "Bölüm",
  university: "Üniversite",
  editProfile: "Profili Düzenle",
  saveProfile: "Profili Kaydet",
  cancel: "İptal",
  // ... additional translations
};
```

### 4. ApiService

**Purpose:** Handle all API communications

**Methods:**
```javascript
class ApiService {
  static async fetchUserProfile(userId: string): Promise<UserProfile>;
  static async updateUserProfile(profile: UserProfile): Promise<UserProfile>;
  static async uploadProfilePhoto(file: File): Promise<string>;
  static async deleteProfilePhoto(photoId: string): Promise<void>;
}
```

**Error Handling:**
- Network errors
- Validation errors
- Authentication errors
- Turkish error messages

## Data Models

### UserProfile Interface
```javascript
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone: string;
  university: string;
  faculty: string;
  department: string;
  profilePhoto?: string;
  compulsoryEducation?: string;
  otherDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### ValidationErrors Interface
```javascript
interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  university?: string;
  faculty?: string;
  department?: string;
  profilePhoto?: string;
}
```

### FileUploadResult Interface
```javascript
interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  preview?: string;
}
```

## Error Handling

### File Upload Errors
- **Invalid file type:** "Geçersiz dosya türü. Lütfen JPG, PNG veya GIF formatında bir resim seçin."
- **File too large:** "Dosya boyutu çok büyük. Maksimum 5MB boyutunda dosya yükleyebilirsiniz."
- **Upload failed:** "Dosya yükleme başarısız. Lütfen tekrar deneyin."

### API Errors
- **Network error:** "Bağlantı hatası. İnternet bağlantınızı kontrol edin."
- **Server error:** "Sunucu hatası. Lütfen daha sonra tekrar deneyin."
- **Validation error:** "Girilen bilgiler geçersiz. Lütfen kontrol edin."

### Form Validation Errors
- **Required field:** "Bu alan zorunludur."
- **Invalid email:** "Geçerli bir e-posta adresi girin."
- **Invalid phone:** "Geçerli bir telefon numarası girin."

## Testing Strategy

### Unit Tests
1. **Component Rendering Tests**
   - Test Turkish labels display correctly
   - Test form fields render with proper values
   - Test edit mode toggle functionality

2. **File Upload Tests**
   - Test valid file upload
   - Test invalid file type rejection
   - Test file size validation
   - Test image preview generation

3. **Form Validation Tests**
   - Test required field validation
   - Test email format validation
   - Test phone number validation

4. **API Integration Tests**
   - Test successful data fetch
   - Test error handling for failed requests
   - Test profile update functionality

### Integration Tests
1. **End-to-End Profile Flow**
   - Load profile → Edit → Upload photo → Save → Verify changes
   - Test error scenarios and recovery

2. **Responsive Design Tests**
   - Test layout on different screen sizes
   - Test mobile file upload functionality

### Accessibility Tests
1. **Keyboard Navigation**
   - Test tab order through form fields
   - Test file upload accessibility

2. **Screen Reader Compatibility**
   - Test form labels and descriptions
   - Test error message announcements

## Implementation Phases

### Phase 1: Turkish Localization
- Create localization constants
- Update all UI text to Turkish
- Test label display

### Phase 2: File Upload Component
- Implement ProfilePhotoUpload component
- Add file validation
- Add image preview functionality

### Phase 3: Form Enhancement
- Add editing mode functionality
- Implement form validation
- Add save/cancel actions

### Phase 4: API Integration
- Create ApiService class
- Implement data fetching
- Add error handling

### Phase 5: Testing and Polish
- Add comprehensive tests
- Optimize performance
- Ensure accessibility compliance

## Performance Considerations

### Image Optimization
- Compress uploaded images before sending to server
- Generate thumbnails for profile display
- Lazy load profile images

### API Optimization
- Implement request caching
- Add loading states
- Debounce form validation

### Bundle Size
- Use dynamic imports for file upload components
- Optimize Turkish localization bundle
- Remove unused Material-UI components

## Security Considerations

### File Upload Security
- Validate file types on both client and server
- Scan uploaded files for malware
- Limit file sizes to prevent DoS attacks

### Data Validation
- Sanitize all user inputs
- Validate data on both client and server
- Use HTTPS for all API communications

### Authentication
- Verify user permissions before allowing edits
- Implement session timeout
- Add CSRF protection