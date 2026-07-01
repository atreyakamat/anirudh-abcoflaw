import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, XCircle } from 'lucide-react';

// Mock data to visualize the UI before Firebase integration
const MOCK_APPOINTMENTS = [
  { id: '1', client: 'Priya Mehta', lawyer: 'Adv. Rohan Sharma', date: '2026-07-05', time: '10:00 AM', type: 'Property Dispute', status: 'confirmed' },
  { id: '2', client: 'Rahul Desai', lawyer: 'Adv. Rohan Sharma', date: '2026-07-05', time: '11:30 AM', type: 'Family Law', status: 'pending' },
  { id: '3', client: 'Amit Patel', lawyer: 'Adv. Neha Gupta', date: '2026-07-06', time: '02:00 PM', type: 'Corporate', status: 'confirmed' },
  { id: '4', client: 'Sneha Rao', lawyer: 'Adv. Neha Gupta', date: '2026-07-06', time: '04:15 PM', type: 'Criminal Defense', status: 'cancelled' },
  { id: '5', client: 'Vikram Singh', lawyer: 'Adv. Rohan Sharma', date: '2026-07-07', time: '09:00 AM', type: 'Property Dispute', status: 'confirmed' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  
  const icons = {
    confirmed: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />,
    pending: <Clock className="w-3.5 h-3.5 mr-1.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5 mr-1.5" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function AppointmentsList() {
  const [searchTerm, setSearchTerm] = useState('');

  // Simple filter logic for the mock data
  const filteredAppointments = MOCK_APPOINTMENTS.filter(appt => 
    appt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.lawyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Appointments</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and view all upcoming client consultations.</p>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search clients or lawyers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Lawyer</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Case Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-900/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-200">{appt.client}</td>
                  <td className="px-6 py-4">{appt.lawyer}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200">{appt.date}</span>
                      <span className="text-slate-500 text-xs">{appt.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{appt.type}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
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
