import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './NavBar';
import LoginPage from './LoginPage';
import Register from './Register';
import CreateAuction from './CreateAuction';
import Auctions from './Auctions';

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('auth_token'));
  const [userData, setUserData] = useState(() => JSON.parse(sessionStorage.getItem("user")));
  const [auctions, setAuctions] = useState();
  const [categories, setCategories] = useState();

  useEffect(() => {
    if (!auctions) {
      axios.get("api/allAuctions").then((res) => {
        console.log(res.data);
        setAuctions(res.data.auctions);
      });
    }
  }, [auctions]);

  useEffect(() => {
    if (!categories) {
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
    return token;
  }

  return (
    <BrowserRouter>
      <NavBar token={token} userData={userData} />
      <Routes>
        <Route path="/" element={<Auctions auctions={auctions} categories={categories} />} />
        <Route exact path="/create_auction" element={isLoggedIn() ? <CreateAuction categories={categories} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage addToken={addToken} addUser={addUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;