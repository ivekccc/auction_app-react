import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DepositPage({ token, logedUser, setLogedUser, currency, exchangeRate }) {
  const [amount, setAmount] = useState('');


  function handleDeposit(event) {
    event.preventDefault();
    let convertedAmount = amount;
    if (currency !== 'USD') {
      convertedAmount = amount / exchangeRate;
    }

    let data = JSON.stringify({
      "amount": convertedAmount
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/api/increase-balance',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.data.new_balance !== undefined) {
          setLogedUser(prevLogedUser => ({
            ...prevLogedUser,
            balance: response.data.new_balance
          }));
        }
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
      <label>Amount ({currency}):</label>
      <input type="number" name="amount" onChange={handleInput} />
      <button type='submit'>Deposit</button>
    </form>
  );
}

export default DepositPage;
