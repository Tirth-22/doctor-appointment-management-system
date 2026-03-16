import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-medical-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:text-medical-50">
            <div className="w-8 h-8 bg-medical-50 text-medical-600 rounded-full flex items-center justify-center font-bold">
              D
            </div>
            <span>DoctorCare</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-medical-700 transition">
              Home
            </Link>
            <Link to="/doctors" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-medical-700 transition">
              Doctors
            </Link>
            {isAuthenticated && (
              <>
                {user?.role !== 'ADMIN' && (
                  <Link to="/appointments" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-medical-700 transition">
                    Appointments
                  </Link>
                )}
                {user?.role === 'DOCTOR' && (
                  <Link to="/doctor-profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-medical-700 transition">
                    My Profile
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-medical-700 transition">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-medical-700 hover:bg-medical-800 px-4 py-2 rounded-md transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="bg-medical-50 text-medical-600 px-4 py-2 rounded-md hover:bg-gray-100 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="border border-medical-50 px-4 py-2 rounded-md hover:bg-medical-700 transition font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-medical-700 transition">
              Home
            </Link>
            <Link to="/doctors" className="block px-3 py-2 rounded-md hover:bg-medical-700 transition">
              Doctors
            </Link>
            {isAuthenticated && (
              <>
                {user?.role !== 'ADMIN' && (
                  <Link to="/appointments" className="block px-3 py-2 rounded-md hover:bg-medical-700 transition">
                    Appointments
                  </Link>
                )}
                {user?.role === 'DOCTOR' && (
                  <Link to="/doctor-profile" className="block px-3 py-2 rounded-md hover:bg-medical-700 transition">
                    My Profile
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-medical-700 transition">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-medical-700 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block px-3 py-2 bg-medical-50 text-medical-600 rounded-md hover:bg-gray-100 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 border border-medical-50 rounded-md hover:bg-medical-700 transition font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
