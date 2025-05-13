import {
  FiPlay,
  FiArrowRight,
  FiAward,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi";
import "./Css/hero.css";
import Lottie from "lottie-react";
import EduLottieImg from "../../Assets/edu-lottie.json";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          {/* Text Content - Left Side */}
          <div className="hero-text-content">
            <h1 className="hero-title">
              <span className="hero-title-highlight">Professional</span>{" "}
              Education Platform
            </h1>

            <p className="hero-description">
              Advance your career and learn new skills. Take your professional
              journey to the next level with our expert-designed courses.
            </p>

            <div className="hero-buttons">
              <button className="primary-button">
                View Courses <FiArrowRight className="button-icon-right" />
              </button>

              <button className="secondary-button">
                <FiPlay className="button-icon-left" /> Watch Video
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon-container stat-icon-yellow">
                  <FiAward className="stat-icon" />
                </div>
                <div className="stat-text">
                  <h3 className="stat-number">200+</h3>
                  <p className="stat-label">Certified Courses</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon-container stat-icon-orange">
                  <FiUsers className="stat-icon" />
                </div>
                <div className="stat-text">
                  <h3 className="stat-number">10,000+</h3>
                  <p className="stat-label">Successful Students</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon-container stat-icon-blue">
                  <FiBookOpen className="stat-icon" />
                </div>
                <div className="stat-text">
                  <h3 className="stat-number">50+</h3>
                  <p className="stat-label">Expert Instructors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Content - Right Side */}
          <div className="hero-image-content">
            <div className="image-container">
              <Lottie
                animationData={EduLottieImg}
                loop={true}
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
