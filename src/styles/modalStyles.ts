import { CSSProperties } from 'react';

interface ModalStyles {
  overlay: CSSProperties;
  content: CSSProperties;
  header: CSSProperties;
  contentArea: CSSProperties;
  formGroup: CSSProperties;
  label: CSSProperties;
  input: CSSProperties;
  footer: CSSProperties;
  closeButton: CSSProperties;
  saveButton: (hasChanges: boolean) => CSSProperties;
  jsonPreview: CSSProperties;
  markdownContainer: CSSProperties;
}

export const modalStyles: ModalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexShrink: 0,
  },
  contentArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#666',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'right',
    flexShrink: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  saveButton: (hasChanges: boolean) => ({
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: hasChanges ? 'pointer' : 'not-allowed',
    opacity: hasChanges ? 1 : 0.5,
  }),
  jsonPreview: {
    marginTop: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    padding: '15px',
  },
  markdownContainer: {
    overflow: 'auto',
    flex: 1,
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
}; 