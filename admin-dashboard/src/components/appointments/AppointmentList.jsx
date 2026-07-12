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
      setError('Failed to retrieve the consultation queue.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to transition status state:', err);
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    activeFilter === 'All' ? true : appt.status === activeFilter
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
      case 'Pending':   return 'border-amber-500/20  bg-amber-500/10  text-amber-400';
      case 'Completed': return 'border-info/20        bg-info/10        text-info';
      default:          return 'border-border         bg-muted          text-muted-foreground';
    }
  };

  const filters = ['All', 'Pending', 'Confirmed', 'Completed'];

  return (
    <div className="space-y-6 animate-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Consultation Queue
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, approve, or reject incoming appointment requests.
          </p>
        </div>

        {/* Status filter pill group */}
        <div className="flex rounded-md border border-border bg-muted p-1 gap-0.5">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card/50">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Cards grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Client + status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-card-foreground">
                        {appt.clientName}
                      </h3>
                      <p className="text-xs text-info mt-0.5">{appt.caseType}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(appt.status)}`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* Date / Time row */}
                <div className="grid grid-cols-2 gap-2 border-t border-b border-border py-3 text-muted-foreground">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{appt.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{appt.time}</span>
                  </div>
                </div>
              </div>

              {/* Pending actions */}
              {appt.status === 'Pending' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(appt.id, 'Confirmed')}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-destructive/20 bg-destructive/10 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}

              {/* Confirmed actions */}
              {appt.status === 'Confirmed' && (
                <div className="mt-4">
                  <button
                    onClick={() => handleStatusChange(appt.id, 'Completed')}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border border-info/20 bg-info/10 py-2 text-xs font-semibold text-info transition-colors hover:bg-info/20"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Mark Completed
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-12 text-center text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">No appointments found matching this filter.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
