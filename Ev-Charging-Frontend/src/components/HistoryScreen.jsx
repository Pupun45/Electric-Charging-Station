import React from 'react';
import { Download } from 'lucide-react';
import { RupeeIcon } from '../data/utils';
import '../App.css';

const HistoryScreen = ({ setScreen, history, setHistory }) => {

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('history');
  };

  const downloadBill = (session) => {
    const content = `
Station: ${session.station}
Date: ${session.timestamp}
Energy: ${(session.energy / 1000).toFixed(3)} kWh
Cost: ₹${session.cost.toFixed(2)}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.station}_bill.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllBills = () => {
    if (history.length === 0) return;

    let content = 'Charging History\n\n';
    history.forEach((session) => {
      content += `
Station: ${session.station}
Date: ${session.timestamp}
Energy: ${(session.energy / 1000).toFixed(3)} kWh
Cost: ₹${session.cost.toFixed(2)}
-------------------------
`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'all_charging_bills.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <h2 className="page-title">Charging History</h2>
      <p style={{ color: 'var(--color-text-medium)', marginBottom: '24px' }}>
        View all your past charging sessions
      </p>

      <div className="card" style={{ padding: '0 24px' }}>
        {history.length === 0 ? (
          <p style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-text-medium)' }}>
            No charging sessions recorded yet.
          </p>
        ) : (
          history.map((session) => (
            <div key={session.id} className="history-item">
              <div className="history-info">
                <h4>{session.station}</h4>
                <p>
                  {session.timestamp} &nbsp; • &nbsp; Energy: {(session.energy / 1000).toFixed(3)} kWh
                </p>
              </div>
              <div className="history-actions">
                <span className="history-price" style={{ display: 'flex', alignItems: 'center' }}>
                  <RupeeIcon /> {session.cost.toFixed(2)}
                </span>
                <button
                  className="download-button"
                  onClick={() => downloadBill(session)}
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="button-group" style={{ justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          type="button"
          className="button-secondary"
          onClick={downloadAllBills}
          style={{ borderColor: 'var(--color-primary-green)', color: 'var(--color-primary-green)' }}
        >
          <Download size={18} style={{ marginRight: '6px' }} />
          Download All Bills
        </button>

        <button
          type="button"
          className="button-primary"
          onClick={clearHistory}
          style={{ backgroundColor: 'var(--color-not-available)' }}
        >
          Clear History
        </button>
      </div>
    </>
  );
};

export default HistoryScreen;
