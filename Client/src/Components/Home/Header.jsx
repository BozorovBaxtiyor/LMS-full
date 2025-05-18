import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiBook, FiChevronDown, FiSearch } from "react-icons/fi";
import "./Css/header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo section */}
          <div className="logo-container">
            <a href="/" className="logo-link">
              <div className="logo-icon">
                <FiBook size={20} />
              </div>
              <span className="logo-text">
                LMS Platform
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="#" className="nav-link">
              Home
            </a>
            <a href="#" className="nav-link">
              Courses
            </a>
            <a href="#" className="nav-link">
              Instructors
            </a>
            <a href="#" className="nav-link">
              About
            </a>
            <a href="#" className="nav-link">
              Contact
            </a>
          </nav>

          {/* Search and User section */}
          <div className="user-section">
            <div className="search-container">
              <div className="search-icon">
                <FiSearch className="search-icon-svg" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="search-input"
              />
            </div>

            <div className="dropdown-container" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="dropdown-button"
              >
                Nearest
                <FiChevronDown
                  className={`dropdown-chevron ${
                    isDropdownOpen ? "dropdown-chevron-open" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-items">
                    <a href="#" className="dropdown-item">
                      New York
                    </a>
                    <a href="#" className="dropdown-item">
                      San Francisco
                    </a>
                    <a href="#" className="dropdown-item">
                      Chicago
                    </a>
                  </div>
                </div>
              )}
            </div>

            <Link to="/login" className="signin-button">
              <FiUser className="signin-icon" />
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-button">
            <button
              onClick={toggleMenu}
              className="menu-toggle-button"
            >
              {isMenuOpen ? (
                <FiX className="menu-icon" />
              ) : (
                <FiMenu className="menu-icon" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-links">
            <a href="#" className="mobile-nav-link">
              Home
            </a>
            <a href="#" className="mobile-nav-link">
              Courses
            </a>
            <a href="#" className="mobile-nav-link">
              Instructors
            </a>
            <a href="#" className="mobile-nav-link">
              About
            </a>
            <a href="#" className="mobile-nav-link">
              Contact
            </a>
          </div>
          <div className="mobile-nav-bottom">
            <div className="mobile-search-container">
              <div className="mobile-search-icon">
                <FiSearch className="mobile-search-icon-svg" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="mobile-search-input"
              />
            </div>
            <div className="mobile-dropdown-section">
              <button
                onClick={toggleDropdown}
                className="mobile-dropdown-button"
              >
                Nearest
                <FiChevronDown
                  className={`mobile-dropdown-chevron ${
                    isDropdownOpen ? "mobile-dropdown-chevron-open" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="mobile-dropdown-items">
                  <a href="#" className="mobile-dropdown-item">
                    New York
                  </a>
                  <a href="#" className="mobile-dropdown-item">
                    San Francisco
                  </a>
                  <a href="#" className="mobile-dropdown-item">
                    Chicago
                  </a>
                </div>
              )}
              <button className="mobile-signin-button">
                <FiUser className="mobile-signin-icon" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;