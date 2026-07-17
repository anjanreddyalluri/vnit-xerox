import React, { useState } from 'react';

function StatusTracker() {
  const [searchCode, setSearchCode] = useState('');
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = async () => {
    // Code validation: exactly 4 alphanumeric characters
    const codeRegex = /^[A-Z0-9]{4}$/i;
    if (!codeRegex.test(searchCode)) {
      setErrorMsg('Code must be exactly 4 alphanumeric characters.');
      setOrder(null);
      return;
    }

    setErrorMsg(''); 
    setIsLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/orders/status/${searchCode}`);
      const data = await res.json();
      
      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
        setErrorMsg('Order not found. Please check your 4-digit code.');
      }
    } catch (err) {
      setErrorMsg("Server unreachable. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <h2 style={{ margin: 0 }}>Track Status</h2>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Enter the 4-character pickup code given to you after payment.
      </p>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text" 
          placeholder="e.g. A4X9" 
          maxLength="4"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          className="form-input"
          style={{ textTransform: 'uppercase', textAlign: 'center', letterSpacing: '4px', fontSize: '1.25rem', fontWeight: '600' }}
        />
        <button onClick={checkStatus} className="btn btn-primary" style={{ padding: '0 1.5rem' }} disabled={isLoading}>
          {isLoading ? (
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          ) : (
            'Check'
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="animate-fade-in" style={{ padding: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {errorMsg}
        </div>
      )}

      {order && (
        <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: order.status === 'Ready' ? 'var(--success-bg)' : 'var(--bg-color)', border: '1px solid', borderColor: order.status === 'Ready' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
             {order.status === 'Ready' ? (
                <div className="animate-success" style={{ width: '48px', height: '48px', backgroundColor: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
             ) : (
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--warning)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
             )}
          </div>

          <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)' }}>Student: <strong style={{ color: 'var(--text-main)' }}>{order.studentName}</strong></p>
          
          <h2 style={{ color: order.status === 'Ready' ? 'var(--success)' : 'var(--warning)', margin: '0 0 1rem', fontSize: '1.5rem' }}>
            Status: {order.status}
          </h2>
          
          {order.status === 'Ready' && (
            <p style={{ margin: 0, fontWeight: '600', color: 'var(--success)' }}>
              Collect it now at the counter!
            </p>
          )}
          {order.status === 'Pending' && (
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Your order is being processed.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default StatusTracker;