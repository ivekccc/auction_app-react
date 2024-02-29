import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [userData, setUserData] = useState({
    "username": "",
    "name": "",
    "email": "",
    "password": "",
    "phone_number": ""
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post("/api/register", userData)
      .then((res) => {
        console.log(res.data);
        setRegistrationSuccess(true);
        setNotificationMessage("Registration successful! Redirecting to login page...");
        setShowNotification(true);
        setRegistrationError("");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Preusmerava na /login nakon 2 sekunde
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const responseData = error.response.data;
          let errorMessages = [];

          if (responseData.username) {
            errorMessages.push(responseData.username[0]);
          }
          if (responseData.name) {
            errorMessages.push(responseData.name[0]);
          }
          if (responseData.email) {
            errorMessages.push(responseData.email[0]);
          }
          if (responseData.password) {
            errorMessages.push(responseData.password[0]);
          }
          if (responseData.phone_number) {
            errorMessages.push(responseData.phone_number[0]);
          }

          setRegistrationError(errorMessages.join(''));
        } else {
          setRegistrationError("Registration failed. Please try again.");
        }
        setRegistrationSuccess(false);
        setShowNotification(true);
        console.error(error);
      });
  };

  return (
    <section className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h2 className="login-title">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                className="form-control input-field"
                placeholder="Enter username"
                name="username"
                onInput={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control input-field"
                placeholder="Enter your name"
                name="name"
                onInput={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control input-field"
                placeholder="Enter your email"
                name="email"
                onInput={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control input-field"
                placeholder="Enter your password"
                name="password"
                onInput={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                className="form-control input-field"
                placeholder="Enter your phone number"
                name="phone_number"
                onInput={handleInput}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-login">
              Register
            </button>
          </form>
          {showNotification && registrationSuccess && (
            <div className="notification success">
              <p>{notificationMessage}</p>
            </div>
          )}
          {showNotification && !registrationSuccess && (
            <div className="notification error">
              <p>{registrationError}</p>
            </div>
          )}
          <p className="register-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
