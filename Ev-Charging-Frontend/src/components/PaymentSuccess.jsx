import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { RupeeIcon } from '../data/utils';
import '../App.css';

const PaymentSuccess = ({ setScreen, balance, setBalance, history, setHistory }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem("currentSession");
    if (!savedSession) {
      // Auto-redirect user to station screen if no session exists
      setScreen("stations");
      return;
    }

    const session = JSON.parse(savedSession);
    setCurrentSession(session);

    // Add session to history
    const newSession = {
      id: Date.now(),
      station: session.station,
      timestamp: new Date().toLocaleString(),
      energy: session.energy,
      cost: session.cost,
    };

    setHistory(prevHistory => {
      const updatedHistory = [newSession, ...prevHistory];
      localStorage.setItem("history", JSON.stringify(updatedHistory));
      return updatedHistory;
    });

    // Deduct wallet balance
    setBalance(prev => prev - session.cost);

    // Toast
    setShowToast(true);
    const toastTimer = setTimeout(() => setShowToast(false), 3000);

    // Redirect after 1 second
    const redirectTimer = setTimeout(() => {
      setScreen("history");
      localStorage.removeItem("currentSession");
    }, 1000);

    return () => {
      clearTimeout(toastTimer);
      clearTimeout(redirectTimer);
    };
  }, [setScreen, setBalance, setHistory]);

  return (
    <div className="dialog-box card">
      <h2 className="page-title" style={{ color: 'var(--color-primary-green)' }}>
        <CheckCircle size={24} style={{ marginRight: '8px' }} />
        Payment Successful!
      </h2>

      {currentSession && (
        <div className="data-table">
          <div className="table-row">
            <span>Station</span>
            <span>{currentSession.station}</span>
          </div>
          <div className="table-row">
            <span>Energy</span>
            <span>{(currentSession.energy / 1000).toFixed(3)} kWh</span>
          </div>
          <div className="table-row">
            <span>Amount Paid</span>
            <span>
              <RupeeIcon /> {currentSession.cost.toFixed(2)}
            </span>
          </div>
          <div className="table-row">
            <span>Wallet Balance</span>
            <span>
              <RupeeIcon /> {balance.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="button-group">
        <button onClick={() => setScreen('history')} className="button-primary">
          View History
        </button>
        <button onClick={() => setScreen('stations')} className="button-secondary">
          Dashboard
        </button>
      </div>

      {showToast && (
        <div className="toast" style={{ opacity: 1 }}>
          Payment successful!
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
