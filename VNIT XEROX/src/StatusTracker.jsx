import React, { useState, useEffect } from 'react';

function StatusTracker() {
  const [searchCode, setSearchCode] = useState('');
  const [activeSearchCode, setActiveSearchCode] = useState('');
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const checkStatus = async (codeToUse = searchCode) => {
    const code = codeToUse.trim().toUpperCase();
    if (!code) return;
    setErrorMsg('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/status/${code}`);
      const data = await res.json();
      
      if (data) {
        setOrder(data);
        setActiveSearchCode(code); // Activate polling for this code
      } else {
        setOrder(null);
        setActiveSearchCode('');
        setErrorMsg('❌ Order not found. Double check your 4-digit code.');
      }
    } catch (err) {
      setErrorMsg("Connection error. Is backend running?");
    }
  };

  // 🔄 Auto-polling useEffect (polls every 10 seconds)
  useEffect(() => {
    if (!activeSearchCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/status/${activeSearchCode}`);
        const data = await res.json();
        if (data) {
          setOrder(data);
          // If picked up, we can stop polling as it's completed
          if (data.status === 'Picked Up') {
            setActiveSearchCode('');
          }
        }
      } catch (err) {
        console.error("Auto-poll failed:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeSearchCode]);

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      checkStatus();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ 
        fontFamily: "'Outfit', sans-serif", 
        fontWeight: 800, 
        color: 'var(--light-text)', 
        marginBottom: '10px',
        fontSize: '1.6rem'
      }}>
        Track Print Job
      </h2>
      <p style={{ color: 'var(--light-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
        Enter the unique 4-character pickup code to see if your print job is ready.
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="e.g. A4X9" 
          maxLength="4"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid var(--light-border)', 
            textTransform: 'uppercase', 
            fontSize: '18px', 
            textAlign: 'center', 
            letterSpacing: '3px', 
            fontWeight: 'bold',
            outline: 'none',
            fontFamily: "'Courier New', monospace"
          }}
          className="form-input"
          id="tracker-code-input"
        />
        <button 
          onClick={() => checkStatus()} 
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0 24px' }}
          id="tracker-check-btn"
        >
          Check
        </button>
      </div>

      {errorMsg && (
        <p style={{ 
          marginTop: '15px', 
          color: 'var(--danger-text)', 
          textAlign: 'center', 
          fontWeight: 600, 
          fontSize: '14px',
          backgroundColor: 'var(--danger-bg)',
          padding: '10px',
          borderRadius: '6px'
        }} id="tracker-error-message">
          {errorMsg}
        </p>
      )}

      {order && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          borderRadius: '10px', 
          backgroundColor: order.status === 'Ready' ? 'var(--success-bg)' : 
                           order.status === 'Picked Up' ? '#f1f5f9' : 'var(--warning-bg)',
          border: `1px solid ${order.status === 'Ready' ? '#c3e6cb' : 
                               order.status === 'Picked Up' ? '#cbd5e1' : '#ffeeba'}`,
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-out',
          boxShadow: 'var(--shadow-sm)'
        }} id="tracker-result-card">
          <p style={{ margin: '0 0 8px 0', color: 'var(--light-text-muted)', fontSize: '14px' }}>
            Student: <strong style={{ color: 'var(--light-text)' }}>{order.studentName}</strong>
          </p>

          {/* Pulse animation based on status */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '12px 24px', 
            borderRadius: '50px',
            backgroundColor: order.status === 'Ready' ? 'rgba(46, 125, 50, 0.1)' : 
                             order.status === 'Picked Up' ? 'rgba(0,0,0,0.05)' : 'rgba(239, 108, 0, 0.1)',
            animation: order.status === 'Ready' ? 'pulse 2s infinite' : 
                       order.status === 'Pending' ? 'pulseWarning 2s infinite' : 'none',
            marginBottom: '15px'
          }}>
            <h2 style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontWeight: 800,
              fontSize: '1.5rem',
              color: order.status === 'Ready' ? 'var(--success)' : 
                     order.status === 'Picked Up' ? '#475569' : 'var(--warning)',
              margin: 0
            }} id="tracker-status-text">
              Status: {order.status}
            </h2>
          </div>

          {order.status === 'Pending' && (
            <p style={{ margin: 0, color: 'var(--warning-text)', fontSize: '14px', fontWeight: 500 }}>
              ⏳ The shopkeeper is printing your order. Grab a seat!
            </p>
          )}

          {order.status === 'Ready' && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <p style={{ margin: 0, color: 'var(--success-text)', fontSize: '15px', fontWeight: 700 }}>
                Ready! ✅ Collect it now at the counter!
              </p>
              <p style={{ margin: '6px 0 0 0', color: 'var(--success-text)', fontSize: '13px' }}>
                Quote code <strong style={{ fontFamily: 'monospace', fontSize: '15px' }}>{order.pickupCode}</strong> and name <strong>{order.studentName}</strong>
              </p>
            </div>
          )}

          {order.status === 'Picked Up' && (
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              📦 Order completed! Picked up at counter.
            </p>
          )}

          {/* Polling indicator */}
          {activeSearchCode && order.status !== 'Picked Up' && (
            <div style={{ 
              marginTop: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              fontSize: '12px', 
              color: 'var(--light-text-muted)' 
            }} id="live-tracking-badge">
              <span style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#2563eb', 
                borderRadius: '50%', 
                display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }}></span>
              Live Tracking Active (Auto-updating)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StatusTracker;