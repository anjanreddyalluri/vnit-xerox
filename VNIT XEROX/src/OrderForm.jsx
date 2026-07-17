import React, { useState, useEffect } from 'react';
import PaymentSection from './PaymentSection'; 

function OrderForm() {
  const [name, setName] = useState('');
  const [copies, setCopies] = useState(1);
  const [isColor, setIsColor] = useState(false);
  const [file, setFile] = useState(null); 
  
  const [showPayment, setShowPayment] = useState(false); 
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [successCode, setSuccessCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricePerCopy = isColor ? 10 : 2; 
  const totalPrice = copies * pricePerCopy;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/shop/status`)
      .then(res => res.json())
      .then(data => setIsShopOpen(data.isOpen))
      .catch(err => console.error(err));
  }, []);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!file) {
      alert("Hold up! Please upload your PDF file first.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File is too large! Please upload a PDF under 10MB.");
      return;
    }
    setShowPayment(true); 
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(successCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ SUBMIT FORM DATA TO BACKEND WITH SCREENSHOT
  const handleFinalSubmit = async (paymentScreenshot) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('studentName', name);
    formData.append('copies', copies);
    formData.append('isColor', isColor);
    formData.append('totalPaid', totalPrice);
    formData.append('pdfFile', file); 
    formData.append('paymentScreenshot', paymentScreenshot); 

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
            method: 'POST',
            body: formData, 
        });
        const data = await response.json();
        
        if (response.ok) {
           setSuccessCode(data.pickupCode);
        } else {
           alert(data.message);
        }
    } catch (error) {
        alert("Uh oh, server error! Make sure the backend is running.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isShopOpen) {
    return (
      <div style={{ 
        padding: '30px 20px', 
        textAlign: 'center', 
        backgroundColor: 'var(--warning-bg)', 
        border: '1px solid #ffeeba', 
        borderRadius: 'var(--radius)', 
        color: 'var(--warning-text)',
        animation: 'fadeIn 0.4s ease-out'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🚫</div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, marginBottom: '10px' }}>Shop is Closed</h2>
        <p style={{ fontSize: '15px', color: '#856404' }}>We are not accepting print requests right now. Please check back later!</p>
      </div>
    );
  }

  if (successCode) {
    return (
      <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease-out' }} id="student-success-card">
        <div style={{ fontSize: '56px', marginBottom: '10px' }}>🎉</div>
        <h2 style={{ color: 'var(--success)', fontFamily: "'Outfit', sans-serif", fontWeight: 800, marginBottom: '10px' }}>Order Submitted!</h2>
        <p style={{ color: 'var(--light-text-muted)', fontSize: '15px', marginBottom: '20px' }}>Your print request has been sent to the Xerox machine.</p>
        
        <div className="pickup-code-container">
          <span className="pickup-code-title">Your Pickup Code</span>
          <span className="pickup-code" id="success-pickup-code">{successCode}</span>
          <button 
            onClick={handleCopy}
            className="btn btn-outline"
            style={{ width: 'auto', padding: '6px 16px', fontSize: '13px', marginTop: '8px', display: 'inline-flex', alignSelf: 'center' }}
            id="copy-code-btn"
          >
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
        </div>
        
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          Please note down this 4-character code. You can enter it in the Status Tracker on the right to monitor your order.
        </p>
        
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
          id="another-order-btn"
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {showPayment ? (
        <PaymentSection 
          totalPrice={totalPrice} 
          onFinalSubmit={handleFinalSubmit} 
          isSubmitting={isSubmitting} 
          onBack={() => setShowPayment(false)}
        />
      ) : (
        <div>
          <h2 style={{ 
            fontFamily: "'Outfit', sans-serif", 
            fontWeight: 800, 
            color: 'var(--light-text)', 
            marginBottom: '20px',
            fontSize: '1.6rem'
          }}>
            Fill Print Form
          </h2>
          <form onSubmit={handleProceedToPayment}>
            
            <div className="form-group">
              <label className="form-label" htmlFor="student-name">Student Name</label>
              <input 
                id="student-name"
                type="text" 
                className="form-input"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your full name" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="copies-count">Number of Copies</label>
              <input 
                id="copies-count"
                type="number" 
                min="1" 
                className="form-input"
                value={copies} 
                onChange={(e) => setCopies(parseInt(e.target.value) || 1)} 
                required
              />
            </div>

            <div className="form-group" style={{ margin: '24px 0' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: 600, color: 'var(--light-text)' }}>
                <input 
                  type="checkbox" 
                  checked={isColor} 
                  onChange={(e) => setIsColor(e.target.checked)} 
                  style={{ 
                    marginRight: '12px', 
                    width: '18px', 
                    height: '18px', 
                    accentColor: 'var(--primary)',
                    cursor: 'pointer' 
                  }} 
                  id="print-color-checkbox"
                />
                Print in Color? (₹10/copy vs ₹2/copy B&W)
              </label>
            </div>

            <div className="form-group">
              <span className="form-label">Upload PDF Document</span>
              <div className="file-upload-zone" id="pdf-upload-zone">
                <span className="file-upload-icon">📄</span>
                <span className="file-upload-text" style={{ wordBreak: 'break-all', display: 'block', padding: '0 10px' }}>
                  {file ? file.name : "Choose PDF file or drag it here"}
                </span>
                <span className="file-upload-subtext">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Only PDF files accepted"}
                </span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  required 
                  id="pdf-file-input"
                />
              </div>
            </div>

            <div className="pricing-badge" id="order-price-badge">
              Total Price: ₹{totalPrice}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              id="proceed-payment-btn"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default OrderForm;