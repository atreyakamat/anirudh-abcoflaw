import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getAllAppointments, updateAppointmentStatus } from '../../services/appointmentService';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAllAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError("Failed to retrieve the consultation queue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      await fetchAppointments(); // Hot reload local view
    } catch (err) {
      console.error("Failed to transition status state:", err);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (activeFilter === 'All') return true;
    return appt.status === activeFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
      case 'Pending': return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
      case 'Completed': return 'border-blue-500/20 bg-blue-500/10 text-blue-400';
      default: return 'border-slate-700 bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Consultation Queue</h2>
        
        {/* State Filters */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
          {['All', 'Pending', 'Confirmed', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition-all hover:border-slate-700 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-300">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{appt.clientName}</h3>
                      <p className="text-xs text-blue-400 mt-0.5">{appt.caseType}</p>
                    </div>
                  </div>
                  <span className={`rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-900 py-3 text-slate-400">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{appt.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{appt.time}</span>
                  </div>
                </div>
              </div>

              {/* Conditional Action Controls based on status state */}
              {appt.status === 'Pending' && (
                <div className="mt-4 flex gap-2 pt-2">
                  <button 
                    onClick={() => handleStatusChange(appt.id, 'Confirmed')}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 py-2 text-xs font-semibold transition-colors"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/10 py-2 text-xs font-semibold transition-colors"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}

              {appt.status === 'Confirmed' && (
                <div className="mt-4 pt-2">
                  <button 
                    onClick={() => handleStatusChange(appt.id, 'Completed')}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-2 text-xs font-semibold transition-colors"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Mark Completed
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="col-span-full rounded-xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6 text-slate-600" />
              <span>No appointments found matching this queue filter.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
