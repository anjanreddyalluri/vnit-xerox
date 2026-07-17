import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderForm from './OrderForm';
import StatusTracker from './StatusTracker';
import ShopDashboard from './ShopDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 0.5s ease-out' }}>
              <img 
                src="/logo.png" 
                alt="XeroxIt Logo" 
                style={{ height: '100px', marginBottom: '10px', objectFit: 'contain' }} 
                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }}
              />
              <h1 style={{ 
                display: 'none', 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: '2.8rem', 
                fontWeight: 800, 
                color: 'var(--primary)', 
                marginBottom: '10px'
              }}>
                XeroxIt
              </h1>
              <p style={{ color: 'var(--light-text-muted)', fontSize: '1.2rem', fontWeight: 600, maxWidth: '600px', margin: '0 auto', letterSpacing: '0.5px' }}>
                Print Without Waiting.
              </p>
            </header>
            
            {/* Mobile Responsive Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '30px', 
              justifyContent: 'center', 
              alignItems: 'start',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <div className="glass-container">
                <OrderForm />
              </div>
              <div className="glass-container">
                <StatusTracker />
              </div>
            </div>
            
            <footer style={{ marginTop: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              <p>© 2026 VNIT Campus Print System. Fast, paperless, and digitized.</p>
            </footer>
          </div>
        } />
        
        <Route path="/shop" element={<ShopDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;