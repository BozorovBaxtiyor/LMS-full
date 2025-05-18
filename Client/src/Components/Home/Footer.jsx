import "./Css/footer.css";
import { FaFacebook, FaYoutube, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1 - About */}
          <div className="footer-column">
            <h3 className="footer-title">LMS Platform</h3>
            <p className="footer-about">
              Empowering learners with high-quality education and innovative
              learning solutions.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaYoutube />
              </a>
              <a href="#" className="social-link">
                <FaLinkedin />
              </a>
              <a href="#" className="social-link">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Instructors
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Categories */}
          <div className="footer-column">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Data Science
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Business
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Design
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Marketing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="footer-column">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Education St, Learning City</span>
              </li>
              <li className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <span>+1 (234) 567-890</span>
              </li>
              <li className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@lmsplatform.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#" className="legal-link">
              Privacy Policy
            </a>
            <a href="#" className="legal-link">
              Terms of Service
            </a>
            <a href="#" className="legal-link">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
