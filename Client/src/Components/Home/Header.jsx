import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiBook, FiChevronDown, FiSearch } from "react-icons/fi";
import "./Css/header.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import BackendURL from "../../BackendURL";
import FilialModal from "./FilialModal"; // Assuming you have a FilialModal component


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilial, setSelectedFilial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nearestFilials, setNearestFilials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const location =  useLocation();

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

  const findNearestFilials = () => {
    setIsLoading(true);

    // Get user's current position41.352428, 69.288300
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          
          // Make API request to backend
          axios.post(`${BackendURL || ''}/filial/nearest`, {
            lat: 41.352428 || position.coords.latitude,
            lng: 69.288300 || position.coords.longitude
          })
          .then(response => {
            console.log("Nearest filials:", response.data);
            const filialData = Array.isArray(response.data) ? response.data : 
                     (response.data.filials ? response.data.filials : []);
                    
            console.log("Filial data:", filialData);
                     
            setNearestFilials(filialData);
            setIsDropdownOpen(true);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error fetching nearest filials:", error);
            setIsLoading(false);
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default coordinates if geolocation is denied or unavailable
          axios.post(`${BackendURL || ''}/filial/nearest`, {
            lat: 41.377239,
            lng: 69.285010
          })
          .then(response => {
            console.log("Nearest filials:", response.data);
            const filialData = Array.isArray(response.data) ? response.data : 
                     (response.data.filials ? response.data.filials : []);
                    
            console.log("Filial data:", filialData);
            
            setNearestFilials(filialData);
            setIsDropdownOpen(true);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error fetching nearest filials:", error);
            setIsLoading(false);
          });
        }
      );
    } else {
      // Use default coordinates if geolocation is not supported
      axios.post(`${BackendURL || ''}/filial/nearest`, {
        lat: 41.377239,
        lng: 69.285010
      })
      .then(response => {
        console.log("Nearest filials:", response.data);
        const filialData = Array.isArray(response.data) ? response.data : 
                 (response.data.filials ? response.data.filials : []);
                
        console.log("Filial data:", filialData);
        
        setNearestFilials(filialData);
        setIsDropdownOpen(true);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching nearest filials:", error);
        setIsLoading(false);
      });
    }
  };

  const handleFilialClick = (filial) => {
    setSelectedFilial(filial);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFilial(null);
  };

  const toggleDropdown = () => {
    if(!isDropdownOpen){
      findNearestFilials();
    }else{
      setIsDropdownOpen(!isDropdownOpen);
    }
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
                Edu Flow
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`}
            >
              Courses
            </Link>
            <Link 
              to="/instructors" 
              className={`nav-link ${location.pathname === '/instructors' ? 'active' : ''}`}
            >
              Instructors
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
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
                onClick={findNearestFilials}
                className="dropdown-button"
              >
                {isLoading ? "Loading..." : "Nearest"}
                <FiChevronDown
                  className={`dropdown-chevron ${
                    isDropdownOpen ? "dropdown-chevron-open" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-items">
                    {nearestFilials && nearestFilials.length > 0 ? (
                      nearestFilials.map((filial) => (
                        <div
                          key={filial._id}
                          className="dropdown-item"
                          onClick={() => handleFilialClick(filial)}
                          style={{ cursor: "pointer" }}
                        >
                          <div><strong>{filial.name}</strong></div>
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            {filial.address || "No address"} <br />
                            {typeof filial.distance === 'number' ? filial.distance.toFixed(2) : '0.00'} km
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="dropdown-item">No filials found</span>
                    )}
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
                {isLoading ? "Loading..." : "Nearest"}
                <FiChevronDown
                  className={`mobile-dropdown-chevron ${
                    isDropdownOpen ? "mobile-dropdown-chevron-open" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="mobile-dropdown-items">
                  {nearestFilials && nearestFilials.length > 0 ? (
                    nearestFilials.map((filial) => (
                      <a 
                        key={filial._id} 
                        href={`/filial/${filial._id}`} 
                        className="mobile-dropdown-item"
                      >
                        {filial.name} ({typeof filial.distance === 'number' ? filial.distance.toFixed(2) : '0.00'} km)
                      </a>
                    ))
                  ) : (
                    <span className="mobile-dropdown-item">No filials found</span>
                  )}
                </div>
              )}
              <Link to="/login" className="mobile-signin-button">
                <FiUser className="mobile-signin-icon" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && selectedFilial && (
        <FilialModal 
          filial={selectedFilial} 
          onClose={closeModal}
        />
      )}
    </header>
  );
};

export default Header;