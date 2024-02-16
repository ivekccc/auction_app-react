import React, { useState } from 'react';
import axios from 'axios';

function CreateAuction({ categories }) {
    const [productData, setProductData] = useState({
        "product_name": "",
        "category_id": "",
        "description": "",
        "start_price": 0,
        "image_path": ""
    });

    function handleInput(e) {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        });
    }

    function handleAddProduct(e) {
        e.preventDefault();
        const token = sessionStorage.getItem('auth_token');
        axios.post("/api/auctions", productData, {
            headers: {
                Authorization: `Bearer ${token}` // Dodajte token u zaglavlje za autentifikaciju
            }
        }).then((res) => {
            console.log(res.data);
        }).catch((error) => {
            console.error('Greška prilikom dodavanja proizvoda:', error);
        });
    }

    return (
        <div className="create-auction-page">
            <form onSubmit={handleAddProduct} className="create-auction-form">
                <h2 className="form-title">Create New Auction</h2>
                <div className="form-group mb-3">
                    <label htmlFor="productName" className="form-label">Product name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="product_name"
                        placeholder="Enter product name"
                        onInput={handleInput}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="description" className="form-label">Product Description:</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        placeholder="Enter product description"
                        onInput={handleInput}
                    ></textarea>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="startPrice" className="form-label">Starting price:</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            type="text"
                            className="form-control"
                            id="startPrice"
                            name="start_price"
                            placeholder="Enter starting price"
                            onInput={handleInput}
                        />
                        <span className="input-group-text">.00</span>
                    </div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="imagePath" className="form-label">Image path:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="imagePath"
                        name="image_path"
                        placeholder="Enter image path"
                        onInput={handleInput}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="category" className="form-label">Category:</label>
                    <select
                        className="form-select"
                        id="category"
                        name="category_id"
                        onChange={handleInput}
                    >
                        <option selected disabled>Choose category</option>
                        {categories && categories.map(category => (
                            <option key={category.id} value={category.id}>{category.id}. {category.category_name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
        </div>
    );
}

export default CreateAuction;
