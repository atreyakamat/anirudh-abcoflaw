import { PageHeader } from '@/components/page-header';
import { SITE_CONFIG } from '@/lib/config/site-config';
import { ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen pb-20">
      
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> Website terms govern administrative use in accordance with applicable advocate standards in India.</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="pt-10 mb-8">
        <PageHeader 
          badge="Legal Terms" 
          title="Terms of Website Use" 
          subtitle="Conditions governing website access, appointment requests, and information disclaimers." 
        />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 text-slate-700 text-sm leading-relaxed">
          <p className="text-xs text-slate-400 font-mono">Last updated: July 30, 2026</p>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">1. General Information Purpose Only</h2>
            <p>{SITE_CONFIG.bciDisclaimer.fullLegalDisclaimer}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">2. No Solicitor-Client / Advocate-Client Relationship</h2>
            <p>Accessing website content, submitting contact forms, or requesting an appointment does not automatically establish an advocate-client relationship. Formal legal engagement occurs only upon mutual agreement and explicit written acceptance by Advocate Anirudha Sinai Borkar.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">3. Appointment Requests & Fee Policy</h2>
            <p>Submitting an appointment request is an administrative inquiry subject to schedule availability. The standard initial consultation fee is <strong>{SITE_CONFIG.consultation.fee} for a 60-minute session</strong>. Fee payment is requested prior to appointment confirmation. Please provide at least 24 hours advance notice for cancellations or rescheduling.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">4. Intellectual Property & Informational Content</h2>
            <p>All legal notes, articles, and content published on this website are protected under applicable Indian copyright laws. Content may be accessed for personal informational use only and may not be reproduced for commercial purposes without prior authorization.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">5. Governing Law & Jurisdiction</h2>
            <p>These terms and all website administrative matters are governed by the laws of India. Any legal disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of competent courts in Goa (Panaji / Mapusa).</p>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">6. Contact Information</h2>
            <p>For administrative questions regarding website terms, please contact <strong>{SITE_CONFIG.contact.email}</strong> or visit our office in Porvorim, North Goa.</p>
          </div>
        </div>
      </div>
    </div>
  );
}