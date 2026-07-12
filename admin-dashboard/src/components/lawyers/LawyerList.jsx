import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { addLawyer, getAllLawyers } from '../../services/lawyerService';

export default function LawyerList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialization: '' });
  
  // Database state
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const data = await getAllLawyers();
      setLawyers(data);
      setError(null);
    } catch (err) {
      setError("Failed to load lawyers database.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const handleDelete = async (id) => {
    // Basic browser confirmation before dropping database records
    if (!window.confirm("Are you sure you want to remove this lawyer from the directory?")) return;

    try {
      console.log(`Deleting lawyer with ID: ${id}`);
      await removeLawyer(id);
      
      // Optimistic UI change: filter out the deleted card immediately
      setLawyers(prev => prev.filter(lawyer => lawyer.id !== id));
    } catch (error) {
      console.error("Failed to delete lawyer from Firestore:", error);
      alert("Could not complete removal. Please check your connection.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting new lawyer:", formData);
      await addLawyer(formData.name, formData.specialization);
      setIsModalOpen(false);
      setFormData({ name: '', specialization: '' });
      await fetchLawyers(); // Refresh list
    } catch (error) {
      console.error("Failed to add lawyer to database:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Lawyers Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" /> Add Lawyer
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition-all hover:border-slate-700">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100">{lawyer.name}</h3>
                  <p className="mt-1 text-xs text-blue-400">{lawyer.specialization}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1.5 text-slate-500 hover:bg-red-950/30 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <span className="inline-block rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {lawyer.status || 'Active'}
              </span>
            </div>
          ))}

          {lawyers.length === 0 && (
            <div className="col-span-full rounded-xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500">
              No lawyers added to the directory yet.
            </div>
          )}
        </div>
      )}

      {/* Add Lawyer Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Lawyer"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Adv. John Doe"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Specialization</label>
            <input
              type="text"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Corporate Law"
            />
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
              Save Lawyer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
