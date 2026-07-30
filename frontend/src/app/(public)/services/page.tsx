import { Shield, Landmark, ArrowRight, FileText, Briefcase, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

const practiceAreasDetailed = [
  {
    icon: Landmark,
    title: 'Civil & Criminal Litigation (Goa Courts)',
    desc: 'Representing clients in civil disputes (property, contracts, succession) and criminal matters. Experienced in trial court proceedings and appellate practice before the Bombay High Court (Panaji Bench) and Goa’s District & Sessions Courts.',
  },
  {
    icon: FileText,
    title: 'Property & Conveyancing',
    desc: 'Advising on real estate and property development in Goa. Drafting sale and lease agreements, guiding RERA compliance, title verification, stamp duty issues, and resolving property ownership or transfer disputes.',
  },
  {
    icon: Shield,
    title: 'Family Law & Succession (Goa Civil Code)',
    desc: 'Assisting with matrimonial matters (divorce, custody, maintenance) and inheritance (succession) under Goa’s unique Civil Code (Portuguese Civil Law). Drafting wills and managing probate (inventory) proceedings.',
  },
  {
    icon: Briefcase,
    title: 'Business & Commercial Advisory',
    desc: 'Guiding entrepreneurs and Goa-based companies on statutory requirements, drafting commercial contracts, shareholder & partnership agreements, company formation, and resolving corporate & contractual disputes.',
  },
  {
    icon: Globe,
    title: 'Other Legal Services (Notary & IP)',
    desc: 'Central Government Notary services for official document attestation, alongside preliminary Intellectual Property guidance (collaborating with specialist Goa IP experts for complex registrations).',
  },
];

export default function ServicesPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      
      {/* BCI Compliance Disclaimer Header Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> Factual practice area descriptions per Rule 36 of Bar Council of India Rules (1975). Informational purposes only.</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="pt-10">
        <PageHeader 
          badge="Core Areas" 
          title="Strategic Legal Focus" 
          subtitle="Specialized legal counsel for individuals and businesses across Goa." 
        />
      </div>

      {/* Services List Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-widest text-yellow-600 uppercase mb-2">Our Areas of Practice</h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">Core Legal Practice Areas</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We concentrate on core legal fields relevant to Goa residents and commercial entities. By specializing, we deliver focused, expert advocacy in each domain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {practiceAreasDetailed.map((area, idx) => (
              <div key={idx} className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-yellow-600/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-6">
                    <area.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-slate-900 mb-3">{area.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{area.desc}</p>
                </div>
                <Link href="/book" className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-yellow-600 transition-colors pt-4 border-t border-slate-200">
                  <span>Schedule Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Schedule an Administrative Consultation</h2>
          <p className="text-slate-300 text-sm mb-8 leading-relaxed">
            Consultations are held at our Porvorim office (near Panaji) or via video call. Standard consultation fee: <strong>₹2,500 for a 60-minute session</strong>.
          </p>
          <Link href="/book" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-500 transition-all text-xs">
            Schedule Appointment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}