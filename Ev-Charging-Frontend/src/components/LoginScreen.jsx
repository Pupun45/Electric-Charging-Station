import React, { useState } from 'react';
import '../App.css';

const LoginScreen = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.vehicle) {
      setError('Please fill all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Send POST request to backend
      const response = await fetch("http://localhost:38923/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login/Register Success:", data);
        onLogin(data.user); // Pass user data to parent
        alert(data.message);
      } else {
        console.error("Login Failed:", data);
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(" Error:", err);
      setError("Cannot connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '60px auto', padding: '30px' }}>
      <h2 className="page-title">Login</h2>
      <p style={{ color: 'var(--color-text-medium)', marginBottom: '20px' }}>
        Enter your details to continue
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            className="input-field"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Vehicle Number</label>
          <input
            type="text"
            name="vehicle"
            className="input-field"
            placeholder="Enter vehicle number"
            value={formData.vehicle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            className="input-field"
            placeholder="Enter mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="10"
          />
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

        <button
          type="submit"
          className="button-primary"
          style={{ width: '100%', marginTop: '15px' }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
