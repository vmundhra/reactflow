import React, { useState } from 'react';
import { timezones } from '../utils/timezones';

interface Timezone {
  name: string;
  offset: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimezoneChange: (timezone: string) => void;
  currentTimezone: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onTimezoneChange, currentTimezone }) => {
  const [selectedTimezone, setSelectedTimezone] = useState(currentTimezone);

  const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimezone(event.target.value);
  };

  const handleSave = () => {
    onTimezoneChange(selectedTimezone);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
      }}>
        <h2>Settings</h2>
        <div style={{ marginBottom: '20px' }}>
          <label>Timezone:</label>
          <select value={selectedTimezone} onChange={handleTimezoneChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            {timezones.map((tz: Timezone) => (
              <option key={tz.name} value={tz.name}>{`${tz.name} (UTC${tz.offset})`}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSave} style={{
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Save
        </button>
        <button onClick={onClose} style={{
          marginLeft: '10px',
          padding: '10px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}; 