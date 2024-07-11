import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { BsCheckCircleFill } from "react-icons/bs";
import { VscError } from "react-icons/vsc";

function MyAuctionsPage({ token, currency, exchangeRate }) {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/myauctions', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await Promise.all(response.data.map(async (auction) => {
          const bidder = await getBuyer(auction.current_bidder);
          return {
            ...auction,
            current_bidder: bidder ? bidder.name : 'No current bidder'
          };
        }));
        setAuctions(data);
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

  const downloadExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };

  const downloadSuccessfulPurchases = () => {
    const data = successfulPurchases.map(purchase => ({
      'Product': purchase.product_name,
      'Auction ID': purchase.auction_id,
      'Buyer': purchase.buyer_name,
      'Phone Number': purchase.buyer_phone,
      'Price': (purchase.price * exchangeRate).toFixed(2) + ' ' + currency
    }));
    downloadExcel(data, 'SuccessfulAuctions.xlsx');
  };

  const downloadUnsuccessfulPurchases = () => {
    const data = unsuccessfulPurchases.map(purchase => ({
      'Product': purchase.product_name,
      'Auction ID': purchase.auction_id,
      'Price': (purchase.price * exchangeRate).toFixed(2) + ' ' + currency
    }));
    downloadExcel(data, 'UnsuccessfulAuctions.xlsx');
  };

  return (
    <div id="myAuctionsPage">
      <div className="myauctions-page-container">
        <div className="myauctions-list">
          <div className="table-container">
            <h2 className="table-title">Ongoing Auctions</h2>
            {auctions.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th className="table-header">Product</th>
                    <th className="table-header">Auction ID</th>
                    <th className="table-header">Auction Category</th>
                    <th className="table-header">Current Bidder</th>
                    <th className="table-header">Start Price</th>
                    <th className="table-header">Current Price</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map(auction => (
                    <tr key={auction.id}>
                      <td className="table-data product-column">{auction.product_name}</td>
                      <td className="table-data">{auction.id}</td>
                      <td className="table-data">{auction.category_id}</td>
                      <td className="table-data">{auction.current_bidder ?? 'No current bidder'}</td>
                      <td className='table-data'>{auction.start_price}</td>
                      <td className="table-data">{(auction.current_price * exchangeRate).toFixed(2)} {currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className='EmptyMessage'>No Ongoing auctions</p>
            )}
          </div>
        </div>

        <div className="table-container">
          <h2 className="table-title">Successful Auctions</h2>
          {successfulPurchases.length > 0 ? (
            <>
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
                      <td className="table-data">{(purchase.price * exchangeRate).toFixed(2)} {currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="downloadButton" onClick={downloadSuccessfulPurchases}>Download Successful Auctions</button>
            </>
          ) : (
            <p className='EmptyMessage'>No Successful auctions</p>
          )}
        </div>

        <div className="table-container">
          <h2 className="table-title">Unsuccessful Auctions</h2>
          {unsuccessfulPurchases.length > 0 ? (
            <>
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
                      <td className="table-data">{(purchase.price * exchangeRate).toFixed(2)} {currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="downloadButton" onClick={downloadUnsuccessfulPurchases}>Download Unsuccessful Auctions</button>
            </>
          ) : (
            <p className='EmptyMessage'>No Unsuccessful auctions</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAuctionsPage;
