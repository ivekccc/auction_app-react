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

  function isLoggedIn() {
    return !!sessionStorage.getItem('auth_token'); // Provjeravamo da li postoji auth_token u sessionStorage-u
  }

  return (
    <BrowserRouter className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Auctions auctions={auctions} />} />
        <Route exact path="/create_auction" element={isLoggedIn() ? <CreateAuction /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
