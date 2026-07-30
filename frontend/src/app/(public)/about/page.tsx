import { ShieldCheck, MapPin, Globe } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function AboutPage() {
  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      
      {/* BCI Compliance Disclaimer Header Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> Factual professional profile per Rule 36 of Bar Council of India Rules (1975). No promotional claims or solicitation.</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="pt-10">
        <PageHeader 
          badge="Professional Background" 
          title="About Advocate Anirudha Sinai Borkar" 
          subtitle="Advocate practicing before Goa District & Sessions Courts and the Bombay High Court (Panaji Bench)." 
        />
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-[4/5] bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/profilepic.jpg" 
                  alt="Advocate Anirudha Sinai Borkar" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <p className="font-serif font-bold text-xl">Adv. Anirudha S. Borkar</p>
                  <p className="text-xs text-yellow-400">Founder, AB & Co. Legal • Porvorim, Goa</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-serif text-slate-900 leading-tight">
                20+ Years at the Goa Bar
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Mr. Anirudha Sinai Borkar is a seasoned advocate with over two decades of active litigation and advisory experience in Goa. He holds a Bachelor of Laws (LL.B., Salgaonkar College of Law, Goa, 2003) and a Master of Laws in International Business Law (LL.M., University of Aberdeen, UK, 2009).
                </p>
                <p>
                  After years of civil litigation practice, he established AB & Co. Legal in Porvorim, North Goa. His office’s strategic location puts the practice at the heart of Goa’s legal district, with ready access to the Bombay High Court (Panaji Bench), Goa District and Sessions Courts, and local revenue and administrative tribunals.
                </p>
                <p>
                  Mr. Borkar combines international academic training with deep local expertise in Goa’s legal environment. His motto, <strong>“Legal Made Simple”</strong>, reflects his commitment to providing straightforward, objective guidance without unnecessary complexity.
                </p>
              </div>
            </div>
          </div>

          {/* Key Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12 border-y border-slate-200">
            {[
              { title: 'LL.M., International Business Law', desc: 'University of Aberdeen, UK (2009)' },
              { title: 'LL.B. (Honours)', desc: 'Salgaonkar College of Law, Goa (2003)' },
              { title: 'Central Government Notary', desc: 'Appointed Notary for Govt. of India' },
              { title: '20+ Years Experience', desc: 'Advocate – Panaji & Porvorim, Goa' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                <h3 className="font-bold font-serif text-base text-slate-900 mb-2">
                  {stat.title}
                </h3>
                <p className="text-slate-500 text-xs">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Multilingual & Location Access */}
          <div className="grid md:grid-cols-2 gap-8 bg-slate-900 text-white p-10 rounded-3xl">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-yellow-500" />
                <h3 className="font-serif font-bold text-xl">Multilingual Representation</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Consultations and court representation can be conducted in <strong>English, Konkani, Hindi, and Portuguese</strong>, serving Goa’s diverse domestic and international clients.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-yellow-500" />
                <h3 className="font-serif font-bold text-xl">Porvorim Office Location</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Located on Chogm Road, Porvorim (near Panaji), easily accessible from Mapusa, Margao, and across North & South Goa. Video/phone consultations are available by prior appointment.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}