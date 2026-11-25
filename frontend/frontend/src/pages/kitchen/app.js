import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/kitchen/Layout';
import Dashboard from './components/kitchen/Dashboard';
import IncomingOrders from './components/kitchen/IncomingOrders';
import InProgressOrders from './components/kitchen/InProgressOrders';
import ReadyToServe from './components/kitchen/ReadyToServe';
import CompletedOrders from './components/kitchen/CompletedOrders';
import Ingredients from './components/kitchen/Ingredients';
import KitchenReports from './components/kitchen/KitchenReports';
import Performance from './components/kitchen/Performance';
import Settings from './components/kitchen/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="incoming" element={<IncomingOrders />} />
          <Route path="in-progress" element={<InProgressOrders />} />
          <Route path="ready" element={<ReadyToServe />} />
          <Route path="completed" element={<CompletedOrders />} />
          <Route path="ingredients" element={<Ingredients />} />
          <Route path="reports" element={<KitchenReports />} />
          <Route path="performance" element={<Performance />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;