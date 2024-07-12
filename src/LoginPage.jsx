import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage({ addToken, addUser }) {
  let navigate = useNavigate();
  const [userData, setUserData] = useState({
    "email": "",
    "password": "",
  });
  const [loginMessage,setLoginMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post("/api/login", userData)
      .then((res) => {
        if (res.data.success === true) {
          window.sessionStorage.setItem("auth_token", res.data.access_token);
          window.sessionStorage.setItem("user", JSON.stringify(res.data.user));
          addToken(res.data.access_token);
          addUser(res.data.user);
          setLoginSuccess(true);
        setLoginMessage("Login successful! Redirecting to HomePage...");
          setShowNotification(true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setLoginSuccess(false);
        setLoginMessage("Login failed. Please try again.");
          setShowNotification(true);
        }
      })
      .catch((error) => {
        setLoginSuccess(false);
      setLoginMessage("Login failed. Please try again.");
        setShowNotification(true);
        console.error(error);
      });
  };

  return (
    <section className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="btn btn-primary btn-login">
              Login
            </button>
          </form>
          {/* Snackbar */}
          {showNotification && (
            <div className={`notification ${loginSuccess ? "success" : "error"}`}>
              <p>{loginMessage}</p>
            </div>
          )}
          <p className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
