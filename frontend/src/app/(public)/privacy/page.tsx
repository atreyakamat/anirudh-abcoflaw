import { PageHeader } from '@/components/page-header';
import { SITE_CONFIG } from '@/lib/config/site-config';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen pb-20">
      
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> Data handling is governed by professional advocate confidentiality standards in India.</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="pt-10 mb-8">
        <PageHeader 
          badge="Data Governance" 
          title="Privacy Policy" 
          subtitle="Transparency regarding data collection, client confidentiality, and technical infrastructure." 
        />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 text-slate-700 text-sm leading-relaxed">
          <p className="text-xs text-slate-400 font-mono">Last updated: July 30, 2026</p>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">1. Information We Collect</h2>
            <p>We collect information submitted directly through our administrative forms, including full name, email address, telephone number, appointment preferences, brief matter descriptions, and optional documents uploaded for consultation context.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">2. How Information Is Used</h2>
            <p>Collected information is utilized strictly to schedule and manage appointments, process administrative fees, provide client portal access, communicate regarding matters, and fulfill statutory legal recordkeeping obligations.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">3. Professional Confidentiality</h2>
            <p>As a licensed legal practice, information shared during formal advocate-client consultations is protected by professional confidentiality standards under Indian law. Website inquiries prior to formal engagement are handled with strict privacy protocols.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">4. Third-Party Technical Infrastructure</h2>
            <p>To operate our digital services, technical data is processed through secure third-party infrastructure providers, including cloud hosting platforms, encrypted PostgreSQL databases, SMS/email gateway services, and payment processors. These providers process data solely as required to perform infrastructure services and under strict security standards.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">5. Data Retention & Access Rights</h2>
            <p>Information is retained in accordance with professional legal recordkeeping rules and applicable statutory requirements. Clients may contact our office to request access or correction to their administrative contact records.</p>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-2">6. Privacy Enquiries</h2>
            <p>For administrative or privacy questions, please contact our office at <strong>{SITE_CONFIG.contact.email}</strong> or visit our office in Porvorim, North Goa.</p>
          </div>
        </div>
      </div>
    </div>
  );
}