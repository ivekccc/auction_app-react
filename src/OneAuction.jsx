import React from 'react'
import './App.css';
import { Link } from 'react-router-dom';


function OneAuction({ auction }) {
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
            </div>
        </div>

    )
}

export default OneAuction
