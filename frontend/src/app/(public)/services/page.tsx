import { Scale, Shield, Users, Briefcase, Home, FileText } from 'lucide-react';
import Link from 'next/link';

const services = [
  { icon: Shield, title: 'Corporate Law', desc: 'Comprehensive legal support for businesses including company formation, mergers & acquisitions, joint ventures, corporate governance, compliance advisory, and contract drafting & review.', areas: ['Company Registration', 'M&A Advisory', 'Board Resolutions', 'Regulatory Compliance'] },
  { icon: Users, title: 'Family Law', desc: 'Compassionate guidance through sensitive family matters including divorce proceedings, child custody, alimony, adoption, and domestic violence protection.', areas: ['Divorce Proceedings', 'Child Custody', 'Adoption', 'Domestic Violence'] },
  { icon: Home, title: 'Property Law', desc: 'Expert assistance with real estate transactions, property disputes, title verification, lease agreements, and land acquisition matters.', areas: ['Property Disputes', 'Title Verification', 'Lease Agreements', 'Land Acquisition'] },
  { icon: Briefcase, title: 'Employment Law', desc: 'Protection of workplace rights including wrongful termination, employment contracts, harassment claims, and labor dispute resolution.', areas: ['Wrongful Termination', 'Workplace Harassment', 'Employment Contracts', 'Labor Disputes'] },
  { icon: Scale, title: 'Criminal Law', desc: 'Robust defense representation for criminal charges including bail applications, trial advocacy, appeal proceedings, and legal consultations.', areas: ['Bail Applications', 'Trial Defense', 'Appeals', 'Legal Consultations'] },
  { icon: FileText, title: 'Civil Litigation', desc: 'Skilled representation in civil disputes including breach of contract, tort claims, injunctions, and recovery suits.', areas: ['Contract Disputes', 'Tort Claims', 'Injunctions', 'Recovery Suits'] },
];

export default function ServicesPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      {/* Header Section */}
      <section className="relative py-24 md:py-32 bg-[#0F172A] text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-3">Our Expertise</h2>
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">Areas of Practice</h1>
          <p className="text-lg md:text-xl text-slate-300 font-light">Comprehensive, strategic legal solutions tailored to protect your interests and drive success.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-yellow-600/50 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl group-hover:bg-yellow-600/10 transition-colors" />
              <div className="relative z-10">
                <s.icon className="w-12 h-12 text-slate-900 group-hover:text-yellow-600 transition-colors mb-6" />
                <h3 className="text-2xl font-bold font-serif text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed min-h-[80px]">{s.desc}</p>
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Services</h4>
                  <ul className="space-y-2">
                    {s.areas.map((a) => (
                      <li key={a} className="text-sm font-medium text-slate-700 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0F172A] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Need Legal Assistance?</h2>
          <p className="text-slate-300 text-lg md:text-xl mb-10 font-light">Schedule a confidential consultation to discuss your specific legal needs with our expert team.</p>
          <Link href="/book" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-600 text-white rounded-none font-bold tracking-wider uppercase hover:bg-yellow-700 transition-all shadow-lg hover:shadow-yellow-600/20">
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}