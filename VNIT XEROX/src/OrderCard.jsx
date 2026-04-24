import React from 'react';

function OrderCard({ studentName, time, specs, price }) {
  
  const handleApprove = () => {
    alert(`Print Job for ${studentName} has been APPROVED! Sending to printer...`);
  };

  const handleReject = () => {
    alert(`Print Job for ${studentName} REJECTED. They need to re-upload payment.`);
  };

  return (
    <div className="order-card" style={{ border: '2px solid #ddd', padding: '16px', borderRadius: '8px', width: '300px', fontFamily: 'sans-serif', margin: '10px' }}>
      <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{studentName}</h2>
      <p style={{ margin: '5px 0', color: '#555' }}><strong>Time:</strong> {time}</p>
      <p style={{ margin: '5px 0', color: '#555' }}><strong>Specs:</strong> {specs}</p>
      <p style={{ margin: '5px 0', color: '#555' }}><strong>Total:</strong> ₹{price}</p>
      
      <div style={{ width: '100%', height: '100px', backgroundColor: '#f0f0f0', margin: '15px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
        <span style={{ color: '#888' }}>UPI Screenshot</span>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleApprove} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}>
          ✓ Approve
        </button>
        <button onClick={handleReject} style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}>
          ✗ Reject
        </button>
      </div>
    </div>
  );
}

export default OrderCard;