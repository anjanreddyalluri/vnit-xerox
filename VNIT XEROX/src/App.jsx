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
          <div style={{ padding: '5%', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>VNIT Campus Print</h1>
            
            {/* Mobile Responsive Flexbox */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 350px', maxWidth: '500px' }}>
                <OrderForm />
              </div>
              <div style={{ flex: '1 1 350px', maxWidth: '500px' }}>
                <StatusTracker />
              </div>
            </div>

          </div>
        } />
        
        <Route path="/shop" element={<ShopDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;