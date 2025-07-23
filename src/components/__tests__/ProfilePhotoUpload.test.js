import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePhotoUpload from '../ProfilePhotoUpload';

describe('ProfilePhotoUpload Component', () => {
  const mockPhotoUrl = 'https://example.com/photo.jpg';
  const mockOnPhotoChange = jest.fn();
  const mockOnPhotoRemove = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with current photo', () => {
    render(
      <ProfilePhotoUpload
        currentPhoto={mockPhotoUrl}
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
      />
    );
    
    const avatar = screen.getByRole('img', { name: /profil fotoğrafı/i });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockPhotoUrl);
  });
  
  test('renders without photo', () => {
    render(
      <ProfilePhotoUpload
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
      />
    );
    
    const avatar = screen.getByRole('img', { name: /profil fotoğrafı/i });
    expect(avatar).toBeInTheDocument();
    expect(avatar).not.toHaveAttribute('src', expect.stringContaining('http'));
  });
  
  test('shows upload button', () => {
    render(
      <ProfilePhotoUpload
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
      />
    );
    
    const uploadButton = screen.getByRole('button', { name: /fotoğraf yükle/i });
    expect(uploadButton).toBeInTheDocument();
  });
  
  test('shows change and remove buttons when photo exists', () => {
    render(
      <ProfilePhotoUpload
        currentPhoto={mockPhotoUrl}
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
      />
    );
    
    const changeButton = screen.getByRole('button', { name: /fotoğrafı değiştir/i });
    expect(changeButton).toBeInTheDocument();
    
    const removeButton = screen.getByRole('button', { name: /fotoğrafı kaldır/i });
    expect(removeButton).toBeInTheDocument();
  });
  
  test('calls onPhotoRemove when remove button is clicked', () => {
    render(
      <ProfilePhotoUpload
        currentPhoto={mockPhotoUrl}
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
      />
    );
    
    const removeButton = screen.getByRole('button', { name: /fotoğrafı kaldır/i });
    fireEvent.click(removeButton);
    
    expect(mockOnPhotoRemove).toHaveBeenCalledTimes(1);
  });
  
  test('validates file type', () => {
    render(
      <ProfilePhotoUpload
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
      />
    );
    
    // Create invalid file type
    const file = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true
    });
    
    fireEvent.change(input);
    
    // Check for error message
    expect(screen.getByText(/geçersiz dosya türü/i)).toBeInTheDocument();
    expect(mockOnPhotoChange).not.toHaveBeenCalled();
  });
  
  test('validates file size', () => {
    render(
      <ProfilePhotoUpload
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
        maxSize={1} // 1MB max
      />
    );
    
    // Create file that's too large (mock 2MB)
    const twoMB = 2 * 1024 * 1024;
    const largeContent = 'x'.repeat(twoMB);
    const file = new File([largeContent], 'large-image.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(file, 'size', {
      value: twoMB,
      configurable: true
    });
    
    const input = document.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true
    });
    
    fireEvent.change(input);
    
    // Check for error message
    expect(screen.getByText(/dosya boyutu çok büyük/i)).toBeInTheDocument();
    expect(mockOnPhotoChange).not.toHaveBeenCalled();
  });
  
  test('accepts valid image file', () => {
    // Mock URL.createObjectURL
    const mockObjectUrl = 'blob:https://example.com/mock-object-url';
    URL.createObjectURL = jest.fn(() => mockObjectUrl);
    
    render(
      <ProfilePhotoUpload
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
      />
    );
    
    // Create valid file
    const file = new File(['dummy content'], 'image.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true
    });
    
    fireEvent.change(input);
    
    // Should call onPhotoChange with file and preview URL
    expect(mockOnPhotoChange).toHaveBeenCalledWith(file, mockObjectUrl);
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });
  
  test('is disabled when disabled prop is true', () => {
    render(
      <ProfilePhotoUpload
        currentPhoto={mockPhotoUrl}
        onPhotoChange={mockOnPhotoChange}
        onPhotoRemove={mockOnPhotoRemove}
        disabled={true}
      />
    );
    
    const uploadButton = screen.getByRole('button', { name: /fotoğrafı değiştir/i });
    expect(uploadButton).toBeDisabled();
    
    const removeButton = screen.getByRole('button', { name: /fotoğrafı kaldır/i });
    expect(removeButton).toBeDisabled();
    
    const dropArea = screen.getByRole('button', { name: /fotoğrafı buraya sürükleyin/i });
    expect(dropArea).toHaveAttribute('tabIndex', '-1');
  });
});