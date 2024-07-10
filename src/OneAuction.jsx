import React from 'react'
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';





function OneAuction({ auction,logedUser,isActive }) {

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



    return (
        <div className="card">
            <div className="card-header">
                <h2>{auction.product_name}</h2>
            </div>
            <div className="card-body">
                <div className="cardUpperPart">
                    <div className="cardUpperPartContent"><h5 className="card-title">CategoryID: {auction.category_id}</h5>
                        <p className="card-text">Started: {auction.start}</p>
                        <p className="card-text">Ends: {auction.end}</p>
                        <p className='card-text'>Current Price:{auction.current_price}</p>
                    </div>
                    <div className="cardUpperPartImg">
                        <img src={auction.image_path} alt="" className='slikaProizvoda' />
                    </div>
                </div>
            </div>
            <div className='card-footer'>
            <Link to={`/auction/${auction.id}`} className="btn btn-outline-primary">See more</Link>
            {logedUser.isAdmin && !isActive ? (
                    <Link to="#" onClick={() => deleteAuction(auction.id)} className="btn btn-outline-danger">Archive</Link>
                ) : null}
            </div>
        </div>

    )
}

export default OneAuction
