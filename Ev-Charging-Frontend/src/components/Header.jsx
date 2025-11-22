import React from 'react';
import { MapPin, Users, History, Wallet } from 'lucide-react';
import { formatCurrency, LightningIcon, RupeeIcon } from '../data/utils';
import '../App.css';

const Header = ({ currentScreen, setScreen, balance }) => {
  const navItems = [
    { id: 'stations', icon: MapPin, label: 'Stations' },
    { id: 'profile', icon: Users, label: 'Profile' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
  ];

  const handleNavClick = (screen) => {
    setScreen(screen);
  };

  return (
    <header className="header">
      <div className="logo">
        <LightningIcon />
        <div className="logo-text">
          EV-CMS
          <div className="logo-subtext">Charging Made Simple</div>
        </div>
      </div>

      <div className="nav-bar">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </div>
        ))}
        
        <div className="balance-display">
          <RupeeIcon /> {formatCurrency(balance)}
        </div>
      </div>
    </header>
  );
};

export default Header;
