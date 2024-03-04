import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyAuctionsPage({token}) {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'api/myauctions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +token
      }
    };

    axios.request(config)
    .then((response) => {
      console.log(response);
      setAuctions(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);
  return (
    <div className="myauctions-page-container">
      <h2 className="myauctions-page-title">My Auctions</h2>
      <div className="myauctions-list">
        {auctions.map(auction => (
          <div key={auction.id} className="myauction-card">
            {auction.image_path && (
              <img src={auction.image_path} alt={auction.product_name} className="myauction-image" />
            )}
            <div className="myauction-details">
              <h3 className="myauction-title">{auction.product_name}</h3>
              <p className="myauction-description">{auction.description}</p>
              <p className="myauction-price">Current Price: ${auction.current_price}</p>
              <p className="myauction-start">Starts: {new Date(auction.start).toLocaleString()}</p>
              <p className="myauction-end">Ends: {new Date(auction.end).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAuctionsPage;
