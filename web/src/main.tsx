import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { App } from './App';
import Auth from './components/Auth';
import ForgotPassword from './components/ForgotPassword';
import { YearlySummary } from './components/YearlySummary';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/app" element={<App />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/yearly-summary" element={<YearlySummary />} />
      </Routes>
    </Router>
  </React.StrictMode>
);