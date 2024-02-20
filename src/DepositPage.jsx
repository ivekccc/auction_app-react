import React, { useState } from 'react';
import axios from 'axios';


function DepositPage({token}) {
const[amount,setAmount]=useState();
    function handleDeposit(){
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/increase-balance',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ token
            },
            data : amount
          };

          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
    }
    const handleInput = (e) => {
        setAmount({
          ...amount,
          [e.target.name]: e.target.value
        });
      };

  return (
    <form className="depositForm" onSubmit={handleDeposit}>
        <label>Amount:</label>
        <input type="number" name="amount" onInput={handleInput}/>
        <button type='submit'>Deposit</button>
    </form>
  )
}

export default DepositPage
