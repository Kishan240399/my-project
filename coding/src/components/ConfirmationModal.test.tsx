import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
  // Test case 1: The modal should render when isOpen is true
  test('renders modal when isOpen is true', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    
    render(<ConfirmationModal isOpen={true} onConfirm={onConfirm} onCancel={onCancel} />);
    
    // Check if the modal content is visible
    expect(screen.getByText(/Are you sure you want to delete this ambulance?/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm/i)).toBeInTheDocument();
  });

  // Test case 2: The modal should not render when isOpen is false
  test('does not render modal when isOpen is false', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    
    render(<ConfirmationModal isOpen={false} onConfirm={onConfirm} onCancel={onCancel} />);
    
    // Modal should not be in the document
    expect(screen.queryByText(/Are you sure you want to delete this ambulance?/i)).not.toBeInTheDocument();
  });

  // Test case 3: The "Cancel" button should trigger the onCancel function
  test('calls onCancel when cancel button is clicked', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    
    render(<ConfirmationModal isOpen={true} onConfirm={onConfirm} onCancel={onCancel} />);
    
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);
    
    // Check if onCancel function is called
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  // Test case 4: The "Confirm" button should trigger the onConfirm function
  test('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    
    render(<ConfirmationModal isOpen={true} onConfirm={onConfirm} onCancel={onCancel} />);
    
    const confirmButton = screen.getByText(/Confirm/i);
    fireEvent.click(confirmButton);
    
    // Check if onConfirm function is called
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
