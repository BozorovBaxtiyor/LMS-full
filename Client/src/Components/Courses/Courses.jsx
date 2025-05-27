import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Css/Courses.css'; // Ensure you have the correct path to your CSS file
import BackendURL from '../../BackendURL';
import { Header } from '../Home';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BackendURL}/subject/all`);
      setCourses(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Header />
    <div className="courses-page">
      <h1>Available Courses</h1>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <img
                src={course.photoUrl ? `${BackendURL}/images/${course.photoUrl}` : '/default-course.jpg'}
                alt={course.name || 'Course image'}
                onError={(e) => {
                    e.target.onerror = null; // Infinite loopdan saqlanish
                    e.target.src = '../../../../icons/openart-image_CzrspGuv_1748344864075_raw.jpg'; // Default rasm yo‘li
                }}
            />
            <div className="course-content">
              <h3>{course.name}</h3>
              {/* <p>{course.description}</p> */}
              <div className="course-meta">
              <div className="price">
                <span>{course.price.toLocaleString()}</span>
                <span>UZS</span>
              </div>
                <span className="duration">
                  {course.startDate ? new Date(course.startDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : 'N/A'} - 
                  {course.endDate ? new Date(course.endDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <Link to={`/course/${course._id}`} className="view-button">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Courses;