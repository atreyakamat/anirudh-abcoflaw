import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Shield, ShieldAlert, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { getAllSlots, addSlot, toggleSlotStatus, removeSlot } from '../../services/availabilityService';

export default function AvailabilitySlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getAllSlots();
      // Sort slots chronologically by date and start time
      setSlots(data.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)));
      setError(null);
    } catch (err) {
      setError("Failed to load availability calendar settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSlot(formData);
      setIsModalOpen(false);
      setFormData({ date: '', startTime: '', endTime: '' });
      await fetchSlots();
    } catch (err) {
      console.error("Failed to append availability block:", err);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      await toggleSlotStatus(id, currentStatus);
      await fetchSlots();
    } catch (err) {
      console.error("Failed to alter timing block validation status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently drop this availability block from intake pipelines?")) return;
    try {
      await removeSlot(id);
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to destroy scheduling configuration entry:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Availability Management</h2>
          <p className="text-xs text-slate-400 mt-1">Configure active consultation timing blocks for intake workflows.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" /> Add Time Block
        </button>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <div 
              key={slot.id} 
              className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                slot.isBlocked 
                  ? 'border-slate-800/60 bg-slate-950/40 opacity-60' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>{slot.date}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="rounded p-1 text-slate-500 hover:bg-red-950/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                  slot.isBlocked ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {slot.isBlocked ? 'On Hold (Blocked)' : 'Open for Intake'}
                </span>
                
                <button
                  onClick={() => handleToggleBlock(slot.id, slot.isBlocked)}
                  className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                    slot.isBlocked
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  }`}
                >
                  {slot.isBlocked ? (
                    <><Shield className="h-3 w-3" /> Unblock</>
                  ) : (
                    <><ShieldAlert className="h-3 w-3" /> Block Slot</>
                  )}
                </button>
              </div>
            </div>
          ))}

          {slots.length === 0 && (
            <div className="col-span-full rounded-xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500">
              No timing slots configured. Use the generator to create open schedules.
            </div>
          )}
        </div>
      )}

      {/* Configuration Dialog Wrapper */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Open Availability Block">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Target Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Start Time</label>
              <input
                type="text"
                required
                placeholder="e.g. 10:00 AM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">End Time</label>
              <input
                type="text"
                required
                placeholder="e.g. 11:00 AM"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Generate Block
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
