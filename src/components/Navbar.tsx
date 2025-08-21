import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Don't show navbar on auth pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <h2>TrackIt</h2>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <a href="#features" className="navbar-link">Features</a>
          <a href="#pricing" className="navbar-link">Pricing</a>
          <a href="#support" className="navbar-link">Support</a>
        </div>

        {/* CTA Buttons */}
        <div className="navbar-cta">
          {user ? (
            <>
              <span className="user-greeting">Hola, {user.name}</span>
              <Link to="/dashboard" className="btn-dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Log In</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
        </div>
      </div>

              {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#pricing" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Pricing</a>
          <a href="#support" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Support</a>
          <div className="mobile-cta">
            {user ? (
              <>
                <span className="mobile-user-greeting">Hola, {user.name}</span>
                <Link to="/dashboard" className="btn-dashboard mobile">Dashboard</Link>
                <button onClick={handleLogout} className="btn-logout mobile">Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login mobile">Log In</Link>
                <Link to="/signup" className="btn-signup mobile">Sign Up</Link>
              </>
            )}
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
