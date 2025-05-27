import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackendURL from '../../BackendURL';
import Navbar from '../../Components/Sidebar/Navbar';
import Header from './Header';
import './Css/filial.detail.css';

const FilialDetail = () => {
  const { id } = useParams();
  const [filial, setFilial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilialDetails = async () => {
      try {
        const response = await axios.get(`${BackendURL}/filial/${id}`);
        console.log(response.data);
        
        setFilial(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching filial details:", err);
        setError("Failed to load filial details");
        setLoading(false);
      }
    };

    fetchFilialDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!filial) return <div className="error">Filial not found</div>;

  return (
    <div>
      <Navbar>
        <div className="main">
          <Header Title={filial.name} Address="Filials" />
          
          <div className="filial-detail-container">
            <div className="filial-header">
              {filial.photoUrl && (
                <div className="filial-image">
                  <img src={`${BackendURL}/${filial.photoUrl}`} alt={filial.name} />
                </div>
              )}
              <div className="filial-info">
                <h1>{filial.name}</h1>
                <p className="filial-address">
                  <i className="fi fi-rs-marker"></i> {filial.address}
                </p>
              </div>
            </div>
            
            <div className="filial-content">
              <div className="filial-contact">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> {filial.phoneNumber}</p>
                <p><strong>Email:</strong> {filial.email}</p>
              </div>
              
              <div className="filial-map">
                <h3>Location</h3>
                <iframe 
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d${filial.lng?.$numberDecimal || filial.lng}!3d${filial.lat?.$numberDecimal || filial.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzAzLjQiTiA2OcKwMTcnMDYuMSJF!5e0!3m2!1sen!2s!4v1621689531135!5m2!1sen!2s`} 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy">
                </iframe>
              </div>
            </div>
            
            <div className="filial-footer">
              <h3>Available Courses</h3>
              <div className="courses-list">
                {/* Bu yerga kurslar ma'lumotlari API dan keladi */}
                <p>Courses information will be available soon</p>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default FilialDetail;