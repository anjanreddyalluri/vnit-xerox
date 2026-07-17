import React, { useState } from 'react';

function PaymentSection({ totalPrice, onFinalSubmit, isSubmitting, onBack }) {
  const [screenshot, setScreenshot] = useState(null);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!screenshot) {
      alert("Hold up! Please upload your payment screenshot before submitting.");
      return;
    }
    if (screenshot.size > 10 * 1024 * 1024) {
      alert("Screenshot is too large! Please upload an image under 10MB.");
      return;
    }
    onFinalSubmit(screenshot); 
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          className="btn btn-outline"
          style={{ width: 'auto', padding: '8px 12px', fontSize: '14px', cursor: 'pointer', border: 'none', background: 'transparent' }}
          title="Back to Form"
          type="button"
          id="payment-back-btn"
        >
          ← Back
        </button>
        <h2 style={{ 
          fontFamily: "'Outfit', sans-serif", 
          fontWeight: 800, 
          color: 'var(--light-text)', 
          margin: 0,
          marginLeft: '10px',
          fontSize: '1.6rem'
        }}>
          UPI Payment
        </h2>
      </div>

      <p style={{ color: 'var(--light-text-muted)', fontSize: '15px', marginBottom: '20px' }}>
        Please transfer <strong>₹{totalPrice}</strong> to the campus xerox shop. Scan the QR code below using GPay, PhonePe, or Paytm.
      </p>

      {/* QR Code Container */}
      <div style={{ 
        margin: '20px auto', 
        padding: '16px', 
        border: '1px solid var(--light-border)', 
        maxWidth: '240px', 
        borderRadius: '12px', 
        backgroundColor: '#ffffff',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center'
      }} id="upi-qr-card">
        <img 
          src="http://localhost:5001/uploads/qr.jpg" 
          alt="VNIT Xerox UPI QR Code" 
          style={{ width: '100%', borderRadius: '8px', objectFit: 'contain' }} 
          onError={(e) => { 
            // Fallback if qr.jpg is not found at uploads
            e.target.src = "/qr.jpg";
            e.target.onerror = (err) => {
              e.target.src = "https://placehold.co/200x200?text=Scan+to+Pay";
            };
          }}
        />
        <p style={{ margin: '12px 0 0 0', fontWeight: 700, color: 'var(--light-text)', fontSize: '14px' }}>
          Scan via UPI Apps
        </p>
      </div>

      {/* Screenshot Proof Upload */}
      <form onSubmit={handleFinalSubmit}>
        <div className="form-group">
          <span className="form-label">Upload Payment Screenshot</span>
          <div className="file-upload-zone" id="screenshot-upload-zone" style={{ borderStyle: 'solid', borderColor: '#2e7d32', backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
            <span className="file-upload-icon" style={{ filter: 'grayscale(0)' }}>💸</span>
            <span className="file-upload-text" style={{ wordBreak: 'break-all', display: 'block', padding: '0 10px', color: 'var(--success-text)' }}>
              {screenshot ? screenshot.name : "Choose payment proof image"}
            </span>
            <span className="file-upload-subtext">
              {screenshot ? `${(screenshot.size / (1024 * 1024)).toFixed(2)} MB` : "Take screenshot of success screen"}
            </span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setScreenshot(e.target.files[0])}
              required
              id="screenshot-file-input"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="btn btn-success"
          disabled={isSubmitting}
          id="submit-print-job-btn"
          style={{ padding: '14px', fontSize: '16px' }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Submitting Order...
            </>
          ) : (
            'Submit Print Job'
          )}
        </button>
      </form>
    </div>
  );
}

export default PaymentSection;