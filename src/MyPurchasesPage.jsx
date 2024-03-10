import axios from 'axios';
import React, { useState, useEffect } from 'react';


function MyPurchasesPage({ token }) {
    const [boughtAuctions, setBoughtAuctions] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('api/boughtAuctions', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                setBoughtAuctions(response.data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const details = {};
            await Promise.all(boughtAuctions.map(async (auction) => {
                try {
                    const response = await axios.get(`api/users/${auction.owner_id}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    details[auction.owner_id] = response.data;
                } catch (error) {
                    console.error('Error getting user details:', error);
                    details[auction.owner_id] = { name: 'Unknown', phone_number: 'Unknown' };
                }
            }));
            setUserDetails(details);
        };

        if (boughtAuctions.length > 0) {
            fetchUserDetails();
        }
    }, [boughtAuctions, token]);

    return (
        <div className="my-purchases-page">
            {errorMessage && <div>Error: {errorMessage}</div>}
            <h2>My Purchases</h2>
            <table className="auctions-table">
                <thead>
                    <tr>
                        <th>Owner Name</th>
                        <th>Owner Phone</th>
                        <th>Auction ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {boughtAuctions.map((auction) => (
                        <tr key={auction.id}>
                            <td>{userDetails[auction.owner_id] ? userDetails[auction.owner_id].name : 'Unknown'}</td>
                            <td>{userDetails[auction.owner_id] ? userDetails[auction.owner_id].phone_number : 'Unknown'}</td>
                            <td>{auction.auction_id}</td>
                            <td>{auction.product_name}</td>
                            <td>${auction.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyPurchasesPage;
