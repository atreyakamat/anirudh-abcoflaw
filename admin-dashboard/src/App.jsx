import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import AppointmentList from './components/appointments/AppointmentList'; // Fixed singular filename path
import LawyerList from './components/lawyers/LawyerList.jsx';

// This acts as a wrapper for all pages that need the sidebar
function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// Main Landings Overview Panel
function Dashboard() {
  return (
    <>
      <header className="border-b border-slate-800 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Welcome back, Admin</h2>
        <p className="text-sm text-slate-400">Here's a breakdown of the firm's schedule today.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl">
          <h3 className="text-sm font-medium text-slate-400">Total Bookings Today</h3>
          <p className="text-3xl font-bold text-slate-100 mt-2">14</p>
        </div>
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl">
          <h3 className="text-sm font-medium text-slate-400">Active Attending Lawyers</h3>
          <p className="text-3xl font-bold text-slate-100 mt-2">4</p>
        </div>
      </div>
    </>
  );
}

// Temporary Placeholder for other pages
function PlaceholderPage({ title }) {
  return (
    <div className="flex h-full items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-12">
      <h2 className="text-xl font-medium text-slate-500">{title} Area Coming Soon</h2>
    </div>
  );
}

export default function App() {
  // Hardcoded for now until we connect Firebase Auth
  const isAuthenticated = true; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
        />

        {/* Protected Routes (Wrapped in DashboardLayout) */}
        <Route 
          path="/" 
          element = {
            isAuthenticated ? (
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Sub-navigation Module Targets */}
        <Route path="/appointments" element={isAuthenticated ? <DashboardLayout><AppointmentList /></DashboardLayout> : <Navigate to="/login" />} />
        <Route path="/lawyers" element={isAuthenticated ? <DashboardLayout><LawyerList /></DashboardLayout> : <Navigate to="/login" />} />
        <Route path="/availability" element={isAuthenticated ? <DashboardLayout><PlaceholderPage title="Availability Slots" /></DashboardLayout> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
