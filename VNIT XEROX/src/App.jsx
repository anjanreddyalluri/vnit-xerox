import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderForm from './OrderForm';
import StatusTracker from './StatusTracker';
import ShopDashboard from './ShopDashboard';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
              
              {/* Header */}
              <header style={{ 
                backgroundColor: 'var(--surface)', 
                padding: '1.5rem 2rem', 
                boxShadow: 'var(--shadow-sm)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/Profile.png" alt="XeroxIt Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  <img src="/Text.png" alt="XeroxIt" style={{ height: '28px', objectFit: 'contain' }} />
                </div>
              </header>

              {/* Main Content */}
              <main style={{ flex: 1, padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  
                  <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
                      Skip the line. Print online.
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                      Upload your documents, pay securely via UPI, and pick them up instantly at the campus store.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                      <OrderForm />
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      <StatusTracker />
                    </div>
                  </div>

                </div>
              </main>

              {/* Footer */}
              <footer style={{ backgroundColor: 'var(--surface)', padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} XeroxIt. Digitizing campus life.</p>
              </footer>

            </div>
          } />
          
          <Route path="/shop" element={<ShopDashboard />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;