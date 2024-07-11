import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ikonica from './img/ikonica-removebg-preview.png';

function NavBar({ token, userData, logedUser, currency, setCurrency, exchangeRate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userNameRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !userNameRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    window.location.reload();
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div className="navBar">
      <Link to="/">Auction App</Link>
      <img src={ikonica} alt="ikonica" className="ikonica" />
      <h1 className="navBarH1">Best Auction Site</h1>
      <div className="createAuctionLink">
        <a href="/create_auction">Create New Auction!</a>
      </div>
      <div className="currencySelector">
        <label htmlFor="currency">Currency:</label>
        <select name="currency" value={currency} onChange={handleCurrencyChange}>
          <option value="USD">USD</option>
          <option value="RSD">RSD</option>
          {/* Add other currency options here */}
        </select>
      </div>
      <div className="loginDiv">
        {token ? (
          <div className="userMenu">
            {logedUser && (
              <div className="userName" ref={userNameRef} onClick={() => setMenuOpen(!menuOpen)}>
                {logedUser.name} {logedUser.isAdmin ? 'Admin' : `${(logedUser.balance * exchangeRate).toFixed(2)} ${currency}`}
              </div>
            )}
            {menuOpen && (
              <div className="userDropdown" ref={dropdownRef}>
                {logedUser.isAdmin ? (
                  <>
                    <div className="dropdownItem"><a href="/profile">Profile</a></div>
                    <div className="dropdownItem" onClick={handleLogout}>Logout</div>
                  </>
                ) : (
                  <>
                    <div className="dropdownItem"><a href="/deposit">Deposit</a></div>
                    <div className="dropdownItem"><a href="/profile">Profile</a></div>
                    <div className="dropdownItem"><a href="/myauctions">My Auctions</a></div>
                    <div className="dropdownItem"><a href="/mypurchases">My Purchases</a></div>
                    <div className="dropdownItem" onClick={handleLogout}>Logout</div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
