# Sidebar Component Documentation

## Overview
The Sidebar component is a comprehensive course management interface that allows users to view, add, and manage academic courses across different terms. It's designed to integrate seamlessly with the existing Material-UI based application.

## Features

### Core Functionality
- **Term Selection**: Dropdown to select academic terms (2023-2024 Fall/Spring, 2024-2025 Fall/Spring)
- **Dynamic Course Loading**: Courses update automatically based on selected term
- **Add Course Modal**: Comprehensive form for adding new courses
- **Course Autocomplete**: Auto-complete functionality for course selection (ready for API integration)
- **Auto-fill Course Data**: Automatically populates course details when a course is selected

### Course Management
Each course displays and allows editing of:
- Term, Section, Course Code, Course Title
- Language, Theory+Practice hours (T+P)
- Mandatory/Elective status (M/E)
- Credits, ECTS, Faculty
- Class Level (1-4) with dropdown selection
- Days and Times with multi-select capability
- Visual status indicators with chips

### UI/UX Features
- **Responsive Design**: Adapts to different screen sizes
- **Material-UI Integration**: Consistent with existing theme
- **Professional Styling**: Clean, modern interface
- **Accessibility**: Proper labels and keyboard navigation
- **Visual Feedback**: Status chips, icons, and clear typography

## Integration

### Basic Integration
```jsx
import Sidebar from './components/Sidebar';

// In your component
<Box sx={{ display: 'flex' }}>
  <Sidebar />
  <Box component="main" sx={{ flexGrow: 1 }}>
    {/* Your main content */}
  </Box>
</Box>
```

### Integration with TopNavigation
```jsx
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';

const Layout = () => (
  <Box sx={{ display: 'flex', height: '100vh' }}>
    <Sidebar />
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavigation />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Main content */}
      </Box>
    </Box>
  </Box>
);
```

### Integration with MainPortal
Add the Sidebar to your existing MainPortal component by modifying the layout structure.

## API Integration Points

### Course Data Fetching
The component is ready for API integration. Replace the `mockCourses` object with actual API calls:

```jsx
// In useEffect
useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/courses?term=${selectedTerm}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  
  fetchCourses();
}, [selectedTerm]);
```

### Course Autocomplete
Replace `availableCourses` with API call:

```jsx
const handleCourseSelection = async (event, value) => {
  if (value) {
    try {
      const response = await fetch(`/api/instructor-courses?courseName=${value}`);
      const courseInfo = await response.json();
      setNewCourse(prev => ({ ...prev, ...courseInfo }));
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  }
};
```

### Adding New Courses
Integrate with backend when saving:

```jsx
const handleSaveCourse = async () => {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    });
    
    if (response.ok) {
      const savedCourse = await response.json();
      setCourses(prev => [...prev, savedCourse]);
      setIsModalOpen(false);
    }
  } catch (error) {
    console.error('Error saving course:', error);
  }
};
```

## Customization

### Styling
The component uses the existing theme system. Customize by:
- Modifying theme colors in `src/theme/index.js`
- Overriding component styles using `sx` prop
- Adding custom CSS classes if needed

### Data Structure
The course object structure:
```jsx
{
  id: number,
  courseName: string,
  term: string,
  section: string,
  courseCode: string,
  courseTitle: string,
  language: string,
  theoryPractice: string,
  mandatoryElective: 'M' | 'E',
  credits: string,
  ects: string,
  faculty: string,
  classLevel: 1 | 2 | 3 | 4,
  days: string[],
  times: string
}
```

### Adding New Terms
Modify the `terms` array to add new academic terms:
```jsx
const terms = [
  '2023-2024 Fall',
  '2023-2024 Spring',
  '2024-2025 Fall',
  '2024-2025 Spring',
  '2025-2026 Fall', // Add new terms here
  '2025-2026 Spring'
];
```

## Dependencies
The component uses these Material-UI components:
- Box, Typography, FormControl, Select, MenuItem
- Card, CardContent, Button, Dialog components
- TextField, Autocomplete, RadioGroup, Switch
- Chip, IconButton, Divider, Grid, Paper
- Icons: Add, Edit, Delete, School

All dependencies are already included in your project's package.json.

## Responsive Behavior
- **Desktop**: Fixed width sidebar (350px)
- **Mobile**: Full width, can be toggled or used in drawer
- **Tablet**: Adapts to available space

## Future Enhancements
- Search and filter functionality
- Bulk operations (import/export)
- Course scheduling conflict detection
- Integration with calendar systems
- Advanced reporting features