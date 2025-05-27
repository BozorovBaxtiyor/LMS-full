import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCalendar, FiDollarSign, FiClock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import BackendURL from '../../BackendURL';
import './Css/CourseDetails.css';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      const response = await axios.get(`${BackendURL}/subject/${id}`);
      setCourse(response.data.subject);
      console.log(response.data);
      
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="course-detail"
    >
      <div className="course-header">
        <motion.div 
          className="course-image-large"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={course.photoUrl ? `${BackendURL}/images/${course.photoUrl}` : '/default-course.jpg'}
            alt={course.name || 'Course image'}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '../../../../icons/openart-image_CzrspGuv_1748344864075_raw.jpg';
            }}
          />
        </motion.div>
  
        <motion.div 
          className="course-info"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{course.name}</h1>
          <div className="meta-info">
            <div className="price-tag">
              <FiDollarSign className="icon" />
              <span className="price">{course.price.toLocaleString()} UZS</span>
            </div>
            
            <div className="course-details">
              <div className="detail-item">
                <FiCalendar className="icon" />
                <span>Start: {new Date(course.startDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <FiClock className="icon" />
                <span>End: {new Date(course.endDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <FiUser className="icon" />
                <span>Tutor: {course.tutor.name}</span>
              </div>
            </div>
  
            <motion.button 
              className="enroll-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enroll Now
            </motion.button>
          </div>
        </motion.div>
      </div>
  
      <motion.div 
        className="course-body"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="description-card">
          <h2>About this course</h2>
          <p>{course.description}</p>
        </div>
        
        <div className="info-sidebar">
          <div className="info-card">
            <h3>Course Features</h3>
            <ul>
              <li>Professional Instructor</li>
              <li>Flexible Schedule</li>
              <li>Certificate on Completion</li>
              <li>Online Support</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CourseDetail;