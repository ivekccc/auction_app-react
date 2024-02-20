import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import LoginPage from './LoginPage';
import Register from './Register';
import CreateAuction from './CreateAuction';
import Auctions from './Auctions';
import AuctionDetails from './AuctionDetails';

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('auth_token'));
  const [userData, setUserData] = useState(() => JSON.parse(sessionStorage.getItem('user')));
  const [auctions, setAuctions] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    if (!auctions) {
      axios.get('api/allAuctions').then((res) => {
        setAuctions(res.data.auctions);
      });
    }
  }, [auctions]);

  useEffect(() => {
    if (!categories) {
      axios.get('api/categories').then((res) => {
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
      <React.Fragment>
        <NavBar token={token} userData={userData} />
        <Routes>
          <Route path="/" element={<Auctions auctions={auctions} categories={categories} />} />
          <Route
            exact
            path="/create_auction"
            element={isLoggedIn() ? <CreateAuction categories={categories} /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<LoginPage addToken={addToken} addUser={addUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auction/:id" element={<AuctionDetails categories={categories} token={token} userData={userData} />} />
        </Routes>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
