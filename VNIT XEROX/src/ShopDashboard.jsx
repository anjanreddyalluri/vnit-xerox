import React, { useState, useEffect } from 'react';

function ShopDashboard() {
  const [orders, setOrders] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  const fetchData = async () => {
    const resOrders = await fetch('http://localhost:5001/api/orders');
    const dataOrders = await resOrders.json();
    setOrders(dataOrders);

    const resShop = await fetch('http://localhost:5001/api/shop/status');
    const dataShop = await resShop.json();
    setIsShopOpen(dataShop.isOpen);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, newStatus) => {
    await fetch(`http://localhost:5001/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchData();
  };

  const toggleShop = async () => {
    const res = await fetch('http://localhost:5001/api/shop/toggle', { method: 'POST' });
    const data = await res.json();
    setIsShopOpen(data.isOpen);
  };

  return (
    <div style={{ padding: '5%', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '20px', backgroundColor: '#333', color: 'white', borderRadius: '8px' }}>
        <h1 style={{ margin: 0 }}>Shopkeeper Dashboard</h1>
        
        <button 
          onClick={toggleShop} 
          style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', borderRadius: '5px', border: 'none', cursor: 'pointer', backgroundColor: isShopOpen ? '#dc3545' : '#28a745', color: 'white' }}
        >
          {isShopOpen ? '🔴 Close Shop' : '🟢 Open Shop'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {orders.map(order => (
          <div 
            key={order._id} 
            style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: order.status === 'Ready' ? '#d4edda' : '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>{order.studentName}</h3>
              <span style={{ backgroundColor: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{order.pickupCode}</span>
            </div>

            <p style={{ margin: '10px 0' }}><strong>Specs:</strong> {order.copies} copies | {order.isColor ? 'Color' : 'B&W'} | ₹{order.totalPaid}</p>
            <p style={{ margin: '0 0 10px 0', color: order.status === 'Ready' ? 'green' : 'orange', fontWeight: 'bold' }}>Status: {order.status}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
              {/* ✅ THE PDF LINK */}
              {order.pdfUrl && (
                <a 
                  href={`http://localhost:5001/uploads/${order.pdfUrl}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'block', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', textDecoration: 'none', color: '#0056b3', fontWeight: 'bold', textAlign: 'center' }}
                >
                  📄 Open PDF Document
                </a>
              )}

              {/* ✅ THE PAYMENT SCREENSHOT LINK */}
              {order.paymentScreenshotUrl && (
                <a 
                  href={`http://localhost:5001/uploads/${order.paymentScreenshotUrl}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'block', padding: '10px', backgroundColor: '#d4edda', borderRadius: '5px', textDecoration: 'none', color: '#155724', fontWeight: 'bold', textAlign: 'center', border: '1px solid #c3e6cb' }}
                >
                  💸 View Payment Screenshot
                </a>
              )}
            </div>

            {order.status === 'Pending' && (
              <button 
                onClick={() => updateStatus(order._id, 'Ready')} 
                style={{ width: '100%', backgroundColor: '#28a745', color: 'white', padding: '12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Print Done (Mark Ready)
              </button>
            )}

            {order.status === 'Ready' && (
              <button 
                onClick={() => updateStatus(order._id, 'Picked Up')} 
                style={{ width: '100%', backgroundColor: '#6c757d', color: 'white', padding: '12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📦 Student Picked Up
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopDashboard;