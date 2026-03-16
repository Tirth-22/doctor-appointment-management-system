import React from 'react';

export default function HomePageMinimal() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '20px' }}>
        Book Doctor Appointments
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        This is a minimal test page without Navbar or API calls.
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0284c7', marginBottom: '10px' }}>Expert Doctors</h3>
          <p style={{ color: '#666' }}>Verified professionals</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0284c7', marginBottom: '10px' }}>Easy Booking</h3>
          <p style={{ color: '#666' }}>Schedule anytime</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0284c7', marginBottom: '10px' }}>Quality Care</h3>
          <p style={{ color: '#666' }}>Professional service</p>
        </div>
      </div>
      <button 
        style={{
          marginTop: '40px',
          padding: '12px 30px',
          fontSize: '16px',
          backgroundColor: '#0284c7',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onClick={() => alert('Button clicked! System is working!')}
      >
        Get Started
      </button>
    </div>
  );
}
