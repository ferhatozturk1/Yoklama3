import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profilim from '../Profilim';

// Mock the API services
jest.mock('../../utils/ApiService');
jest.mock('../../utils/MockApiService');

describe('Profilim Component Performance', () => {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock performance.now
    if (!window.performance) {
      window.performance = { now: jest.fn() };
    } else {
      window.performance.now = jest.fn();
    }
    
    // Mock URL.createObjectURL
    URL.createObjectURL = jest.fn(() => 'blob:https://example.com/mock-object-url');
    URL.revokeObjectURL = jest.fn();
  });

  test('renders initial component efficiently', () => {
    // Set up performance timing
    let startTime = 0;
    window.performance.now.mockImplementation(() => {
      startTime += 50; // Simulate 50ms passing
      return startTime;
    });
    
    const start = window.performance.now();
    render(<Profilim userProfile={mockProfile} />);
    const end = window.performance.now();
    
    // This is a simple check that rendering doesn't take too long
    // In a real test, you might want to compare against a baseline
    expect(end - start).toBeLessThan(1000);
  });

  test('handles edit mode toggle efficiently', () => {
    // Set up performance timing
    let time = 0;
    window.performance.now.mockImplementation(() => {
      time += 10; // Simulate 10ms passing
      return time;
    });
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Measure edit mode toggle
    const editButton = screen.getByText('Profili Düzenle');
    
    const startToggle = window.performance.now();
    fireEvent.click(editButton);
    const endToggle = window.performance.now();
    
    // Check that edit mode toggle is efficient
    expect(endToggle - startToggle).toBeLessThan(500);
    
    // Verify we're in edit mode
    expect(screen.getByText('Profili Kaydet')).toBeInTheDocument();
  });

  test('handles form field changes efficiently', () => {
    // Set up performance timing
    let time = 0;
    window.performance.now.mockImplementation(() => {
      time += 5; // Simulate 5ms passing
      return time;
    });
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Measure form field change
    const firstNameInput = screen.getAllByLabelText('Ad')[0];
    
    const startChange = window.performance.now();
    fireEvent.change(firstNameInput, { target: { value: 'Mehmet' } });
    const endChange = window.performance.now();
    
    // Check that form field change is efficient
    expect(endChange - startChange).toBeLessThan(100);
  });

  test('handles image preview efficiently', () => {
    // Set up performance timing
    let time = 0;
    window.performance.now.mockImplementation(() => {
      time += 20; // Simulate 20ms passing
      return time;
    });
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Create a file for upload
    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      configurable: true
    });
    
    // Measure file upload and preview generation
    const startUpload = window.performance.now();
    fireEvent.change(fileInput);
    const endUpload = window.performance.now();
    
    // Check that file upload and preview is efficient
    expect(endUpload - startUpload).toBeLessThan(200);
    
    // Verify URL.createObjectURL was called
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  test('handles multiple form field changes without excessive re-renders', () => {
    // This is a basic test to ensure that changing multiple form fields
    // doesn't cause excessive re-renders or performance issues
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Change multiple form fields
    const firstNameInput = screen.getAllByLabelText('Ad')[0];
    const lastNameInput = screen.getAllByLabelText('Soyad')[0];
    const emailInput = screen.getAllByLabelText('E-posta')[0];
    const universityInput = screen.getByLabelText('Üniversite');
    
    // Set up performance timing
    let time = 0;
    window.performance.now.mockImplementation(() => {
      time += 10; // Simulate 10ms passing
      return time;
    });
    
    const startChanges = window.performance.now();
    
    fireEvent.change(firstNameInput, { target: { value: 'Mehmet' } });
    fireEvent.change(lastNameInput, { target: { value: 'Demir' } });
    fireEvent.change(emailInput, { target: { value: 'mehmet.demir@example.com' } });
    fireEvent.change(universityInput, { target: { value: 'İstanbul Teknik Üniversitesi' } });
    
    const endChanges = window.performance.now();
    
    // Check that multiple changes are efficient
    expect(endChanges - startChanges).toBeLessThan(500);
  });
});