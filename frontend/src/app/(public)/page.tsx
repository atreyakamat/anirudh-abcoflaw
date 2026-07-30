'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Scale, Shield, ArrowRight, Star, FileText, Briefcase, Landmark, BookOpen, Globe, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { BlogPost, PaginatedResult } from '@/types';

const achievements = [
  { text: 'LL.M., International Business Law', subtext: 'University of Aberdeen, UK (2009)' },
  { text: 'LL.B. (Honours)', subtext: 'Salgaonkar College of Law, Goa (2003)' },
  { text: 'Central Government Notary', subtext: 'Appointed Notary for Govt. of India' },
  { text: '20+ Years Bar Experience', subtext: 'Advocate – Panaji & Porvorim, Goa' },
];

const practiceAreas = [
  {
    icon: Landmark,
    title: 'Civil & Criminal Litigation',
    subtitle: 'Goa Courts & High Court',
    desc: 'Representing clients in civil disputes (property, contracts, succession) and criminal matters. Practicing before the Bombay High Court (Panaji Bench), Goa District and Sessions Courts, and local tribunals.',
  },
  {
    icon: FileText,
    title: 'Property & Conveyancing',
    subtitle: 'Real Estate & Title Advisory',
    desc: 'Comprehensive real estate guidance: drafting & negotiating sale/lease agreements, development projects, RERA compliance, title/transfer disputes, stamp duty verifications, and property registrations.',
  },
  {
    icon: Shield,
    title: 'Family Law & Succession',
    subtitle: "Goa's Unique Civil Code",
    desc: 'Specialized assistance under Portuguese Civil Law / Goa Civil Code for matrimonial matters (divorce, custody, maintenance), succession, estate settlements, preparing wills, and probate (inventory) proceedings.',
  },
  {
    icon: Briefcase,
    title: 'Business & Commercial Advisory',
    subtitle: 'Contracts & Corporate Compliance',
    desc: 'Guiding entrepreneurs and Goa-based companies on commercial agreements, shareholder & partnership contracts, company formation, regulatory compliance, and resolving contractual disputes.',
  },
  {
    icon: Globe,
    title: 'Other Legal Services',
    subtitle: 'Notary & Specialized Advisory',
    desc: 'Central Government Notary services for official document attestation, alongside preliminary Intellectual Property guidance (collaborating with specialist Goa IP experts as needed).',
  },
];

const trustFramework = [
  {
    step: '01',
    title: 'Professional Visibility',
    desc: 'Accurate, transparent credentials and contact details ensuring clients seeking a Goa advocate find verified professional records.',
  },
  {
    step: '02',
    title: 'Instant Credibility',
    desc: 'Over two decades at the Goa Bar, international LL.M. qualifications, and clear professional standing.',
  },
  {
    step: '03',
    title: 'Ethical Safety',
    desc: 'Strict adherence to Bar Council of India Rule 36 — purely informational, objective, and non-promotional content.',
  },
  {
    step: '04',
    title: 'Strategic Focus',
    desc: 'Specialized concentration on core Goa legal domains rather than generalized, superficial legal listings.',
  },
  {
    step: '05',
    title: 'Zero-Effort Engagement',
    desc: 'Structured administrative booking, transparent consultation fee schedule, and prompt, professional service.',
  },
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
            <span><strong>Bar Council Compliance Notice:</strong> This website is for informational & educational purposes only per Rule 36 of the Bar Council of India Rules (1975). No solicitation or legal advertisement.</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[#0F172A]">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6 text-yellow-500 backdrop-blur-sm">
              <Scale className="w-4 h-4" />
              <span>Advocate – Panaji & Porvorim, Goa</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6 tracking-tight">
              AB & Co. Legal<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Legal Made Simple
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed font-light">
              Led by Advocate Anirudha Sinai Borkar with 20+ years of legal experience, providing clear, practical guidance across Goa’s courts, tribunals, and regulatory bodies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-600/20">
                Schedule Consultation (₹2,500) <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#profile" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-colors backdrop-blur-sm">
                Advocate Profile
              </Link>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400 border-t border-slate-800 pt-6">
              <span>Languages: <strong>English, Konkani, Hindi, Portuguese</strong></span>
              <span>•</span>
              <span>Office: <strong>Porvorim (near Panaji)</strong></span>
            </div>
          </div>
          
          <div className="md:col-span-5 hidden md:flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md p-6">
              <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lawyer1.png" alt="Advocate Anirudha Sinai Borkar" className="w-full h-full object-cover" />
              </div>
              <p className="font-serif font-bold text-xl text-white text-center">Adv. Anirudha S. Borkar</p>
              <p className="text-xs text-yellow-500 text-center font-medium mt-1">LL.B. (Goa) • LL.M. (Aberdeen, UK)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold tracking-widest text-yellow-600 uppercase mb-2">Strategic Focus</h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">Core Legal Practice Areas</h3>
            <p className="text-slate-600 leading-relaxed">
              We concentrate on specialized core areas relevant to individuals and businesses in Goa. Each field is handled with focus, integrity, and depth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceAreas.map((area, idx) => (
              <div key={idx} className="p-8 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-yellow-600/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-6">
                    <area.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-slate-900 mb-1">{area.title}</h4>
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-4">{area.subtitle}</p>
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

      {/* Advocate Profile Section */}
      <section id="profile" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#0F172A] relative border border-slate-300 shadow-xl">
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
                    <div className="mt-0.5 p-1.5 bg-yellow-50 rounded-lg text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{achieve.text}</p>
                      <p className="text-xs text-slate-500">{achieve.subtext}</p>
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

          <div className="grid md:grid-cols-5 gap-6">
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