import React, { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import "../App.css";

const PaymentDue = ({ setScreen, sessionData, setBalance, history, setHistory }) => {
  const [cashfree, setCashfree] = useState(null);

  // Load Cashfree SDK
  useEffect(() => {
    async function init() {
      const cf = await load({ mode: "sandbox" }); // change to "production" later
      setCashfree(cf);
    }
    init();
  }, []);

  const handlePayNow = async () => {
    try {
      if (!sessionData?.cost || sessionData.cost <= 0) {
        alert("Invalid payment amount!");
        return;
      }

      // Save session in localStorage before redirect
      localStorage.setItem("currentSession", JSON.stringify(sessionData));

      // Create Cashfree order on backend
      const response = await fetch("http://localhost:38923/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(sessionData.cost),
          customerName: "EV User",
          customerEmail: "user@example.com",
          customerPhone: "9999999999",
        }),
      });

      const data = await response.json();
      if (!data.success) {
        alert("Order creation failed!");
        return;
      }

      const paymentSessionId = data.data.payment_session_id;

      //  Open Cashfree Checkout Page
      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self", // open in same tab
        //  Set your return URL to PaymentSuccess route
        returnUrl: `${window.location.origin}/?screen=payment_success`,
      });

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed! Try again.");
    }
  };

  return (
    <div className="dialog-box card">
      <h2 className="page-title">Payment Due</h2>
      <p>Review your charging session</p>

      <div className="data-table">
        <div className="table-row">
          <span>Station</span>
          <span>{sessionData.station}</span>
        </div>
        <div className="table-row">
          <span>Power Consumed</span>
          <span>{(sessionData.energy / 1000).toFixed(3)} kWh</span>
        </div>
        <div className="table-row">
          <span>Rate</span>
          <span>₹ {(sessionData.cost) }</span>
        </div>

        <div className="table-row table-row-total">
          <span>Total Payable</span>
          <span>₹ {Number(sessionData.cost).toFixed(2)}</span>
        </div>
      </div>

      <div className="button-group">
        <button onClick={handlePayNow} className="button-primary">
          Pay Now
        </button>
        {/* <button onClick={() => setScreen("stations")} className="button-secondary">
          Cancel
        </button> */}
      </div>
    </div>
  );
};

export default PaymentDue;
