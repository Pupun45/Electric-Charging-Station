import React from 'react';
import { Zap } from 'lucide-react';

export const RupeeIcon = ({ size = '1em' }) =>
  React.createElement('span', { style: { fontSize: size } }, '₹');

export const LightningIcon = () =>
  React.createElement(Zap, { size: 14, color: '#00E676' });

export const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace('₹', '')
      .trim();
  } catch {
    return `₹${amount}`;
  }
};
