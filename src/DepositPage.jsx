import React, { useState } from 'react';
import axios from 'axios';

function DepositPage({token}) {
    const [amount, setAmount] = useState('');

    function handleDeposit() {


      let data = JSON.stringify({
        "amount": amount
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/increase-balance',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        },
        data : data
      };

      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    }

    const handleInput = (event) => {
        setAmount(event.target.value);
    };

    return (
        <form className="depositForm" onSubmit={handleDeposit}>
            <label>Amount:</label>
            <input type="number" name="amount" onChange={handleInput} />
            <button type='submit'>Deposit</button>
        </form>
    );
}

export default DepositPage;
