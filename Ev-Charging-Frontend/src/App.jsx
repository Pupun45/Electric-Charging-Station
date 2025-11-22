import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StationSelection from './components/StationSelection';
import ChargingScreen from './components/ChargingScreen';
import PaymentDue from './components/PaymentDue';
import PaymentSuccess from './components/PaymentSuccess';
import ProfileScreen from './components/ProfileScreen';
import HistoryScreen from './components/HistoryScreen';
import WalletScreen from './components/WalletScreen';
import LoginScreen from './components/LoginScreen';

import { INITIAL_BALANCE } from './data/constants';
import './App.css';

const App = () => {
  const [currentScreen, setScreen] = useState('login');
  const [selectedStation, setStation] = useState(null);
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [currentSession, setSessionData] = useState(null);

  // Load login state on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    const logged = localStorage.getItem("isLoggedIn");

    if (savedUser && logged === "true") {
      setUserData(JSON.parse(savedUser));
      setLoggedIn(true);
      setScreen("stations");
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // Handle Cashfree redirect — ONLY show payment_success IF session exists
  useEffect(() => {
    if (!isLoggedIn) return;

    const query = new URLSearchParams(window.location.search);
    const screenParam = query.get("screen");

    if (screenParam === "payment_success") {
      const session = localStorage.getItem("currentSession");

      if (session) {
        setScreen("payment_success");
      } else {
        // If no session → go to stations, avoid blank screen
        setScreen("stations");
      }
    }
  }, [isLoggedIn]);

  //  LOGIN
  const handleLogin = (user) => {
    setUserData(user);
    setLoggedIn(true);
    setScreen("stations");

    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
  };

  //  LOGOUT
  const handleLogout = () => {
    setLoggedIn(false);
    setUserData(null);

    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");

    setScreen("login");
  };

  // 📺 SCREEN RENDER
  const renderScreen = () => {
    if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

    switch (currentScreen) {
      case "stations":
        return (
          <StationSelection
            setScreen={setScreen}
            setStation={setStation}
            userData={userData}
          />
        );

      case "charging":
        return (
          <ChargingScreen
            station={selectedStation}
            userData={userData}
            setScreen={setScreen}
            setSessionData={setSessionData}
            currentSession={currentSession}
          />
        );

      case "payment_due":
        return (
          <PaymentDue
            setScreen={setScreen}
            sessionData={currentSession}
            setBalance={setBalance}
            history={history}
            setHistory={setHistory}
          />
        );

      case "payment_success":
        return (
          <PaymentSuccess
            setScreen={setScreen}
            balance={balance}
            setBalance={setBalance}
            history={history}
            setHistory={setHistory}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            setScreen={setScreen}
            userData={userData}
            balance={balance}
            setLoggedIn={handleLogout}
          />
        );

      case "history":
        return (
          <HistoryScreen
            setScreen={setScreen}
            history={history}
            setHistory={setHistory}
          />
        );

      case "wallet":
        return (
          <WalletScreen
            setScreen={setScreen}
            balance={balance}
            setBalance={setBalance}
          />
        );

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app-container">
      {isLoggedIn && (
        <Header currentScreen={currentScreen} setScreen={setScreen} balance={balance} />
      )}

      <main className="main-content">{renderScreen()}</main>

      {isLoggedIn && (
        <footer className="footer">
          Made with Electric ⚡ for EV Charging
        </footer>
      )}
    </div>
  );
};

export default App;
