import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import AppointmentList from './components/appointments/AppointmentList';
import LawyerList from './components/lawyers/LawyerList.jsx';
import AvailabilitySlots from './components/availability/AvailabilitySlots';
import { subscribeToAuthChanges } from './services/authService'; // Imported subscriber

// Wrapper for all authenticated pages
function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

// Stat card helper
function StatCard({ label, value }) {
  return (
    <div className="card p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

// Dashboard overview
function Dashboard() {
  return (
    <div className="space-y-8 animate-in">
      <header className="border-b border-border pb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back, Admin
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's a breakdown of the firm's schedule today.
        </p>
      </header>

      <section>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Today's Overview
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Bookings Today" value="14" />
          <StatCard label="Active Attending Lawyers" value="4" />
          <StatCard label="Pending Approvals" value="3" />
        </div>
      </section>
    </div>
  );
}

// Placeholder page
function PlaceholderPage({ title }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">{title} — Coming Soon</p>
    </div>
  );
}

export default function App() {
 const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen directly to active session tokens across updates
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
        />

        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route path="/appointments" element={isAuthenticated ? <DashboardLayout><AppointmentList /></DashboardLayout> : <Navigate to="/login" />} />
        <Route path="/lawyers" element={isAuthenticated ? <DashboardLayout><LawyerList /></DashboardLayout> : <Navigate to="/login" />} />
        <Route path="/availability" element={isAuthenticated ? <DashboardLayout><AvailabilitySlots /></DashboardLayout> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
} 
