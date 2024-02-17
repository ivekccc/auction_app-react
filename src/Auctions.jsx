import React, { useState } from 'react';
import OneAuction from './OneAuction';
import './App.css';

function Auctions({ auctions, categories }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Funkcija za filtriranje aukcija po odabranoj kategoriji
    const filterAuctionsByCategory = (categoryId) => {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    };

    return (
      <div className="auctionsPage">
        <div className='auctionsPageTitle'>
          <h3>Theese are all auctions from database!</h3>
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
        <div className="auctionsPageContent">
          {auctions == null ? null : auctions
            .filter(auction => !selectedCategory || auction.category_id === selectedCategory)
            .map(auction => <OneAuction auction={auction} key={auction.id} />)
          }
        </div>
      </div>
    );
  }

  export default Auctions;
