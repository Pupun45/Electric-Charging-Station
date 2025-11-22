import React from 'react';
import { Users, Car, Phone, Wallet, LogOut, ArrowLeft } from 'lucide-react';
import { RupeeIcon, formatCurrency } from '../data/utils';
import '../App.css';

const ProfileScreen = ({ setScreen, userData, balance, setLoggedIn }) => {
    const profileData = [
  { label: 'Name', value: userData.name, icon: Users },
  { label: 'Vehicle ID', value: userData.vehicleNo, icon: Car },
  { label: 'Mobile Number', value: userData.mobile, icon: Phone },
];


    const avatarInitial = userData.name ? userData.name[0].toUpperCase() : 'U';

    return (
        <>
            <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                <div className="profile-header-card">
                    <div className="avatar-placeholder">{avatarInitial}</div>
                    <h3 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '700' }}>{userData.name}</h3>
                    <p style={{ color: 'var(--color-text-medium)', fontSize: '0.9rem' }}>Wellcome {userData.name}</p>

                    <div className="profile-wallet-balance">
                        <span style={{ display: 'flex', alignItems: 'center', fontWeight: '600' }}><Wallet size={20} style={{ marginRight: '8px' }} /> Wallet Balance</span>
                        <span className="profile-wallet-value">
                            <RupeeIcon /> {formatCurrency(balance)}
                        </span>
                    </div>
                </div>

                <div className="card" style={{ padding: '0' }}>
                    <h3 style={{ margin: '0', padding: '16px', borderBottom: '1px solid #2F2F2F', fontSize: '1.1rem' }}>Account Details</h3>
                    <div className="data-table" style={{ margin: '0', border: 'none', borderRadius: '0' }}>
                        {profileData.map((item, index) => (
                            <div className="table-row" key={index} style={{ borderBottom: index < profileData.length - 1 ? '1px solid #2F2F2F' : 'none' }}>
                                <span style={{ color: 'var(--color-text-medium)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <item.icon size={18} />
                                    {item.label}
                                </span>
                                <span style={{ fontWeight: '600' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="button-group" style={{ justifyContent: 'space-between', marginTop: '24px' }}>
                    <button type="button" className="button-primary" onClick={() => setLoggedIn(false)} style={{ backgroundColor: 'var(--color-not-available)', flexGrow: 1, padding: '12px' }}>
                        <LogOut size={18} style={{ marginRight: '6px' }} />
                        Logout
                    </button>
                    <button type="button" className="button-secondary" onClick={() => setScreen('stations')} style={{ padding: '12px', flexGrow: 1, marginLeft: '12px' }}>
                        <ArrowLeft size={18} style={{ marginRight: '6px' }} />
                        Back to Stations
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileScreen;