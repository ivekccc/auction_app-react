import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DepositPage({token,logedUser,setLogedUser}) {
    const [amount, setAmount] = useState('');
    let navigate=useNavigate();

    function handleDeposit(event) {
      event.preventDefault();
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
        if (response.data.new_balance !== undefined) {
          // Ažuriramo samo balance atribut logedUser objekta
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
            <label>Amount:</label>
            <input type="number" name="amount" onChange={handleInput} />
            <button type='submit'>Deposit</button>
        </form>
    );
}

export default DepositPage;
