import React, { useState, useEffect } from 'react';
import OneAuction from './OneAuction';
import './App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

function Auctions({ auctions, categories, logedUser, currency, exchangeRate }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expiredAuctions, setExpiredAuctions] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); // Added 'default' state for sorting
  const [currentActivePage, setCurrentActivePage] = useState(1);
  const [currentExpiredPage, setCurrentExpiredPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can change this number based on how many items you want per page

  // Function to filter auctions by selected category
  const filterAuctionsByCategory = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Function to delete an auction
  const deleteAuction = (auctionId) => {
    const token = sessionStorage.getItem('auth_token');
    axios.delete(`/api/delete-auction/${auctionId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Assuming you have a token in some context or state
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

  // Function to update expired and active auctions
  const updateAuctions = () => {
    if (auctions) {
      const now = new Date().getTime();
      const expired = auctions.filter(auction => new Date(auction.end).getTime() < now);
      const active = auctions.filter(auction => new Date(auction.end).getTime() >= now);
      setExpiredAuctions(expired);
      setActiveAuctions(active);
    }
  };

  // Function to filter expired and active auctions
  useEffect(() => {
    updateAuctions();
    const interval = setInterval(updateAuctions, 60000); // Update every 60 seconds
    return () => clearInterval(interval); // Clear interval when component unmounts
  }, [auctions]);

  // Function to filter auctions by product name
  const filterAuctionsByName = (auctions, searchTerm) => {
    return auctions.filter(auction => auction.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  // Function to sort auctions by price
  const sortAuctionsByPrice = (auctions, order) => {
    if (order === 'default') {
      return auctions; // No sorting, return as is
    }
    return auctions.sort((a, b) => {
      if (order === 'asc') {
        return a.current_price - b.current_price;
      } else {
        return b.current_price - a.current_price;
      }
    });
  };

  const cycleSortOrder = () => {
    if (sortOrder === 'default') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('default');
    }
  };

  const filteredActiveAuctions = sortAuctionsByPrice(
    filterAuctionsByName(activeAuctions, searchTerm)
      .filter(auction => !selectedCategory || auction.category_id === selectedCategory),
    sortOrder
  );

  const filteredExpiredAuctions = sortAuctionsByPrice(
    filterAuctionsByName(expiredAuctions, searchTerm)
      .filter(auction => !selectedCategory || auction.category_id === selectedCategory),
    sortOrder
  );

  const getPaginatedAuctions = (auctions, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return auctions.slice(startIndex, endIndex);
  };

  const handleActivePageChange = (pageNumber) => {
    setCurrentActivePage(pageNumber);
  };

  const handleExpiredPageChange = (pageNumber) => {
    setCurrentExpiredPage(pageNumber);
  };

  const totalActivePages = Math.ceil(filteredActiveAuctions.length / itemsPerPage);
  const totalExpiredPages = Math.ceil(filteredExpiredAuctions.length / itemsPerPage);

  const paginatedActiveAuctions = getPaginatedAuctions(filteredActiveAuctions, currentActivePage, itemsPerPage);
  const paginatedExpiredAuctions = getPaginatedAuctions(filteredExpiredAuctions, currentExpiredPage, itemsPerPage);

  return (
    <div className="auctionsPage">
      <div className='auctionsPageTitle'>
        <h3>These are all auctions from the database!</h3>
      </div>
      <div className="searchBar">
        <input
          className='searchBarInput'
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="sortButtons">
        <button className="sortButton" onClick={cycleSortOrder}>
          Sort by price:
          {sortOrder === 'default' ? 'Default' : sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
          <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : sortOrder === 'desc' ? faArrowDown : null} />
        </button>
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
        {paginatedActiveAuctions == null || paginatedActiveAuctions.length === 0 ? (
          <p>No active auctions</p>
        ) : (
          paginatedActiveAuctions.map(auction => (
            <div key={auction.id}>
              <OneAuction auction={auction} logedUser={logedUser} isActive={true} currency={currency} exchangeRate={exchangeRate} />
            </div>
          ))
        )}
      </div>
      <div className="paginationControls">
        {[...Array(totalActivePages)].map((_, index) => (
          <button
            className={`paginationButton ${currentActivePage === index + 1 ? 'activePaginationButton' : ''}`}
            key={index + 1}
            onClick={() => handleActivePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <h1>Expired Auctions</h1>
      <div className="expiredAuctions">
        {paginatedExpiredAuctions.length > 0 ? paginatedExpiredAuctions.map(auction => (
          <div key={auction.id}>
            <OneAuction auction={auction} logedUser={logedUser} isActive={false} currency={currency} exchangeRate={exchangeRate} />
          </div>
        )) : <p>No expired auctions</p>}
      </div>
      <div className="paginationControls">
        {[...Array(totalExpiredPages)].map((_, index) => (
          <button
            className={`paginationButton ${currentExpiredPage === index + 1 ? 'activePaginationButton' : ''}`}
            key={index + 1}
            onClick={() => handleExpiredPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Auctions;
