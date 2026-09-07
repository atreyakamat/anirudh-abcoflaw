'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Scale, Shield, ArrowRight, FileText, Briefcase, Landmark, Globe, CheckCircle2, ShieldCheck, Lock, BookOpen } from 'lucide-react';
import type { BlogPost, PaginatedResult } from '@/types';
import { SITE_CONFIG } from '@/lib/config/site-config';

const achievements = [
  { text: 'LL.M., International Business Law', subtext: 'University of Aberdeen, UK (2009)' },
  { text: 'LL.B. (Honours)', subtext: 'Salgaonkar College of Law, Goa (2003)' },
  { text: 'Central Govt. Notary', subtext: 'Appointed Notary for Govt. of India' },
  { text: '20+ Years Bar Experience', subtext: 'Advocate – Panaji & Porvorim, Goa' },
];

const trustFramework = [
  { step: '01', title: 'Professional Visibility', desc: 'Verified professional identity, credentials, and practice information.' },
  { step: '02', title: 'Informational Standing', desc: 'Substantive legal notes and clear practice area guidance.' },
  { step: '03', title: 'Ethical Restraint', desc: 'Strict Rule 36 compliance without solicitation or promotional claims.' },
  { step: '04', title: 'Practice Clarity', desc: 'Specialized focus on core Goa legal fields.' },
  { step: '05', title: 'Administrative Ease', desc: 'Structured appointment requests, transparent fees, and client portal.' },
];

export default function HomePage() {
  const { data: blogs } = useQuery({
    queryKey: ['home-blogs'],
    queryFn: async () => { 
      try {
        const res = await api.blogs.published({ limit: 3 }); 
        return (res.data.data as PaginatedResult<BlogPost>).items; 
      } catch {
        return [];
      }
    },
  });

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      
      {/* BCI Compliance Disclaimer Header Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> {SITE_CONFIG.bciDisclaimer.headerBanner}</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-24 overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/heroimage.jpg" 
            alt="AB & Co. Legal Porvorim Office" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-[2px]" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10 grid md:grid-cols-12 gap-12 items-center text-white">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6 text-yellow-500 backdrop-blur-sm">
              <Scale className="w-4 h-4" />
              <span>Advocate Practice in Goa • Porvorim & Panaji</span>
            </div>

            {/* Mobile Lawyer Identity Badge (<768px) */}
            <div className="md:hidden flex items-center gap-3 p-3 mb-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/profilepic.jpg" alt="Advocate Anirudha Sinai Borkar" className="w-12 h-12 rounded-lg object-cover border border-yellow-500/50" />
              <div>
                <p className="font-serif font-bold text-sm text-white">Adv. Anirudha Sinai Borkar</p>
                <p className="text-[11px] text-yellow-400">LL.B. (Goa) • LL.M. (Aberdeen, UK) • 20+ Yrs</p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-4 tracking-tight">
              {SITE_CONFIG.firmName}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                {SITE_CONFIG.tagline}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl leading-relaxed font-light">
              Founded by Advocate Anirudha Sinai Borkar with over two decades of legal practice. Providing structured legal representation, property conveyancing, succession advisory, and business documentation across Goa.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-yellow-500 transition-all shadow-lg">
                Request an Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors backdrop-blur-sm">
                View Practice Areas
              </Link>
              <Link href="/portal" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors">
                <Lock className="w-3.5 h-3.5 text-yellow-500" />
                Client Portal
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-6">
              <span>Languages: <strong>English, Konkani, Hindi, Portuguese</strong></span>
              <span>•</span>
              <span>Location: <strong>Porvorim (near Panaji)</strong></span>
            </div>
          </div>
          
          <div className="md:col-span-5 hidden md:flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md p-6">
              <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 relative bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lawyer1.png" alt="Advocate Anirudha Sinai Borkar" className="w-full h-full object-cover" />
              </div>
              <p className="font-serif font-bold text-xl text-white text-center">{SITE_CONFIG.lawyerName}</p>
              <p className="text-xs text-yellow-500 text-center font-medium mt-1">LL.B. (Goa) • LL.M. (Aberdeen, UK)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold tracking-widest text-yellow-600 uppercase mb-2">Practice Areas</h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">Strategic Legal Focus</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              We concentrate on core legal fields relevant to individuals, families, and businesses in Goa. Descriptive guidance is provided to clarify the scope of legal work handled.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SITE_CONFIG.practiceAreas.map((area, idx) => (
              <div key={idx} className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-yellow-600/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-6">
                    {idx === 0 && <Landmark className="w-6 h-6" />}
                    {idx === 1 && <FileText className="w-6 h-6" />}
                    {idx === 2 && <Shield className="w-6 h-6" />}
                    {idx === 3 && <Briefcase className="w-6 h-6" />}
                    {idx === 4 && <Globe className="w-6 h-6" />}
                  </div>
                  <h4 className="font-serif font-bold text-xl text-slate-900 mb-2">{area.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">{area.shortDesc}</p>
                </div>
                <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-yellow-600 transition-colors pt-4 border-t border-slate-200">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advocate Biography Section */}
      <section id="profile" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="aspect-[4/3] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#0F172A] relative border border-slate-300 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/profilepic.jpg" 
                  alt="Advocate Anirudha Sinai Borkar" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent flex flex-col justify-end p-6 text-slate-300">
                  <p className="font-serif text-xl font-bold text-white">Adv. Anirudha S. Borkar</p>
                  <p className="text-xs text-yellow-400 mt-0.5">Founder, AB & Co. Legal • Advocate, Panaji & Porvorim</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-7">
              <h2 className="text-xs font-bold tracking-widest text-yellow-600 uppercase mb-2">Professional Credentials</h2>
              <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6">About Mr. Anirudha Sinai Borkar</h3>
              
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                <p>
                  Mr. Anirudha Sinai Borkar is a seasoned advocate with over two decades of active legal practice at the Goa Bar. He holds a Bachelor of Laws (LL.B., Salgaonkar College of Law, Goa, 2003) and a Master of Laws in International Business Law (LL.M., University of Aberdeen, UK, 2009).
                </p>
                <p>
                  After years of civil litigation practice, he founded AB & Co. Legal in Porvorim, North Goa. His practice covers litigation before the Bombay High Court (Panaji Bench), Goa District and Sessions Courts, and local administrative bodies.
                </p>
                <p>
                  Committed to ethical service, Mr. Borkar’s motto is <strong>“Legal Made Simple”</strong>—cutting through procedural complexity to provide clear, actionable guidance. His multilingual practice serves clients in English, Konkani, Hindi, and Portuguese.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achieve, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{achieve.text}</p>
                      <p className="text-[11px] text-slate-500">{achieve.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Framework Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold tracking-widest text-yellow-600 uppercase mb-2">Practice Standard</h2>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">The AB & Co. 5-Step Trust Framework</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We operate under a transparent 5-point operational framework focused on professional integrity and straightforward legal access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {trustFramework.map((tf, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-left flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-serif font-bold text-yellow-600 block mb-3">{tf.step}</span>
                  <h4 className="font-bold text-slate-900 text-base mb-2">{tf.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{tf.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Fee & Terms Section */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <BookOpen className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Consultation Process & Policy</h3>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed mb-6">
            All appointments require a standard consultation fee of <strong>₹2,500 for a 60-minute session</strong>, paid prior to confirmation. In accordance with BCI Rule 36, we do not offer free consultations or promotional discounts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> Administrative Booking</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> Secure Online Payment</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> In-Person & Video Options</span>
          </div>
        </div>
      </section>

      {/* Internal Firm Insights (Blogs) */}
      {blogs && blogs.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-xs font-bold tracking-widest text-yellow-600 uppercase mb-2">Educational Blog</h2>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Legal Insights & Articles</h3>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-yellow-600 transition-colors">
                Read All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <Link key={b.id} href={`/blog/${b.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col p-6 rounded-2xl border border-slate-200 hover:border-yellow-600/30 hover:shadow-lg transition-all duration-300 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">{new Date(b.createdAt).toLocaleDateString()}</p>
                    <h4 className="font-bold font-serif text-lg text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">{b.title}</h4>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">{b.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-yellow-600">
                      Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact & Footer CTA */}
      <section className="py-16 bg-yellow-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">AB & Co. Legal</h2>
          <p className="text-yellow-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Adv. Anirudha S. Borkar • Porvorim, North Goa (near Panaji)
          </p>
          <Link href="/book" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F172A] text-white rounded-lg font-bold hover:bg-slate-800 transition-all shadow-xl">
            Book Consultation (₹2,500)
          </Link>
          <p className="text-xs text-yellow-200 mt-6">
            Mon–Fri: 10:00–17:00 IST | Phone/Video consultations available by appointment
          </p>
        </div>
      </section>
      
    </div>
  );
}