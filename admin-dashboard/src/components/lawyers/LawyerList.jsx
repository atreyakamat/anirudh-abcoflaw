import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function LawyerList() {
  const lawyers = [
    { id: 1, name: 'Adv. Rohan Sharma', specialization: 'Property Dispute', status: 'Active' },
    { id: 2, name: 'Adv. Neha Gupta', specialization: 'Corporate Law', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Lawyers Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all">
          <Plus className="h-4 w-4" /> Add Lawyer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lawyers.map((lawyer) => (
          <div key={lawyer.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-100">{lawyer.name}</h3>
                <p className="text-xs text-blue-400 mt-1">{lawyer.specialization}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-500 hover:text-slate-300"><Edit2 className="h-4 w-4" /></button>
                <button className="p-1.5 text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {lawyer.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
