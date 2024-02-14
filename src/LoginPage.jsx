import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ addToken, addUser }) {
  let navigate = useNavigate();
  const [userData, setUserData] = useState(
    {
      "email": "",
      "password": "",
    }
  );
  function handleInput(e) {
    let newUserData = userData;
    newUserData[e.target.name] = e.target.value;
    setUserData(newUserData);
  }
  function handleLogin(e) {
    e.preventDefault();
    axios.post("/api/login", userData).then((res) => {
      console.log(res.data);
      if (res.data.success === true) {
        window.sessionStorage.setItem("auth_token", res.data.access_token);
        window.sessionStorage.setItem("user", JSON.stringify(res.data.user));
        addToken(res.data.access_token);
        addUser(res.data.user);
        navigate("/");

      }
    }).catch((e) => {
      console.log(e);
    });
  }
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
          <p className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage
