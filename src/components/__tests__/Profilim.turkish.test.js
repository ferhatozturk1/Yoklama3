import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profilim from '../Profilim';
import { turkishLabels } from '../../utils/localization';

// Mock the API services
jest.mock('../../utils/ApiService');
jest.mock('../../utils/MockApiService');

describe('Profilim Component Turkish Labels', () => {
  const mockProfile = {
    id: 'user123',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    phone: '+90 555 123 4567',
    university: 'Manisa Celal Bayar Üniversitesi',
    faculty: 'Mühendislik Fakültesi',
    department: 'Bilgisayar Mühendisliği',
    profilePhoto: 'https://example.com/photo.jpg',
    compulsoryEducation: 'Lisans: Bilgisayar Mühendisliği',
    otherDetails: 'Veri bilimi uzmanı',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays all section labels in Turkish', () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Check page title
    expect(screen.getByText('Profilim')).toBeInTheDocument();
    
    // Check form field labels
    expect(screen.getByLabelText(turkishLabels.emailInformation)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.phoneNumber)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.compulsoryEducation)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.otherDetails)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.firstName)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.lastName)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.email)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.university)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.faculty)).toBeInTheDocument();
    expect(screen.getByLabelText(turkishLabels.department)).toBeInTheDocument();
    
    // Check button text
    expect(screen.getByText(turkishLabels.editProfile)).toBeInTheDocument();
  });

  test('displays all button labels in Turkish when in edit mode', () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Click edit button to enter edit mode
    const editButton = screen.getByText(turkishLabels.editProfile);
    fireEvent.click(editButton);
    
    // Check save and cancel buttons
    expect(screen.getByText(turkishLabels.saveProfile)).toBeInTheDocument();
    expect(screen.getByText(turkishLabels.cancel)).toBeInTheDocument();
  });

  test('displays error messages in Turkish', async () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Click edit button to enter edit mode
    const editButton = screen.getByText(turkishLabels.editProfile);
    fireEvent.click(editButton);
    
    // Clear required field
    const firstNameInput = screen.getAllByLabelText(turkishLabels.firstName)[0];
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.blur(firstNameInput);
    
    // Check error message
    expect(screen.getByText(turkishLabels.requiredField)).toBeInTheDocument();
  });

  test('displays "only visible here" note in Turkish', () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Check the note text
    expect(screen.getByText(turkishLabels.onlyVisibleHere)).toBeInTheDocument();
  });

  test('displays success message in Turkish after saving', async () => {
    // Mock the API service to resolve immediately
    const ApiService = require('../../utils/ApiService').default;
    ApiService.updateUserProfile.mockResolvedValue(mockProfile);
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText(turkishLabels.editProfile);
    fireEvent.click(editButton);
    
    // Save changes
    const saveButton = screen.getByText(turkishLabels.saveProfile);
    fireEvent.click(saveButton);
    
    // Check success message
    expect(await screen.findByText(turkishLabels.profileSaved)).toBeInTheDocument();
  });

  test('displays loading state in Turkish', async () => {
    // Mock the API service to delay resolution
    const ApiService = require('../../utils/ApiService').default;
    ApiService.updateUserProfile.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockProfile), 100);
      });
    });
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText(turkishLabels.editProfile);
    fireEvent.click(editButton);
    
    // Save changes
    const saveButton = screen.getByText(turkishLabels.saveProfile);
    fireEvent.click(saveButton);
    
    // Check loading text
    expect(screen.getByText(turkishLabels.saving)).toBeInTheDocument();
  });
});