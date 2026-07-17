import React, { useState, useEffect } from 'react';

function ShopDashboard() {
  const [orders, setOrders] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [networkError, setNetworkError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchData = async () => {
    try {
      setNetworkError('');
      const resOrders = await fetch(`${apiUrl}/api/orders`);
      const dataOrders = await resOrders.json();
      setOrders(dataOrders);

      const resShop = await fetch(`${apiUrl}/api/shop/status`);
      const dataShop = await resShop.json();
      setIsShopOpen(dataShop.isOpen);
    } catch (err) {
      setNetworkError('Server unreachable. Reconnecting...');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${apiUrl}/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status. Check your connection.");
    }
  };

  const toggleShop = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/shop/toggle`, { method: 'POST' });
      const data = await res.json();
      setIsShopOpen(data.isOpen);
    } catch (err) {
      alert("Failed to toggle shop state.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)' }}>
      
      {/* Dashboard Header */}
      <header style={{ backgroundColor: 'var(--text-main)', color: 'white', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 10, boxShadow: 'var(--shadow-md)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/Profile.png" alt="XeroxIt" style={{ width: '32px', height: '32px' }} />
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>XeroxIt Admin</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isShopOpen ? 'var(--success)' : 'var(--danger)', boxShadow: isShopOpen ? '0 0 10px var(--success)' : '0 0 10px var(--danger)' }}></span>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Status: {isShopOpen ? 'Accepting Orders' : 'Closed'}</span>
            </div>
            
            <button 
              onClick={toggleShop} 
              className={isShopOpen ? 'btn btn-danger' : 'btn btn-success'}
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem', borderRadius: 'var(--radius-full)' }}
            >
              {isShopOpen ? 'Close Shop' : 'Open Shop'}
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {networkError && (
          <div className="animate-fade-in" style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {networkError}
          </div>
        )}

        {/* Order Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
             </div>
             <div>
               <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Orders</p>
               <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{orders.length}</h3>
             </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ backgroundColor: 'var(--warning)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
             </div>
             <div>
               <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Pending</p>
               <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{orders.filter(o => o.status === 'Pending').length}</h3>
             </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
             </div>
             <div>
               <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Ready</p>
               <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{orders.filter(o => o.status === 'Ready').length}</h3>
             </div>
          </div>
        </div>

        {/* Order Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {orders.map(order => (
            <div 
              key={order._id} 
              className="card animate-fade-in"
              style={{ 
                borderLeft: `4px solid ${order.status === 'Ready' ? 'var(--success)' : order.status === 'Picked Up' ? 'var(--text-muted)' : 'var(--warning)'}`,
                opacity: order.status === 'Picked Up' ? 0.7 : 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem' }}>{order.studentName}</h3>
                  <span className={`badge ${order.status === 'Ready' ? 'badge-success' : order.status === 'Picked Up' ? 'badge-secondary' : 'badge-warning'}`}>
                    {order.status}
                  </span>
                </div>
                <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: '700', letterSpacing: '2px', fontSize: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  {order.pickupCode}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Copies:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{order.copies}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Type:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{order.isColor ? 'Color (₹10)' : 'B&W (₹2)'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Paid:</span>
                  <strong style={{ color: 'var(--success)', fontSize: '1rem' }}>₹{order.totalPaid}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', marginTop: 'auto' }}>
                {order.pdfUrl && (
                  <a 
                    href={order.pdfUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn"
                    style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Print PDF
                  </a>
                )}

                {order.paymentScreenshotUrl && (
                  <a 
                    href={order.paymentScreenshotUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn"
                    style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    Payment
                  </a>
                )}
              </div>

              {order.status === 'Pending' && (
                <button 
                  onClick={() => updateStatus(order._id, 'Ready')} 
                  className="btn btn-success w-full"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polyline points="20 6 9 17 4 12"/></svg>
                  Mark as Ready
                </button>
              )}

              {order.status === 'Ready' && (
                <button 
                  onClick={() => updateStatus(order._id, 'Picked Up')} 
                  className="btn btn-secondary w-full"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="m7 17-4.2-4.2a2 2 0 0 1 0-2.8l2.8-2.8a2 2 0 0 1 2.8 0L12 11"/><path d="m11 21-4.2-4.2a2 2 0 0 1 0-2.8l2.8-2.8a2 2 0 0 1 2.8 0L17 16"/><path d="m21 7-4.2-4.2a2 2 0 0 0-2.8 0l-2.8 2.8a2 2 0 0 0 0 2.8L16 13"/></svg>
                  Student Picked Up
                </button>
              )}
            </div>
          ))}
          
          {orders.length === 0 && !networkError && (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <p>No orders found. Waiting for new prints...</p>
             </div>
          )}
        </div>
        
      </main>
    </div>
  );
}

export default ShopDashboard;