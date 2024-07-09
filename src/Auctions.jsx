import React, { useState, useEffect } from 'react';
import OneAuction from './OneAuction';
import './App.css';
import axios from 'axios';

function Auctions({ auctions, categories }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expiredAuctions, setExpiredAuctions] = useState([]);
    const [activeAuctions, setActiveAuctions] = useState([]);

    // Funkcija za filtriranje aukcija po odabranoj kategoriji
    const filterAuctionsByCategory = (categoryId) => {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    };

    // Funkcija za brisanje aukcije
    const deleteAuction = (auctionId) => {
        const token = sessionStorage.getItem('auth_token');
        axios.delete(`/api/delete-auction/${auctionId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Pretpostavljam da imate token u nekom kontekstu ili stanju
            }
        })
        .then(response => {
            console.log("Auction deleted successfully", response);
            window.location.reload();
        })
        .catch(error => {
            console.error("There was an error deleting the auction!", error);
        });
    };

    // Funkcija za ažuriranje isteklih i aktivnih aukcija
    const updateAuctions = () => {
        if (auctions) {
            const now = new Date().getTime();
            const expired = auctions.filter(auction => new Date(auction.end).getTime() < now);
            const active = auctions.filter(auction => new Date(auction.end).getTime() >= now);
            setExpiredAuctions(expired);
            setActiveAuctions(active);
        }
    };

    // Funkcija za filtriranje isteklih i aktivnih aukcija
    useEffect(() => {
        updateAuctions();
        const interval = setInterval(updateAuctions, 60000); // Ažuriramo svakih 60 sekundi
        return () => clearInterval(interval); // Čistimo interval kada se komponenta demontira
    }, [auctions]);

    return (
      <div className="auctionsPage">
        <div className='auctionsPageTitle'>
          <h3>These are all auctions from the database!</h3>
        </div>
        <div className="categoryButtons">
          {categories && categories.length > 0 && categories.map(category => (
            <button
              key={category.id}
              className={selectedCategory === category.id ? 'activeCategory' : ''}
              onClick={() => filterAuctionsByCategory(category.id)}
            >
              {category.category_name}
            </button>
          ))}
        </div>
        <h1>Active Auctions</h1>
        <div className="auctionsPageContent">
          {activeAuctions == null || activeAuctions.length === 0 ? (
            <p>No active auctions</p>
          ) : (
            activeAuctions
            .filter(auction => !selectedCategory || auction.category_id === selectedCategory)
            .map(auction => (
                <div key={auction.id}>
                    <OneAuction auction={auction} />
                </div>
            ))
          )}
        </div>
        <h1>Expired Auctions</h1>
        <div className="expiredAuctions">

          {expiredAuctions.length > 0 ? expiredAuctions.map(auction => (
            <div key={auction.id}>
              <OneAuction auction={auction} />
              <button onClick={() => deleteAuction(auction.id)}>Delete</button>
            </div>
          )) : <p>No expired auctions</p>}
        </div>
      </div>
    );
  }

  export default Auctions;