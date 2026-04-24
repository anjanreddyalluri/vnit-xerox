import React, { useState } from 'react';

function PaymentSection({ totalPrice, onFinalSubmit }) {
  const [screenshot, setScreenshot] = useState(null);

  const handleFinalSubmit = () => {
    if (!screenshot) {
      alert("Hold up! Please upload your payment screenshot before submitting.");
      return;
    }
    // Pass the screenshot back to the main form
    onFinalSubmit(screenshot); 
  };

  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
      <h3 style={{ color: '#333' }}>Complete Your Payment</h3>
      <p style={{ color: '#555', fontSize: '18px' }}>
        Please pay <strong>₹{totalPrice}</strong> using the QR below.
      </p>

      <div style={{ margin: '20px auto', padding: '10px', border: '2px dashed #ccc', width: '220px', borderRadius: '10px', backgroundColor: '#fff' }}>
        <img 
          src="/qr.jpg" 
          alt="VNIT Xerox UPI QR Code" 
          style={{ width: '100%', borderRadius: '5px' }} 
          onError={(e) => { e.target.src = "https://placehold.co/200x200?text=Save+qr.jpg+in+public+folder" }}
        />
        <p style={{ margin: '10px 0 0 0', fontWeight: 'bold', color: '#555' }}>Scan via PhonePe/GPay</p>
      </div>

      {/* ✅ RESTORED SCREENSHOT UPLOAD */}
      <div style={{ marginBottom: '20px', textAlign: 'left', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <label style={{ fontWeight: 'bold', color: '#333' }}>Upload Payment Screenshot:</label><br />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setScreenshot(e.target.files[0])}
          style={{ marginTop: '10px', width: '100%' }}
          required
        />
      </div>

      <button 
        onClick={handleFinalSubmit}
        style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Submit Print Job
      </button>

    </div>
  );
}

export default PaymentSection;