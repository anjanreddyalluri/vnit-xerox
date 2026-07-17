import React, { useState, useEffect } from 'react';

function ShopDashboard() {
  const [orders, setOrders] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'ready' | 'archived'
  const [screenshotModalUrl, setScreenshotModalUrl] = useState(null);

  const fetchData = async () => {
    try {
      const resOrders = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
      const dataOrders = await resOrders.json();
      setOrders(dataOrders);

      const resShop = await fetch(`${import.meta.env.VITE_API_URL}/api/shop/status`);
      const dataShop = await resShop.json();
      setIsShopOpen(dataShop.isOpen);
    } catch (err) {
      console.error("Dashboard failed to fetch data:", err);
    }
  };

  useEffect(() => {
    // Apply dark background to body for shop dashboard view
    document.body.style.backgroundColor = '#121214';
    document.body.style.color = '#f3f4f6';

    fetchData();
    const interval = setInterval(fetchData, 4000); // Poll faster (every 4s) on shopkeeper side

    return () => {
      // Restore default backgrounds
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      clearInterval(interval);
    };
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const toggleShop = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shop/toggle`, { method: 'POST' });
      const data = await res.json();
      setIsShopOpen(data.isOpen);
    } catch (err) {
      alert("Failed to toggle shop status.");
    }
  };

  // Filter orders based on active tab
  const activeOrders = orders.filter(o => o.status === 'Pending');
  const readyOrders = orders.filter(o => o.status === 'Ready');
  const archivedOrders = orders.filter(o => o.status === 'Picked Up');

  const getOrdersForCurrentTab = () => {
    if (activeTab === 'active') return activeOrders;
    if (activeTab === 'ready') return readyOrders;
    return archivedOrders;
  };

  return (
    <div style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Dashboard Top Header */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px', 
        padding: '20px 30px', 
        backgroundColor: 'var(--dark-card)', 
        border: '1px solid var(--dark-border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        gap: '20px'
      }} id="shop-header">
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800 }}>
            🏪 Shopkeeper Dashboard
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--dark-text-muted)', fontSize: '14px' }}>
            Manage campus print jobs and real-time shop availability.
          </p>
        </div>
        
        {/* iOS style Toggle Switch */}
        <div className="switch-container" id="shop-status-switch">
          <span style={{ fontWeight: 600, fontSize: '15px', color: isShopOpen ? 'var(--success)' : 'var(--danger)' }}>
            Shop is {isShopOpen ? 'OPEN' : 'CLOSED'}
          </span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isShopOpen} 
              onChange={toggleShop} 
              id="shop-toggle-input"
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="shop-tabs" id="shop-tabs-navigation">
        <button 
          onClick={() => setActiveTab('active')} 
          className={`shop-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          id="tab-active-btn"
        >
          📥 Active Queue ({activeOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('ready')} 
          className={`shop-tab-btn ${activeTab === 'ready' ? 'active' : ''}`}
          id="tab-ready-btn"
        >
          ✓ Ready for Pickup ({readyOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('archived')} 
          className={`shop-tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
          id="tab-archived-btn"
        >
          📦 Archive History ({archivedOrders.length})
        </button>
      </div>

      {/* Orders Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '24px' 
        }} 
        id="shop-orders-grid"
      >
        {getOrdersForCurrentTab().map(order => (
          <div key={order._id} className="shop-card" id={`order-${order.pickupCode}`}>
            <div>
              <div className="shop-card-header">
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{order.studentName}</h3>
                <span className="shop-code-badge">{order.pickupCode}</span>
              </div>

              <div style={{ margin: '14px 0', fontSize: '14px', color: '#e5e7eb' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span className="shop-spec-badge">{order.copies} {order.copies === 1 ? 'copy' : 'copies'}</span>
                  <span className="shop-spec-badge" style={{ color: order.isColor ? '#ffca28' : '#e0e0e0' }}>
                    {order.isColor ? '🎨 Color' : '⚫ B&W'}
                  </span>
                  <span className="shop-spec-badge" style={{ color: '#81c784' }}>₹{order.totalPaid} Paid</span>
                </div>
                <div style={{ color: 'var(--dark-text-muted)', fontSize: '12px' }}>
                  Submitted: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              {/* Actions Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                
                {/* 📄 PDF Button */}
                {order.pdfUrl && (
                  <a 
                    href={`${import.meta.env.VITE_API_URL}/uploads/${order.pdfUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      borderRadius: '8px', 
                      textDecoration: 'none', 
                      color: '#6366f1', 
                      fontWeight: 700, 
                      fontSize: '14px',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      transition: 'var(--transition)'
                    }}
                    className="shop-pdf-link"
                  >
                    📄 Open PDF Document
                  </a>
                )}

                {/* 💸 View Screenshot Modal Trigger */}
                {order.paymentScreenshotUrl && (
                  <button 
                    onClick={() => setScreenshotModalUrl(`${import.meta.env.VITE_API_URL}/uploads/${order.paymentScreenshotUrl}`)}
                    style={{ 
                      padding: '10px', 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                      borderRadius: '8px', 
                      color: '#10b981', 
                      fontWeight: 700, 
                      fontSize: '14px', 
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    className="shop-screenshot-btn"
                  >
                    💸 View Payment Screenshot
                  </button>
                )}
              </div>

              {/* Status Action Buttons */}
              {order.status === 'Pending' && (
                <button 
                  onClick={() => updateStatus(order._id, 'Ready')} 
                  className="btn btn-success"
                  id={`mark-ready-${order.pickupCode}`}
                >
                  ✓ Print Done (Mark Ready)
                </button>
              )}

              {order.status === 'Ready' && (
                <button 
                  onClick={() => updateStatus(order._id, 'Picked Up')} 
                  className="btn btn-primary"
                  style={{ backgroundColor: '#4f46e5' }}
                  id={`mark-pickup-${order.pickupCode}`}
                >
                  📦 Student Picked Up
                </button>
              )}

              {order.status === 'Picked Up' && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '8px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid var(--dark-border)',
                  borderRadius: '6px',
                  color: 'var(--dark-text-muted)',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  ✅ Order Completed & Archived
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getOrdersForCurrentTab().length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          backgroundColor: 'var(--dark-card)', 
          border: '1px dashed var(--dark-border)',
          borderRadius: '12px',
          color: 'var(--dark-text-muted)' 
        }} id="empty-state-container">
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
          <h3>No orders in this section</h3>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>New orders will automatically appear here as they are placed.</p>
        </div>
      )}

      {/* 💸 INLINE PAYMENT SCREENSHOT MODAL OVERLAY */}
      {screenshotModalUrl && (
        <div 
          className="modal-overlay" 
          onClick={() => setScreenshotModalUrl(null)}
          id="screenshot-modal-overlay"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setScreenshotModalUrl(null)}
              id="close-screenshot-modal"
            >
              &times;
            </button>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', marginBottom: '15px', color: 'white' }}>
              Payment Screenshot Verification
            </h3>
            <img 
              src={screenshotModalUrl} 
              alt="Payment Screenshot" 
              className="modal-img" 
              id="screenshot-modal-img"
            />
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <a 
                href={screenshotModalUrl} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-outline"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '13px', color: 'white', border: '1px solid var(--dark-border)' }}
              >
                🔗 Open in New Tab
              </a>
              <button 
                onClick={() => setScreenshotModalUrl(null)} 
                className="btn btn-primary"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopDashboard;