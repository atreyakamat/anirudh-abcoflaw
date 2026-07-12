import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Briefcase } from 'lucide-react';
import Modal from '../common/Modal';
import { addLawyer, getAllLawyers, removeLawyer, updateLawyer } from '../../services/lawyerService';

export default function LawyerList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialization: '' });
  const [editingId, setEditingId] = useState(null);

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
      setError('Failed to load lawyers database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLawyers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this lawyer from the directory?')) return;
    try {
      console.log(`Deleting lawyer with ID: ${id}`);
      await removeLawyer(id);
      setLawyers((prev) => prev.filter((lawyer) => lawyer.id !== id));
    } catch (error) {
      console.error('Failed to delete lawyer from Firestore:', error);
      alert('Could not complete removal. Please check your connection.');
    }
  };

  const openEditModal = (lawyer) => {
    setEditingId(lawyer.id);
    setFormData({ name: lawyer.name, specialization: lawyer.specialization });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', specialization: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        console.log('Updating lawyer:', editingId);
        await updateLawyer(editingId, formData);
      } else {
        console.log('Submitting new lawyer:', formData);
        await addLawyer(formData.name, formData.specialization);
      }
      setIsModalOpen(false);
      setFormData({ name: '', specialization: '' });
      setEditingId(null);
      await fetchLawyers();
    } catch (error) {
      console.error('Failed to save lawyer to database:', error);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Lawyers Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, or remove lawyers from the firm directory.
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Lawyer
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

      {/* Lawyer grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">{lawyer.name}</h3>
                    <p className="mt-0.5 text-xs text-info">{lawyer.specialization}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(lawyer)}
                    className="btn-ghost"
                    aria-label="Edit lawyer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(lawyer.id)}
                    className="btn-destructive-ghost"
                    aria-label="Delete lawyer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <span className="inline-block rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {lawyer.status || 'Active'}
              </span>
            </div>
          ))}

          {lawyers.length === 0 && (
            <div className="col-span-full rounded-xl border-2 border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No lawyers added to the directory yet.
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingId(null); }}
        title={editingId ? 'Edit Lawyer Details' : 'Add New Lawyer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="lawyer-name">Full Name</label>
            <input
              id="lawyer-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g. Adv. John Doe"
            />
          </div>
          <div>
            <label className="label" htmlFor="lawyer-spec">Specialization</label>
            <input
              id="lawyer-spec"
              type="text"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="input"
              placeholder="e.g. Corporate Law"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setEditingId(null); }}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Save Changes' : 'Save Lawyer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
