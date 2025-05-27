import { useState, useEffect } from "react";
import FilialCard from "./FilialCard"; // To'g'ri import
import axios from "axios";
import BackendURL from "../../BackendURL";
import "./Css/filial.grid.css";

const FilialGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [filials, setFilials] = useState([]);
  const [filialsWithDistance, setFilialsWithDistance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all filials
  useEffect(() => {
    const fetchFilials = async () => {
      try {
        const response = await axios.get(`${BackendURL}/filial/all`);
        setFilials(response.data);
        setFilialsWithDistance(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching filials:", err);
        setError("Failed to load filials");
        setLoading(false);
      }
    };

    fetchFilials();
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation && filials.length > 0) {
      const filialsWithDist = filials.map((filial) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(filial.lat.$numberDecimal || filial.lat),
          parseFloat(filial.lng.$numberDecimal || filial.lng)
        );
        return { ...filial, distance };
      });

      // Sort by distance
      filialsWithDist.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setFilialsWithDistance(filialsWithDist);
    }
  }, [userLocation, filials]);

  // Filter filials based on search term
  const filteredFilials = filialsWithDistance.filter(
    (filial) =>
      filial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filial.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading filials...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="filial-grid-container">
      <div className="filial-grid-header">
        <h1 className="filial-grid-title">Our Locations</h1>
        <div className="filial-grid-actions">
          <div className="search-container">
            <input
              placeholder="Search locations..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={getUserLocation} className="find-nearest-btn">
            Find Nearest
          </button>
        </div>
      </div>

      {filteredFilials.length > 0 ? (
        <div className="filial-cards-container">
          {filteredFilials.map((filial) => (
            <FilialCard key={filial._id} filial={filial} />
          ))}
        </div>
      ) : (
        <div className="no-filials-message">
          <p>No locations found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default FilialGrid;