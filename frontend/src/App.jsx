import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Simple example home component
function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the app!</p>
    </div>
  );
}

// Simple fallback component for unknown paths
function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go back home</Link>
    </div>
  );
}

export default function App() {
  return (
    /* Adding the future flags here removes the warnings */
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Fixes "No routes matched location '/'" by defining the path="/" route */}
        <Route path="/" element={<Home />} />
        
        {/* Catches any other unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}