# Design Document: Profile Page Redesign

## Overview

This design document outlines the implementation approach for redesigning the user profile page ("Profilim") according to the specified requirements. The redesign will maintain the existing functionality while reorganizing the visual elements into a two-column layout with specific content placement.

## Architecture

The profile page will continue to use React with Material-UI (MUI) components, which are already being used in the current implementation. The redesign will focus on restructuring the layout and styling of these components to match the new design requirements.

## Components and Interfaces

### Main Components

1. **ProfilePage Container**
   - Top-level component that manages the overall layout
   - Handles loading states and data fetching

2. **LeftProfileSection**
   - Contains the user avatar, name, university affiliation
   - Displays editable profile fields in a vertical stack

3. **RightProfileSection**
   - Contains detailed personal information fields
   - Organized in sections with appropriate spacing
   - Includes the Edit Profile button

### Component Hierarchy

```
ProfilePage
├── LeftProfileSection
│   ├── Avatar
│   ├── UserTitle
│   ├── UserName
│   ├── UniversityName
│   └── EditableFieldsList
│       ├── ProfilePhotoField
│       ├── EmailField
│       ├── PhoneField
│       ├── EducationStatusField
│       └── OtherDetailsField
└── RightProfileSection
    ├── TopRightNote
    ├── PersonalInfoFields
    │   ├── FirstNameField
    │   ├── LastNameField
    │   ├── EmailField
    │   └── PhoneField
    ├── AcademicInfoFields
    │   ├── UniversityField
    │   ├── FacultyField
    │   └── DepartmentField
    └── EditProfileButton
```

## Data Models

The profile page will use the existing user profile data model, which includes:

```javascript
userProfile = {
  name: string,          // User's full name
  title: string,         // User's title (e.g., "Dr.")
  email: string,         // User's email address
  phone: string,         // User's phone number
  school: string,        // University name
  department: string,    // Department name
  faculty: string,       // Faculty name (to be added)
  firstName: string,     // First name (to be extracted from name)
  lastName: string,      // Last name (to be extracted from name)
  profilePhoto: string,  // URL to profile photo
  biography: string,     // User biography
  educationStatus: string // Compulsory education status (to be added)
}
```

## UI Design

### Layout Structure

The page will use Material-UI's Grid system to create the two-column layout:

```
+------------------------------------------+
| +-------------+  +---------------------+ |
| |             |  | "Only visible on    | |
| |    Avatar   |  |  this screen"       | |
| |      A      |  +---------------------+ |
| |             |  |                     | |
| +-------------+  | First Name          | |
| | Dr. xxx     |  +---------------------+ |
| | Manisa Celal|  | Last Name           | |
| | Bayar Univ. |  +---------------------+ |
| +-------------+  | Email               | |
| |             |  +---------------------+ |
| | Profile     |  | Phone Number        | |
| | Photo       |  +---------------------+ |
| +-------------+  |                     | |
| |             |  | University          | |
| | Email       |  +---------------------+ |
| | Information |  | Faculty             | |
| +-------------+  +---------------------+ |
| |             |  | Department          | |
| | Phone       |  +---------------------+ |
| | Number      |  |                     | |
| +-------------+  |                     | |
| |             |  |                     | |
| | Compulsory  |  |                     | |
| | Education   |  |                     | |
| | Info        |  |                     | |
| +-------------+  |                     | |
| |             |  |                     | |
| | Other       |  | [Edit Profile]      | |
| | Details     |  |                     | |
| +-------------+  +---------------------+ |
+------------------------------------------+
```

### Styling Approach

1. **Material-UI Theme**
   - Continue using the existing MUI theme
   - Use consistent spacing, typography, and color schemes

2. **Responsive Design**
   - On mobile devices, the layout will stack vertically
   - On desktop, maintain the two-column layout with appropriate proportions

3. **Visual Elements**
   - Avatar: Large circle with user's initial
   - Text fields: Consistent styling with thin borders
   - Buttons: Standard MUI button styling
   - Note: Small text in the top right corner

## Error Handling

1. **Loading State**
   - Display a loading indicator when user profile data is being fetched
   - Maintain the existing loading state handling

2. **Missing Data**
   - Provide fallbacks for missing profile information
   - Display placeholders for empty fields

## Testing Strategy

1. **Component Testing**
   - Unit tests for individual components
   - Verify proper rendering of each section

2. **Layout Testing**
   - Test responsive behavior across different screen sizes
   - Ensure proper alignment of elements

3. **Integration Testing**
   - Verify that the profile data is correctly displayed in all fields
   - Test the edit functionality (if implemented)