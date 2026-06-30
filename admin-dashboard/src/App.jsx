import React from 'react';
import Sidebar from './components/layout/Sidebar';

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Primary Dashboard Area Placeholder */}
      <main className="flex-1 p-8">
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
      </main>
    </div>
  );
}
