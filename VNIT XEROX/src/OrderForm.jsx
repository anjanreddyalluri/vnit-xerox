import React, { useState, useEffect, useRef } from 'react';
import PaymentSection from './PaymentSection'; 

function OrderForm() {
  const [name, setName] = useState('');
  const [copies, setCopies] = useState(1);
  const [isColor, setIsColor] = useState(false);
  const [file, setFile] = useState(null); 
  const [isDragging, setIsDragging] = useState(false);
  
  const [showPayment, setShowPayment] = useState(false); 
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [successCode, setSuccessCode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState('');
  const fileInputRef = useRef(null);

  const pricePerCopy = isColor ? 10 : 2; 
  const totalPrice = copies * pricePerCopy;
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetch(`${apiUrl}/api/shop/status`)
      .then(res => res.json())
      .then(data => setIsShopOpen(data.isOpen))
      .catch(err => {
        setNetworkError("Server unreachable. Please check your connection.");
      });
  }, [apiUrl]);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Hold up! Please upload your document first.");
      return;
    }
    setShowPayment(true); 
  };

  const handleFinalSubmit = async (paymentScreenshot) => {
    setNetworkError('');
    setIsSubmitting(true);
    
    try {
      const statusRes = await fetch(`${apiUrl}/api/shop/status`);
      const statusData = await statusRes.json();
      if (!statusData.isOpen) {
        setIsShopOpen(false);
        setIsSubmitting(false);
        return; 
      }

      const formData = new FormData();
      formData.append('studentName', name);
      formData.append('copies', copies);
      formData.append('isColor', isColor);
      formData.append('totalPaid', totalPrice);
      formData.append('pdfFile', file); 
      formData.append('paymentScreenshot', paymentScreenshot); 

      const response = await fetch(`${apiUrl}/api/orders`, {
          method: 'POST',
          body: formData, 
      });
      const data = await response.json();
      
      if (response.ok) {
         setSuccessCode(data.pickupCode);
      } else {
         setNetworkError(data.message || "Something went wrong.");
      }

    } catch (error) {
      setNetworkError("Server unreachable. Make sure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  if (!isShopOpen) {
    return (
      <div className="card animate-fade-in" style={{ textAlign: 'center', borderColor: 'var(--warning)', backgroundColor: 'var(--warning-bg)' }}>
        <h3 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          Shop is Currently Closed
        </h3>
        <p style={{ marginTop: '10px' }}>We are not accepting print requests right now. Please check back later!</p>
      </div>
    );
  }

  if (successCode) {
    return (
      <div className="card animate-fade-in" style={{ textAlign: 'center', borderColor: 'var(--success)', borderTopWidth: '4px' }}>
        <div className="animate-success" style={{ width: '80px', height: '80px', backgroundColor: 'var(--success-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Order Submitted!</h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your Unique Pickup Code is:</p>
        
        <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0', letterSpacing: '4px', color: 'var(--primary)' }}>{successCode}</h1>
        </div>
        
        <p style={{ marginBottom: '1.5rem', fontWeight: '500' }}>Take a screenshot! Use this code in the tracker to check your status.</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary w-full">Place Another Order</button>
      </div>
    );
  }

  return (
    <div className="card">
      {networkError && (
        <div className="animate-fade-in" style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {networkError}
        </div>
      )}

      {showPayment ? (
        <PaymentSection totalPrice={totalPrice} onFinalSubmit={handleFinalSubmit} isSubmitting={isSubmitting} />
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
            <h2 style={{ margin: 0 }}>Print Request</h2>
          </div>
          
          <form onSubmit={handleProceedToPayment}>
            
            <div className="form-group">
              <label className="form-label">Student Name</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Copies</label>
                <input type="number" min="1" className="form-input" value={copies} onChange={(e) => setCopies(e.target.value)} />
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label">Color Mode</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', marginBottom: 'auto' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', flex: 1, justifyContent: 'center', backgroundColor: !isColor ? 'var(--primary)' : 'transparent', color: !isColor ? 'white' : 'var(--text-main)', transition: 'all 0.2s' }}>
                    <input type="radio" checked={!isColor} onChange={() => setIsColor(false)} style={{ display: 'none' }} />
                    B&W
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', flex: 1, justifyContent: 'center', backgroundColor: isColor ? 'var(--primary)' : 'transparent', color: isColor ? 'white' : 'var(--text-main)', transition: 'all 0.2s' }}>
                    <input type="radio" checked={isColor} onChange={() => setIsColor(true)} style={{ display: 'none' }} />
                    Color
                  </label>
                </div>
              </div>
            </div>

            <div 
              className={`form-group ${isDragging ? 'drag-active' : ''}`} 
              style={{ 
                padding: '2rem 1.5rem', 
                backgroundColor: 'var(--bg-color)', 
                border: '2px dashed var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                textAlign: 'center', 
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px', opacity: isDragging ? 1 : 0.7 }}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              <label className="form-label" style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>
                {file ? file.name : "Drag & Drop or Click to Upload PDF/Image"}
              </label>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {file ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports .pdf, .jpg, .png"}
              </p>
              <input 
                type="file" 
                accept="image/*, .pdf" 
                onChange={(e) => setFile(e.target.files[0])} 
                ref={fileInputRef}
                style={{ display: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Total Amount:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>₹{totalPrice}</span>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.125rem' }}>
              Proceed to Payment
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default OrderForm;