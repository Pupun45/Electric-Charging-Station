import React, { useState, useEffect } from 'react';
import { RupeeIcon, formatCurrency } from '../data/utils';
import '../App.css';

const WalletScreen = ({ setScreen, balance, setBalance }) => {
  const [amount, setAmount] = useState('');

  // Load balance from localStorage
  useEffect(() => {
    const savedBalance = localStorage.getItem("walletBalance");
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
  }, [setBalance]);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("walletBalance", balance);
  }, [balance]);

  // Only allow adding exactly 500 Rupees
  const handleAddMoney = (e) => {
    e.preventDefault();

    const addAmount = parseFloat(amount);

    if (addAmount !== 500) {
      alert("Only ₹500 is allowed!");
      return;
    }

    const newBalance = balance + 500;
    setBalance(newBalance);
    localStorage.setItem("walletBalance", newBalance);

    setAmount('');
    alert("₹500 added to your wallet!");
  };

  return (
    <>
      <h2 className="page-title">Wallet</h2>

      <div className="card" style={{ maxWidth: '400px', margin: '0 auto', padding: '30px' }}>
        <p style={{ color: 'var(--color-text-medium)', marginBottom: '8px', fontSize: '1.1rem' }}>
          Manage your balance
        </p>

        <div className="card" style={{ margin: '20px 0', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-medium)', margin: '0 0 4px 0' }}>Current Balance</p>

          <p style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'var(--color-primary-green)',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RupeeIcon /> {formatCurrency(balance)}
          </p>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginTop: '30px' }}>Add Money</h3>

        <form onSubmit={handleAddMoney}>
          <div className="form-group">
            <label htmlFor="amount">Enter Amount (Only ₹500 allowed)</label>
            <input
              id="amount"
              type="number"
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter 500"
              required
            />
          </div>

          <div className="button-group" style={{ justifyContent: 'space-between', display: 'flex' }}>

            <button type="submit" className="button-primary" style={{ flexGrow: 1, marginRight: '10px' }}>
              <RupeeIcon size={18} style={{ marginRight: '6px' }} />
              Add Money
            </button>

            <button type="button" className="button-primary" onClick={() => setScreen('stations')}>
              Back
            </button>

          </div>
        </form>
      </div>
    </>
  );
};

export default WalletScreen;
