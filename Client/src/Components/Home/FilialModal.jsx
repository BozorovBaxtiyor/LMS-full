import PropTypes from 'prop-types';
import './Css/filialModal.css';
import BackendURL from '../../BackendURL';
const FilialModal = ({ filial, onClose }) => {

    if (!filial) return null;
    const lat = Number(filial.lat.$numberDecimal);
    const lng = Number(filial.lng.$numberDecimal);
    console.log(lat  , lng);
    console.log(filial);
    
    
  
    return (
      <div className="filial-modal-overlay" onClick={onClose}>
        <div className="filial-modal" onClick={e => e.stopPropagation()}>
          <div className="filial-header">
            <div className="filial-image">
            <img
                src={BackendURL + '/images/' + filial.photoUrl}
                alt={filial.name}
                onError={(e) => {
                    e.target.onerror = null; // infinite loopdan saqlanish
                    e.target.src = '../../../../icons/image.png'; // default image yo‘li
                }}
            />
            </div>
            <div className="filial-info">
              <h1>{filial.name}</h1>
              <div className="filial-address">
                <i className="fas fa-map-marker-alt"></i>
                <span>{filial.address || 'Address not available'}</span>
              </div>
              <p>{filial.description || 'This branch is part of our comprehensive Learning Management System, designed to deliver high-quality education and training at a local level. It serves as a dedicated center for students, instructors, and administrators, offering access to all courses, schedules, resources, and academic support.'}</p>
            </div>
          </div>
  
          <div className="filial-content">
            <div className="filial-contact">
              <h3>Contact Information</h3>
              <p><strong>Phone:</strong> {filial.phoneNumber || 'Not available'}</p>
              <p><strong>Email:</strong> {filial.email || 'Not available'}</p>
              <p><strong>Working Hours:</strong> {filial.workingHours || '09:00 am - 05:00 pm'}</p>
            </div>
            
            <div className="filial-map">
                <h3>Location</h3>
                <div style={{
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                    <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                    allowFullScreen
                    title="Google Map"
                    ></iframe>
                </div>
            </div>

          </div>
  
          {/* <div className="filial-footer">
            <h3>Available Courses</h3>
            <div className="courses-list">
              {filial.courses?.length > 0 ? (
                filial.courses.map(course => (
                  <div key={course.id} className="course-item">
                    <h4>{course.name}</h4>
                    <p>{course.description}</p>
                  </div>
                ))
              ) : (
                <p>No courses available at this filial</p>
              )}
            </div>
          </div> */}
  
          <button 
            className="close-button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      </div>
    );
  };
  FilialModal.propTypes = {
    filial: PropTypes.shape({
      name: PropTypes.string,
      photoUrl: PropTypes.string,
      address: PropTypes.string,
      description: PropTypes.string,
      phoneNumber: PropTypes.string,
      email: PropTypes.string,
      workingHours: PropTypes.string,
      lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      courses: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string,
          description: PropTypes.string,
        })
      ),
    }),
    onClose: PropTypes.func.isRequired,
  };

  export default FilialModal;