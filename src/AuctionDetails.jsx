import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';

function AuctionDetails({ categories, token, userData }) {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [relatedAuctions, setRelatedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(userData ? userData.balance : 0); // Dodajemo proveru za userData
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [currentBidderName, setCurrentBidderName] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    // Dohvatanje podataka o trenutnoj aukciji
    axios.get(`api/auction/${id}`)
      .then(response => {
        setAuction(response.data.auctions);
        setLoading(false);
        calculateTimeRemaining(response.data.auctions.end); // Pokrenemo funkciju za računanje preostalog vremena
      })
      .catch(error => {
        setError(error.response ? error.response.data.message : 'Unknown error occurred');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Dohvatanje korisnika na osnovu user_id-a
    if (auction) {
      axios.get(`api/users/${auction.user_id}`)
        .then(response => {
          setUserName(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, [auction]);

  const fetchBidderName = () => {
    if (auction && auction.current_bidder !== null) {
      axios.get(`api/users/${auction.current_bidder}`)
        .then(response => {
          setCurrentBidderName(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching bidder data:', error);
        });
    } else {
      setCurrentBidderName("Currently no bids on this auction");
    }
  };

  useEffect(() => {
    fetchBidderName();
  }, [auction]);

  useEffect(() => {
    // Dohvatanje svih aukcija iz iste kategorije kao trenutna aukcija
    if (auction) {
      axios.get(`api/categories/${auction.category_id}/auctions`)
        .then(response => {
          setRelatedAuctions(response.data.auctions.filter(a => a.id !== auction.id));
        })
        .catch(error => {
          console.error('Error fetching related auctions:', error);
        });
    }
  }, [auction]);

  function handleBid() {
    let data = JSON.stringify({
      "auction_id": auction.id,
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'api/auctions/bid',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setUserBalance(response.data.new_balance);
        const updatedUserData = { ...userData, balance: response.data.new_balance };
        window.sessionStorage.setItem("user", JSON.stringify(updatedUserData));
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Funkcija koja računa preostalo vreme
  const calculateTimeRemaining = (endTime) => {
    const endTimeMillis = new Date(endTime).getTime();
    const nowMillis = new Date().getTime();
    const timeDiff = endTimeMillis - nowMillis;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
  };

  useEffect(() => {
    // Postavljanje intervala za ažuriranje preostalog vremena svake sekunde
    const interval = setInterval(() => {
      calculateTimeRemaining(auction.end);
    }, 1000);

    // Očisti interval kada se komponenta unmountuje
    return () => clearInterval(interval);
  }, [auction]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!auction) {
    return <div className="error">Auction not found</div>;
  }

  return (
    <div className="auction-details">
      <h1><strong>{auction.product_name}</strong></h1>
      <div className="auction-details-container">
        <div className="auction-details-image">
          <img src={auction.image_path} alt="Auction" />
          <p><strong>Description:</strong> {auction.description}</p>
        </div>
        <div className="auction-details-info">
          <div className="auction-details-text">
            <p><strong>Category:</strong> {categories && categories.find(category => category.id === auction.category_id)?.category_name}</p>
            <p><strong>Owner:</strong> {userName}</p>
            <p><strong>Start Price:</strong> ${auction.start_price}</p>
            <p><strong>Created At:</strong> {auction.start}</p>
            <div className="vertical-space"></div>
            <p><strong>Closing in:</strong> {timeRemaining && `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`}</p>
            <p><strong>Current Price:</strong> ${auction.current_price}</p>
            {currentBidderName !== null && (
              <p>
              <strong>Current Bidder:</strong>
              {userData ?
                (currentBidderName === userData.name ? "You are currently the highest bidder on this auction!" : currentBidderName)
                :
                currentBidderName
              }
            </p>
            )}
          </div>
          <button className="auction-details-bid-button" onClick={handleBid}>Bid Now</button>
        </div>
      </div>

      {/* Sekcija "You may also like" */}
      <div className="related-auctions">
        <h2>You may also like</h2>
        <div className="related-auctions-scroll">
          {relatedAuctions.map(relatedAuction => (
            <Link key={relatedAuction.id} to={`/auction/${relatedAuction.id}`} className="related-auction-card">
              <div className="related-auction-card">
                <img src={relatedAuction.image_path} alt="Related Auction" />
                <p>{relatedAuction.product_name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuctionDetails;
