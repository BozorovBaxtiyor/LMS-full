import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, studentLogin, tutorLogin } from "../../Redux/auth/action";
import { message, Spin } from "antd";
import { FiUser, FiLock, FiChevronDown } from "react-icons/fi";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((store) => store.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    email: "",
    password: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.type === "") {
      return messageApi.open({
        type: "error",
        content: "Please select user type.",
        duration: 3,
      });
    }
    setLoading(true);
    
    const loginActions = {
      admin: adminLogin,
      tutor: tutorLogin,
      student: studentLogin
    };
    
    dispatch(loginActions[formData.type](formData)).then((res) => {
      setLoading(false);
      if (res.message === "Wrong credentials") {
        messageApi.open({
          type: "error",
          content: "Wrong credentials!",
          duration: 3,
        });
      } else if (res.message === "Access Denied") {
        messageApi.open({
          type: "error",
          content: "Access revoked by admin!",
          duration: 3,
        });
      } else if (res.message === "Error" || res.message === "error") {
        messageApi.open({
          type: "error",
          content: "Something went wrong, please try again",
          duration: 3,
        });
      } else {
        navigate("/home");
      }
    });
  };

  if (auth.data.isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-container">
      {contextHolder}
      
      <div className="login-card">
        <div className="login-illustration">
          <img 
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-135.jpg" 
            alt="Login Illustration"
          />
          <div className="demo-credentials">
            <h4>Demo Credentials</h4>
            <p><strong>Email:</strong> test@gmail.com</p>
            <p><strong>Password:</strong> test</p>
          </div>
        </div>
        
        <div className="login-form">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please login to your account</p>
          </div>
          
          <form onSubmit={handleFormSubmit}>
            <div className="custom-select">
              <div 
                className="select-header"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {formData.type || "Select user type"}
                <FiChevronDown className={`dropdown-icon ${showDropdown ? "rotate" : ""}`} />
              </div>
              {showDropdown && (
                <div className="select-options">
                  <div 
                    className="option"
                    onClick={() => {
                      setFormData({...formData, type: "admin"});
                      setShowDropdown(false);
                    }}
                  >
                    Admin
                  </div>
                  <div 
                    className="option"
                    onClick={() => {
                      setFormData({...formData, type: "tutor"});
                      setShowDropdown(false);
                    }}
                  >
                    Tutor
                  </div>
                  <div 
                    className="option"
                    onClick={() => {
                      setFormData({...formData, type: "student"});
                      setShowDropdown(false);
                    }}
                  >
                    Student
                  </div>
                </div>
              )}
            </div>
            
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                type="email"
                placeholder="Enter email address"
              />
            </div>
            
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                required
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                type="password"
                placeholder="Enter password"
              />
            </div>
            
            <button type="submit" className="login-button">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      
      {loading && (
        <div className="loading-overlay">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default Login;