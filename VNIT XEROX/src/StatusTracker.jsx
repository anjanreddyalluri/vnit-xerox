import React, { useState } from 'react';

function StatusTracker() {
  const [searchCode, setSearchCode] = useState('');
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState(''); // ✅ NEW: Error tracking

  const checkStatus = async () => {
    if (!searchCode) return;
    setErrorMsg(''); // Clear previous errors
    
    try {
      const res = await fetch(`http://localhost:5001/api/orders/status/${searchCode}`);
      const data = await res.json();
      
      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
        setErrorMsg('❌ Order not found. Please check your 4-digit code.');
      }
    } catch (err) {
      setErrorMsg("Error connecting to server. Is the backend running?");
    }
  };

  return (
    <div style={{ width: '100%', padding: '20px', border: '2px solid #28a745', borderRadius: '8px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
      <h2 style={{ marginTop: 0 }}>Track Your Order</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>Enter the 4-character pickup code given to you after payment.</p>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="e.g. A4X9" 
          maxLength="4"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase', fontSize: '18px', textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}
        />
        <button onClick={checkStatus} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Check
        </button>
      </div>

      {/* ✅ Displays Error if code is wrong */}
      {errorMsg && <p style={{ marginTop: '15px', color: '#dc3545', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</p>}

      {order && (
        <div style={{ marginTop: '20px', padding: '15px', borderRadius: '5px', backgroundColor: order.status === 'Ready' ? '#d4edda' : '#e9ecef', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>Student: <strong>{order.studentName}</strong></p>
          <h2 style={{ color: order.status === 'Ready' ? 'green' : 'black', margin: '10px 0' }}>Status: {order.status}</h2>
          {order.status === 'Ready' && <p style={{ margin: 0 }}>✅ Collect it now at the counter!</p>}
        </div>
      )}
    </div>
  );
}

export default StatusTracker;