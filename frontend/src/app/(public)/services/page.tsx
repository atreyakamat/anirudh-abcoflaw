import { Scale, Shield, Landmark, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      {/* Header Section */}
      <section className="relative py-24 md:py-32 bg-[#0F172A] text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-3">Unlimited Scope</h2>
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight">Comprehensive Legal Solutions</h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            The law is vast and every case is unique. Rather than limiting our practice to predefined categories, we provide holistic and adaptive legal strategies across all dimensions of the law.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold font-serif text-slate-900 leading-tight">
                Curated Advice by Expert Lawyers
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  At AB & Co. Legal, we believe that strict boundaries between legal domains often fail to capture the complexity of real-world problems. Whether you are navigating a high-stakes commercial tech negotiation, structuring a property transaction, or seeking an amicable resolution to a sensitive family dispute, your legal representation should be as dynamic as your needs.
                </p>
                <p>
                  Our expertise spans across vital sectors of law. We do not confine our services to a rigid menu. Instead, we analyze the specific intricacies of your situation and craft a bespoke legal strategy designed to protect your interests, secure your assets, and deliver justice.
                </p>
              </div>
              <ul className="space-y-4 pt-4">
                {[
                  'Adaptive Litigation Strategies',
                  'Cross-Domain Legal Consultancy',
                  'Strategic Dispute Resolution',
                  'Comprehensive Regulatory Compliance'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-800 font-medium">
                    <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 bg-yellow-600/5 rounded-3xl transform translate-x-4 -translate-y-4" />
              <div className="space-y-6 relative z-10 pt-12">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/lawyer2.png" alt="Legal Associate" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/lawyer1.png" alt="Advocate Anirudha" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Approach Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-3">Our Methodology</h2>
          <h3 className="text-4xl font-serif font-bold text-slate-900 mb-16">How We Protect You</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Scale, title: 'Analyze', desc: 'We take the time to thoroughly understand the nuances of your situation, examining all angles without assuming a one-size-fits-all approach.' },
              { icon: Landmark, title: 'Strategize', desc: 'Drawing upon decades of combined experience across civil, corporate, and criminal sectors, we formulate a robust, multi-dimensional plan.' },
              { icon: Shield, title: 'Execute', desc: 'Whether inside the courtroom or at the negotiation table, we execute our strategy with precision, aggression when necessary, and profound empathy.' }
            ].map((step, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-yellow-600/30 transition-all duration-300">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-900 border border-slate-100">
                  <step.icon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold font-serif text-slate-900 mb-4">{step.title}</h4>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0F172A] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-900/20 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Let Us Handle the Complexity</h2>
          <p className="text-slate-300 text-lg md:text-xl mb-10 font-light leading-relaxed">
            Do not let the confines of legal terminology dictate your approach. Bring us your problem, and we will find the legal solution.
          </p>
          <Link href="/book" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-600 text-white rounded-lg font-bold tracking-wide hover:bg-yellow-500 transition-all shadow-lg hover:shadow-yellow-600/20">
            Discuss Your Case With Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}