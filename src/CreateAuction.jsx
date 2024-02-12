import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CreateAuction({ categories }) {
    const [productData, setProductData] = useState(
        {
            "product_name": "",
            "category_id": "",
            "description": "",
            "start_price": 0,
            "image_path": ""
        }
    );
    function handleInput(e) {
        let newProductData = productData;
        newProductData[e.target.name] = e.target.value;
        setProductData(newProductData);
    }
    function handleAddProduct(e) {
        e.preventDefault();
        const token = sessionStorage.getItem('auth_token');
        axios.post("api/auctions", productData, {
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
        <div>
            <form onSubmit={handleAddProduct}>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Product name:</span>
                    <input type="text" onInput={handleInput} className="form-control" name="product_name" placeholder="Product name" aria-label="ProductName" aria-describedby="basic-addon1" />
                </div>
                <div className="input-group">
                    <span className="input-group-text">Product Description:</span>
                    <textarea className="form-control" onInput={handleInput} name="description" aria-label="Description"></textarea>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text">Starting price:</span>
                    <input type="text" className="form-control" onInput={handleInput} name="start_price" aria-label="Amount (to the nearest dollar)" placeholder='$' />
                    <span className="input-group-text">.00</span>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text">Image path:</span>
                    <input type="text" onInput={handleInput} className="form-control" name="image_path" placeholder='.img/name' />
                </div>


                <div className="col-md-3">
                    <label htmlFor="validationCustom04" className="form-label">Category:</label>
                    <select onInput={handleInput} name="category_id" className="form-select" id="validationCustom04" required>
                        <option selected disabled value="">Choose...</option>
                        {/* Provera da li su kategorije definisane pre mapiranja */}
                        {categories && categories.map(category => (
                            <option key={category.id} value={category.id}>{category.id}. {category.category_name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Add product</button>
            </form>
        </div>
    )
}

export default CreateAuction
