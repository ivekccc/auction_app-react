// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import ikonica from "./img/ikonica-removebg-preview.png"
import userIcon from "./img/Sample_User_Icon-removebg-preview.png"

function NavBar({ loggedIn, userName, onLogout }) {
    return (
        <div className='navBar'>
            <Link to="/">Auction App</Link>
            <img src={ikonica} alt="ikonica" className='ikonica' />
            <h1 className='navBarH1'>Best Auction Site</h1>
            <div className="createAuctionLink">
                <a href="/create_auction">
                    Create New Auction!
                </a>
            </div>
            <div className='loginDiv'>
                {loggedIn ? (
                    <>
                        <img src={userIcon} alt="" className='userIcon' />
                        <span className='userName'>{userName}</span>
                        <button onClick={onLogout} className='logout'>Logout</button>
                    </>
                ) : (
                    <Link to="/login" className='login'>
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}

export default NavBar;
