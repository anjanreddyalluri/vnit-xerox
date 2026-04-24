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

  const pricePerCopy = isColor ? 10 : 2; 
  const totalPrice = copies * pricePerCopy;

  useEffect(() => {
    fetch('http://localhost:5001/api/shop/status')
      .then(res => res.json())
      .then(data => setIsShopOpen(data.isOpen))
      .catch(err => console.error(err));
  }, []);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Hold up! Please upload your PDF file first.");
      return;
    }
    setShowPayment(true); 
  };

  // ✅ NOW RECEIVES THE SCREENSHOT
  const handleFinalSubmit = async (paymentScreenshot) => {
    const formData = new FormData();
    formData.append('studentName', name);
    formData.append('copies', copies);
    formData.append('isColor', isColor);
    formData.append('totalPaid', totalPrice);
    formData.append('pdfFile', file); 
    formData.append('paymentScreenshot', paymentScreenshot); // Added screenshot to payload

    try {
        const response = await fetch('http://localhost:5001/api/orders', {
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
        alert("Uh oh, server error! Make sure backend is running.");
    }
  };

  if (!isShopOpen) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#fff3cd', border: '2px solid #ffeeba', borderRadius: '8px', color: '#856404' }}>
        <h2>🚫 Shop is Currently Closed</h2>
        <p>We are not accepting print requests right now. Please check back later!</p>
      </div>
    );
  }

  if (successCode) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#d4edda' }}>
        <h2 style={{ color: '#155724', margin: '0 0 10px 0' }}>✅ Order Submitted!</h2>
        <p style={{ fontSize: '18px', color: '#333' }}>Your Unique Pickup Code is:</p>
        <h1 style={{ fontSize: '48px', margin: '10px 0', letterSpacing: '3px', color: '#0056b3' }}>{successCode}</h1>
        <p>Take a screenshot! Use this code in the tracker below.</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Place Another Order</button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', padding: '20px', border: '2px solid #007BFF', borderRadius: '8px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
      {showPayment ? (
        <PaymentSection totalPrice={totalPrice} onFinalSubmit={handleFinalSubmit} />
      ) : (
        <div>
          <h2 style={{ marginTop: 0, color: '#333' }}>Student Print Request</h2>
          <form onSubmit={handleProceedToPayment}>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Student Name:</label><br />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} required />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Number of Copies:</label><br />
              <input type="number" min="1" value={copies} onChange={(e) => setCopies(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={isColor} onChange={(e) => setIsColor(e.target.checked)} style={{ marginRight: '10px' }} />
                Print in Color? (₹10/copy)
              </label>
            </div>

            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px dashed #adb5bd' }}>
              <label style={{ fontWeight: 'bold' }}>Upload PDF:</label><br />
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: '8px', width: '100%' }} required />
            </div>

            <div style={{ padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
              <h3 style={{ margin: 0 }}>Total Amount: ₹{totalPrice}</h3>
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Proceed to Payment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default OrderForm;