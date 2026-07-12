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
    <div className="animate-in">
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto px-4"><h1 className="text-4xl font-bold mb-4">Our Services</h1><p className="text-lg text-muted-foreground">Comprehensive legal solutions tailored to your needs.</p></div>
      </section>
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (<div key={s.title} className="border rounded-xl p-6 hover:shadow-lg transition-shadow"><s.icon className="w-10 h-10 text-primary mb-4" /><h3 className="text-xl font-bold mb-2">{s.title}</h3><p className="text-sm text-muted-foreground mb-4">{s.desc}</p><ul className="space-y-1">{s.areas.map((a) => <li key={a} className="text-sm text-muted-foreground flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/50">{a}</li>)}</ul></div>))}
        </div>
      </section>
      <section className="py-16 bg-muted/30 text-center"><div className="max-w-3xl mx-auto px-4"><h2 className="text-2xl font-bold mb-4">Need Legal Assistance?</h2><p className="text-muted-foreground mb-6">Schedule a consultation to discuss your specific legal needs.</p><Link href="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">Book a Consultation</Link></div></section>
    </div>
  );
}