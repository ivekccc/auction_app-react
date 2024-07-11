import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import LoginPage from './LoginPage';
import Register from './Register';
import CreateAuction from './CreateAuction';
import Auctions from './Auctions';
import AuctionDetails from './AuctionDetails';
import DepositPage from './DepositPage';
import ProfilePage from './ProfilePage';
import MyAuctionsPage from './MyAuctionsPage';
import MyPurchasesPage from './MyPurchasesPage';

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('auth_token'));
  const [userData, setUserData] = useState(() => JSON.parse(sessionStorage.getItem('user')));
  const [auctions, setAuctions] = useState(null);
  const [categories, setCategories] = useState(null);
  const [logedUser, setLogedUser] = useState({
    name: '', username: '', email: '', phone_number: '', balance: 0
  });
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    if (currency !== 'USD') {
      axios.get(`https://api.exchangerate-api.com/v4/latest/USD`)
        .then((response) => {
          const rate = response.data.rates[currency];
          setExchangeRate(rate);
        })
        .catch((error) => {
          console.error("There was an error fetching the exchange rate!", error);
        });
    } else {
      setExchangeRate(1);
    }
  }, [currency]);

  useEffect(() => {
    if (token) {
      LogedUser();
    }
  }, [token]);

  const LogedUser = async () => {
    try {
      const response = await axios.get('/api/profile', {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      setLogedUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    let url = isLoggedIn() ? '/api/allAuctions' : '/api/allAuctionsUnprotected';
    if (!auctions) {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };

      axios.request(config)
        .then((response) => {
          setAuctions(response.data.auctions);
        })
        .catch((error) => {
          console.log(error);
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
        <NavBar token={token} userData={userData} logedUser={logedUser} currency={currency} setCurrency={setCurrency} exchangeRate={exchangeRate} />
        <Routes>
          <Route path="/" element={<Auctions auctions={auctions} categories={categories} logedUser={logedUser} currency={currency} exchangeRate={exchangeRate} />} />
          <Route exact path="/create_auction" element={isLoggedIn() ? <CreateAuction categories={categories} currency={currency} exchangeRate={exchangeRate} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage addToken={addToken} addUser={addUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/deposit" element={<DepositPage token={token} logedUser={logedUser} setLogedUser={setLogedUser} currency={currency} exchangeRate={exchangeRate} />} />
          <Route path="profile" element={<ProfilePage logedUser={logedUser} setLogedUser={setLogedUser} token={token} currency={currency} exchangeRate={exchangeRate} />}></Route>
          <Route path="/myauctions" element={<MyAuctionsPage token={token} currency={currency} exchangeRate={exchangeRate} />} />
          <Route path="/mypurchases" element={<MyPurchasesPage token={token} currency={currency} exchangeRate={exchangeRate} />} />
          <Route path="/auction/:id" element={<AuctionDetails categories={categories} token={token} userData={userData} currency={currency} exchangeRate={exchangeRate} />} />
        </Routes>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
