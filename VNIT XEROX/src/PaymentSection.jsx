import React, { useState, useRef } from 'react';

function PaymentSection({ totalPrice, onFinalSubmit, isSubmitting }) {
  const [screenshot, setScreenshot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFinalSubmit = () => {
    if (!screenshot) {
      alert("Hold up! Please upload your payment screenshot before submitting.");
      return;
    }
    onFinalSubmit(screenshot); 
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
      setScreenshot(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--success)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
        <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Payment</h2>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
        Please pay <strong style={{ color: 'var(--text-main)', fontSize: '1.25rem' }}>₹{totalPrice}</strong> to complete your order.
      </p>

      <div style={{ margin: '0 auto 2rem', padding: '1rem', border: '1px solid var(--border-color)', width: '220px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-md)' }}>
        <img 
          src="/qr.jpg" 
          alt="VNIT Xerox UPI QR Code" 
          style={{ width: '100%', borderRadius: 'var(--radius-sm)', display: 'block' }} 
          onError={(e) => { e.target.src = "https://placehold.co/200x200?text=QR+Code" }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success)' }}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>UPI Accepted</span>
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
          cursor: 'pointer',
          marginBottom: '1.5rem'
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px', opacity: isDragging ? 1 : 0.7 }}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <label className="form-label" style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>
          {screenshot ? screenshot.name : "Drag & Drop or Click to Upload Payment Screenshot"}
        </label>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {screenshot ? `Size: ${(screenshot.size / 1024 / 1024).toFixed(2)} MB` : "Supports .jpg, .png"}
        </p>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setScreenshot(e.target.files[0])}
          ref={fileInputRef}
          style={{ display: 'none' }} 
        />
      </div>

      <button 
        onClick={handleFinalSubmit}
        className="btn btn-success w-full"
        style={{ padding: '1rem', fontSize: '1.125rem' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            Submitting...
          </>
        ) : (
          <>
            Submit Print Job
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><polyline points="20 6 9 17 4 12"/></svg>
          </>
        )}
      </button>

    </div>
  );
}

export default PaymentSection;