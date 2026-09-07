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
      setSlots(data.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)));
      setError(null);
    } catch (err) {
      setError('Failed to load availability calendar settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSlot(formData);
      setIsModalOpen(false);
      setFormData({ date: '', startTime: '', endTime: '' });
      await fetchSlots();
    } catch (err) {
      console.error('Failed to append availability block:', err);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      await toggleSlotStatus(id, currentStatus);
      await fetchSlots();
    } catch (err) {
      console.error('Failed to alter timing block validation status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently drop this availability block from intake pipelines?')) return;
    try {
      await removeSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to destroy scheduling configuration entry:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Availability Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure active consultation timing blocks for intake workflows.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Time Block
        </button>
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

      {/* Slots grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`card p-5 flex flex-col justify-between transition-opacity ${
                slot.isBlocked ? 'opacity-50' : 'hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Date row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <Calendar className="h-4 w-4 text-info" />
                    <span>{slot.date}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="btn-destructive-ghost"
                    aria-label="Delete slot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Time row */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{slot.startTime} – {slot.endTime}</span>
                </div>
              </div>

              {/* Footer: status + toggle */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    slot.isBlocked ? 'text-warning' : 'text-success'
                  }`}
                >
                  {slot.isBlocked ? 'On Hold' : 'Open for Intake'}
                </span>

                <button
                  onClick={() => handleToggleBlock(slot.id, slot.isBlocked)}
                  className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                    slot.isBlocked
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : 'bg-warning/10 text-warning hover:bg-warning/20'
                  }`}
                >
                  {slot.isBlocked ? (
                    <><Shield className="h-3 w-3" /> Unblock</>
                  ) : (
                    <><ShieldAlert className="h-3 w-3" /> Block</>
                  )}
                </button>
              </div>
            </div>
          ))}

          {slots.length === 0 && (
            <div className="col-span-full rounded-xl border-2 border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No timing slots configured. Use the generator to create open schedules.
            </div>
          )}
        </div>
      )}

      {/* Add slot modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Open Availability Block"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="slot-date">Target Date</label>
            <input
              id="slot-date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="slot-start">Start Time</label>
              <input
                id="slot-start"
                type="text"
                required
                placeholder="e.g. 10:00 AM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="slot-end">End Time</label>
              <input
                id="slot-end"
                type="text"
                required
                placeholder="e.g. 11:00 AM"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Generate Block
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
