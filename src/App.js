import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';
import OneAuction from './OneAuction';
import Auctions from './Auctions';
import OneAuctionPage from './OneAuctionPage';
import CreateAuction from './CreateAuction';
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import Register from './Register';

function App() {
  const [token, setToken] = useState(() => {
    // Initialize token from sessionStorage on component mount
    return sessionStorage.getItem('auth_token');
  });
  useEffect(() => {
    // Store token in sessionStorage whenever it changes
    if (token) {
      sessionStorage.setItem('auth_token', token);
    } else {
      sessionStorage.removeItem('auth_token');
    }
  }, [token]);

  const [userData, setUserData] = useState(() => {
    return sessionStorage.getItem("user");
  });
  useEffect(() => {
    // Store token in sessionStorage whenever it changes
    if (userData) {
      sessionStorage.setItem('user', userData);
    } else {
      sessionStorage.removeItem('user');
    }
  }, [userData]);
  const [auctions, setAuctions] = useState();
  useEffect(() => {
    if (auctions == null) {
      axios.get("api/allAuctions").then((res) => {
        console.log(res.data);
        setAuctions(res.data.auctions);
      });
    }
  }, [auctions]);

  const [categories, setCategories] = useState();
  useEffect(() => {
    if (categories == null) {
      axios.get("api/categories").then((res) => {
        console.log(res.data);
        setCategories(res.data.categories);
      });
    }
  }, [categories]);

  function addToken(auth_token) {
    setToken(auth_token);
  }
  function addUser(userData) {
    setUserData(userData);
  }

  function isLoggedIn() {
    return sessionStorage.getItem('auth_token'); // Provjeravamo da li postoji auth_token u sessionStorage-u
  }

  return (
    <BrowserRouter className="App">
      <NavBar token={token} userData={userData} />
      <Routes>
        <Route path="/" element={<Auctions auctions={auctions} />} />
        <Route exact path="/create_auction" element={isLoggedIn() ? <CreateAuction /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage addToken={addToken} addUser={addUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
