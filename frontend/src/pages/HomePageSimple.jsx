import React from 'react';

export default function HomePageSimple() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '32px', marginBottom: '20px' }}>Doctor Appointment System</h1>
      <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>Testing basic page render...</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}>
        Test Button
      </button>
    </div>
  );
}
