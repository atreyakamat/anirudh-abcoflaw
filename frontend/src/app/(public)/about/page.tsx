import { Scale, Shield, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      {/* Header Section */}
      <section className="relative py-24 md:py-32 bg-[#0F172A] text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-3">Our Legacy</h2>
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">About AB & Co. Legal</h1>
          <p className="text-lg md:text-xl text-slate-300 font-light">Dedicated to providing exceptional legal services with integrity, precision, and professionalism in Goa and beyond.</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-4">Founded with a mission to make premium legal representation accessible, AB & Co. Legal has grown from a solo endeavor into a trusted institution in the Goan legal community.</p>
              <p className="text-slate-600 leading-relaxed text-lg">With extensive experience, we have successfully handled complex cases across multiple practice areas, from corporate tech contracts to sensitive family matters and robust government litigation.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full blur-3xl" />
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-6 relative z-10">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-lg relative z-10">We believe everyone deserves competent, strategic legal counsel. Our approach uniquely combines deep legal expertise with genuine care for our clients&apos; wellbeing, ensuring each case receives the meticulous attention it demands.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
            {[{ i: Shield, t: 'Integrity', d: 'Ethical practice above all' }, { i: Users, t: 'Client Focus', d: 'Your interests come first' }, { i: Award, t: 'Excellence', d: 'Delivering the best outcomes' }, { i: Scale, t: 'Fairness', d: 'Justice and equal treatment' }].map((v) => (
              <div key={v.t} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-yellow-600/10 transition-colors">
                  <v.i className="w-8 h-8 text-slate-900 group-hover:text-yellow-600 transition-colors" />
                </div>
                <h3 className="font-bold font-serif text-xl text-slate-900 mb-2">{v.t}</h3>
                <p className="text-sm text-slate-500">{v.d}</p>
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8">Qualifications & Memberships</h2>
            <ul className="space-y-4 text-slate-600 text-lg">
              <li className="flex items-center justify-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-600" /> LL.B. from V.M. Salgaocar College of Law, Goa University</li>
              <li className="flex items-center justify-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-600" /> Admitted to the Bar Council of Maharashtra & Goa</li>
              <li className="flex items-center justify-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-600" /> Extensive practice in Civil, Corporate, and Criminal Litigation</li>
              <li className="flex items-center justify-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-600" /> Specialized expertise in Medical Device Tech Transfer Contracts</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}