import React from 'react'
import OneAuction from './OneAuction';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

function Auctions({ auctions }) {
    return (
        <div className="auctionsPage">
            <div className='auctionsPageTitle'>
                <h3>Theese are all auctions from database!</h3>
            </div>
            <div className="auctionsPageContent">
                {
                    auctions == null ? <></> : auctions.map((auction) => (
                        <OneAuction auction={auction} key={auction.id} />
                    ))
                }
            </div>
        </div>
    )
}

export default Auctions
