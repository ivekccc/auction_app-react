import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsCheckCircleFill } from "react-icons/bs";
import { VscError } from "react-icons/vsc";


function MyAuctionsPage({ token }) {
  const [auctions, setAuctions] = useState([]);
  const [successfulPurchases, setSuccessfulPurchases] = useState([]);
  const [unsuccessfulPurchases, setUnsuccessfulPurchases] = useState([]);

  const getBuyer = async (buyer_id) => {
    try {
      const response = await axios.get(`api/users/${buyer_id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting buyer:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/myauctions', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        setAuctions(response.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/purchasesSuccessful', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await Promise.all(response.data.map(async (purchase) => {
          const buyer = await getBuyer(purchase.buyer_id);
          return {
            ...purchase,
            buyer_name: buyer ? buyer.name : '',
            buyer_phone: buyer ? buyer.phone_number : ''
          };
        }));
        setSuccessfulPurchases(data);
      } catch (error) {
        console.error('Error fetching successful purchases:', error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/purchasesUnsuccessful', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        setUnsuccessfulPurchases(response.data);
      } catch (error) {
        console.error('Error fetching unsuccessful purchases:', error);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div id="myAuctionsPage">
    <div className="myauctions-page-container">
      <h1 className="myauctions-page-title">My Ongoing Auctions</h1>
      <div className="myauctions-list">
        {/* Rendering auctions */}
      </div>

      <div className="table-container">
        <h2 className="table-title">Successful Auctions</h2>
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Product</th>
              <th className="table-header">Auction ID</th>
              <th className="table-header">Buyer</th>
              <th className="table-header">Phone Number</th>
              <th className="table-header">Price</th>
            </tr>
          </thead>
          <tbody>
            {successfulPurchases.map(purchase => (
              <tr key={purchase.id}>
                <td className="table-data product-column"><BsCheckCircleFill className="success-icon" />{purchase.product_name}</td>
                <td className="table-data">{purchase.auction_id}</td>
                <td className="table-data">{purchase.buyer_name}</td>
                <td className="table-data">{purchase.buyer_phone}</td>
                <td className="table-data">${purchase.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <h2 className="table-title">Unsuccessful Auctions</h2>
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Product</th>
              <th className="table-header">Auction ID</th>
              <th className="table-header">Price</th>
            </tr>
          </thead>
          <tbody>
          {unsuccessfulPurchases.map(purchase => (
              <tr key={purchase.id}>
                <td className="table-data product-column"><VscError className="error-icon" />{purchase.product_name}</td>
                <td className="table-data">{purchase.auction_id}</td>
                <td className="table-data">${purchase.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default MyAuctionsPage;
