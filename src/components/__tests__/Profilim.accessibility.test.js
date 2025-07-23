import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Profilim from '../Profilim';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

describe('Profilim Component Accessibility', () => {
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

  test('should have no accessibility violations', async () => {
    const { container } = render(<Profilim userProfile={mockProfile} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper heading structure', () => {
    render(<Profilim userProfile={mockProfile} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Profilim');
  });

  test('should have accessible profile photo', () => {
    render(<Profilim userProfile={mockProfile} />);
    const avatar = screen.getByRole('img', { name: /profil fotoğrafı/i });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('alt');
  });

  test('should have proper form field accessibility attributes', () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /profili düzenle/i });
    fireEvent.click(editButton);
    
    // Check form fields for accessibility attributes
    const firstNameInput = screen.getByLabelText('Ad');
    expect(firstNameInput).toHaveAttribute('aria-required', 'true');
    
    const emailInput = screen.getByLabelText('E-posta');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should manage focus correctly when entering edit mode', () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /profili düzenle/i });
    fireEvent.click(editButton);
    
    // First field should be focused
    const firstNameInput = screen.getByLabelText('Ad');
    expect(document.activeElement).toBe(firstNameInput);
  });

  test('should have accessible buttons with proper labels', () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Check edit button
    const editButton = screen.getByRole('button', { name: /profili düzenle/i });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute('aria-label', 'Profili Düzenle');
    
    // Enter edit mode
    fireEvent.click(editButton);
    
    // Check save and cancel buttons
    const saveButton = screen.getByRole('button', { name: /profili kaydet/i });
    expect(saveButton).toBeInTheDocument();
    
    const cancelButton = screen.getByRole('button', { name: /iptal/i });
    expect(cancelButton).toBeInTheDocument();
  });

  test('should have accessible error messages', async () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /profili düzenle/i });
    fireEvent.click(editButton);
    
    // Clear required field
    const firstNameInput = screen.getByLabelText('Ad');
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.blur(firstNameInput);
    
    // Check error message
    const errorMessage = await screen.findByText('Bu alan zorunludur.');
    expect(errorMessage).toBeInTheDocument();
    expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
  });
});