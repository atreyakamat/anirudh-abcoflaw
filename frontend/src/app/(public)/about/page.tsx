import { Scale, Shield, Users, Award } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function AboutPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      <PageHeader 
        badge="Our Legacy" 
        title="About AB & Co. Legal" 
        subtitle="Dedicated to providing exceptional legal services with integrity, precision, and professionalism in Goa and beyond." 
      />

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          
          {/* Main Bio Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Column */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-600/10 rounded-3xl transform translate-x-4 translate-y-4" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/profilepic.jpg" 
                  alt="Anirudha Sinai Borkar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text Column */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold font-serif text-slate-900 leading-tight">
                A Career Defined by Expertise and Empathy
              </h2>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>
                  Anirudha Sinai Borkar graduated with an LLB (Honours) from VM Salgaocar College of Law and pursued his LLM in International Business Law from the University of Aberdeen, UK, specializing in Corporate Governance and Property Development.
                </p>
                <p>
                  Starting his career in the esteemed chambers of Sr. Adv. Sudin Usgaonkar, Borkar honed his legal acumen and strong work ethic. He has collaborated with distinguished senior advocates, contributing immensely to the emerging IT and industrial landscape in Goa—including trailblazing clinical trial agreements for surgical robots and medical devices.
                </p>
                <p>
                  Beyond the courtroom, he strongly believes in a healthy work-life balance and continuously mentors young lawyers, encouraging them to take ownership and lead with pride.
                </p>
              </div>
            </div>
          </div>

          {/* Highlights / Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-y border-slate-100">
            {[
              { title: 'LLM, International Business Law', desc: 'University of Aberdeen, UK' },
              { title: 'Founder, Legal Made Simple', desc: "Goa's first online legal services portal" },
              { title: 'Central Government Notary', desc: 'Appointed Notary for the Govt. of India' },
              { title: '20+ Years Experience', desc: 'Est. AB & Co. Legal' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center group hover:border-yellow-600/30 transition-colors">
                <h3 className="font-bold font-serif text-xl text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors">
                  {stat.title}
                </h3>
                <p className="text-slate-600 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Core Values Section */}
          <div className="text-center max-w-3xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold font-serif text-slate-900">Our Core Principles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { i: Shield, t: 'Integrity', d: 'Ethical practice above all' }, 
                { i: Users, t: 'Client Focus', d: 'Your interests come first' }, 
                { i: Award, t: 'Excellence', d: 'Delivering the best outcomes' }, 
                { i: Scale, t: 'Fairness', d: 'Justice and equal treatment' }
              ].map((v) => (
                <div key={v.t} className="text-center group">
                  <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-yellow-600/10 border border-slate-100 transition-all">
                    <v.i className="w-8 h-8 text-slate-900 group-hover:text-yellow-600 transition-colors" />
                  </div>
                  <h3 className="font-bold font-serif text-lg text-slate-900 mb-1">{v.t}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{v.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Team Section */}
          <div className="pt-16 border-t border-slate-100">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Our Legal Team</h2>
              <p className="text-slate-600 text-lg">Backed by a team of dedicated legal professionals, we ensure that every case is handled with precision and care.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {[
                { img: '/lawyer2.png', name: 'Associate Advocate', role: 'Civil & Corporate Litigation' },
                { img: '/lawyer3.png', name: 'Associate Advocate', role: 'Family Law & Contracts' }
              ].map((member, i) => (
                <div key={i} className="group">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-6">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">{member.name}</h3>
                  <p className="text-yellow-600 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}