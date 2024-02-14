// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import ikonica from "./img/ikonica-removebg-preview.png"
import userIcon from "./img/Sample_User_Icon-removebg-preview.png"
import axios from 'axios';

function NavBar({ token, userData }) {
    function handleLogout() {
        let config = {
            method: 'post',
            url: 'api/logout',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                window.sessionStorage.removeItem("auth_token");
                window.sessionStorage.removeItem("user");
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }
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
                {token == null ? (
                    <Link to="/login" className='login'>
                        Login
                    </Link>) :
                    (
                        <>
                            {userData.name}
                            <a onClick={handleLogout}>
                                Logout
                            </a></>)
                }

            </div>
        </div>
    );
}

export default NavBar;
