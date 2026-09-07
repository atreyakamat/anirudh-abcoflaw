import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, XCircle } from 'lucide-react';

// Mock data to visualize the UI before Firebase integration
const MOCK_APPOINTMENTS = [
  { id: '1', client: 'Priya Mehta',   lawyer: 'Adv. Rohan Sharma', date: '2026-07-05', time: '10:00 AM', type: 'Property Dispute',  status: 'confirmed' },
  { id: '2', client: 'Rahul Desai',   lawyer: 'Adv. Rohan Sharma', date: '2026-07-05', time: '11:30 AM', type: 'Family Law',         status: 'pending'   },
  { id: '3', client: 'Amit Patel',    lawyer: 'Adv. Neha Gupta',   date: '2026-07-06', time: '02:00 PM', type: 'Corporate',          status: 'confirmed' },
  { id: '4', client: 'Sneha Rao',     lawyer: 'Adv. Neha Gupta',   date: '2026-07-06', time: '04:15 PM', type: 'Criminal Defense',   status: 'cancelled' },
  { id: '5', client: 'Vikram Singh',  lawyer: 'Adv. Rohan Sharma', date: '2026-07-07', time: '09:00 AM', type: 'Property Dispute',   status: 'confirmed' },
];

const STATUS_STYLES = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending:   'bg-amber-500/10   text-amber-400   border-amber-500/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const STATUS_ICONS = {
  confirmed: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />,
  pending:   <Clock        className="w-3.5 h-3.5 mr-1.5" />,
  cancelled: <XCircle      className="w-3.5 h-3.5 mr-1.5" />,
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}
    >
      {STATUS_ICONS[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AppointmentsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = MOCK_APPOINTMENTS.filter(
    (appt) =>
      appt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.lawyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 animate-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Appointments</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and view all upcoming client consultations.</p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients or lawyers…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-9"
            />
          </div>
          <button className="btn-outline gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Lawyer</th>
                <th className="px-6 py-4 font-medium">Date &amp; Time</th>
                <th className="px-6 py-4 font-medium">Case Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-card-foreground">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{appt.client}</td>
                  <td className="px-6 py-4 text-muted-foreground">{appt.lawyer}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{appt.date}</span>
                      <span className="text-muted-foreground text-xs">{appt.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{appt.type}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="btn-ghost opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No appointments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
