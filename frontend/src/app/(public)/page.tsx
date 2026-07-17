'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Shield, Users, ArrowRight, Star, FileText, Briefcase, Landmark, BookOpen, Globe, Activity } from 'lucide-react';
import type { BlogPost, PaginatedResult } from '@/types';

const achievements = [
  { text: 'LLM, International Business Law', subtext: 'University of Aberdeen, UK' },
  { text: 'Founder, Legal Made Simple', subtext: 'Goa\'s first online legal services portal' },
  { text: 'Central Government Notary', subtext: 'Appointed Notary for the Govt. of India' },
  { text: '20+ Years Experience', subtext: 'Est. AB & Co. Legal in 2013' },
];

export default function HomePage() {
  const { data: blogs } = useQuery({
    queryKey: ['home-blogs'],
    queryFn: async () => { 
      const res = await api.blogs.published({ limit: 3 }); 
      return (res.data.data as PaginatedResult<BlogPost>).items; 
    },
  });

  const { data: rssNews } = useQuery({
    queryKey: ['rss-news'],
    queryFn: async () => {
      // Fetching from our internal next.js API route that parses multiple English legal RSS feeds
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.items as any[];
    },
  });

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* Full-width Hero Background Image */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/heroimage.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover" 
          />
        </div>
        {/* Semi-transparent blue overlay */}
        <div className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-[2px]" />
        
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center text-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 text-yellow-500 backdrop-blur-sm">
              <Scale className="w-4 h-4" />
              <span>AB & Co. Legal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight mb-6 tracking-tight">
              Defending Rights.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Securing Futures.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed font-light">
              Led by Advocate Anirudha Sinai Borkar, we provide unwavering legal counsel in Goa, rooted in 20 years of integrity, expertise, and a commitment to justice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-600/20">
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#profile" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-colors backdrop-blur-sm">
                Meet the Advocate
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/20 to-transparent rounded-full blur-3xl" />
            <div className="relative bg-white/10 border border-white/20 p-12 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-500">
              {/* 3D-like glassmorphic Weighing Scale Component */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 border border-yellow-500/30 flex items-center justify-center mb-8 shadow-inner">
                <Scale className="w-16 h-16 text-yellow-500 drop-shadow-lg" />
              </div>
              <div className="space-y-4 text-center">
                <p className="text-2xl font-serif text-white font-bold tracking-wide">Central Government Notary</p>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto" />
                <p className="text-slate-300 font-medium">Appointed by the Government of India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Firm's Legacy (Business Section) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-3">Our Legacy & Values</h2>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-6">A Practice Built on Morality and Access to Justice</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Established in 2013, AB & Co. Legal expands across Goa with a dedicated team. Our firm's philosophy centers around a simple but powerful principle: taking up cases that are not only legally sound but morally right.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-xl text-slate-900 mb-3">Integrity Above All</h4>
              <p className="text-slate-600">We firmly believe that proper legal representation combats fraudulent practices. We stand with clients from India and abroad to protect their assets and rights against unscrupulous actors.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-xl text-slate-900 mb-3">Bridging the Gap</h4>
              <p className="text-slate-600">Inspired by a family legacy of community service, we launched <strong>Legal Made Simple</strong>—Goa's first online portal aimed at bridging the Access to Justice gap through technology and AI.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-xl text-slate-900 mb-3">Amicable Resolutions</h4>
              <p className="text-slate-600">Particularly in family and matrimonial matters, our central approach is continued dialogue to resolve issues amicably rather than through prolonged courtroom acrimony.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advocate Profile Section */}
      <section id="profile" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            
            <div className="md:col-span-5">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#0F172A] relative border border-slate-200 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/lawyer1.png" 
                  alt="Adv. Anirudha A. Sinai Borkar" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent flex flex-col justify-end p-8 text-center text-slate-300">
                  <p className="font-serif text-2xl text-white">Adv. Anirudha A. Sinai Borkar</p>
                  <p className="text-sm mt-1 text-slate-300">Founder, AB & Co. Legal</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-7">
              <h2 className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-3">The Principal Advocate</h2>
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-6">A Career Defined by Expertise and Empathy</h3>
              
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed mb-8">
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
              
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achieve, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="mt-1 p-2 bg-slate-50 rounded-lg border border-slate-100 text-yellow-600">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{achieve.text}</p>
                      <p className="text-sm text-slate-500">{achieve.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curated Legal Advice / Services */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-3">Comprehensive Legal Solutions</h2>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-6">Curated Advice by Expert Lawyers</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              The law is vast, and every case is unique. Rather than limiting our practice to predefined rigid categories, AB & Co. Legal provides holistic, adaptive, and highly curated legal strategies. From high-stakes commercial tech negotiations to sensitive personal family matters, our decades of litigation and consultancy experience ensure you are protected across all sectors of the law.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-slate-700">
              <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-yellow-600" /> Strategic Litigation</span>
              <span className="flex items-center gap-2"><Landmark className="w-5 h-5 text-yellow-600" /> Dispute Resolution</span>
              <span className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-yellow-600" /> Advisory & Consultancy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Legal News (RSS Feed Marquee) */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Live Updates
              </h2>
              <h3 className="text-3xl font-serif font-bold text-slate-900">Catch Up With The Latest Legal News</h3>
            </div>
          </div>
        </div>
        
        {!rssNews ? (
          <div className="text-center text-slate-500 py-12">Loading latest news...</div>
        ) : (
          <div className="relative w-full flex overflow-hidden group">
            {/* Fade effect edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-marquee min-w-max gap-6 px-3">
              {[...rssNews, ...rssNews].map((news: any, idx: number) => (
                <a key={idx} href={news.link} target="_blank" rel="noopener noreferrer" className="block w-80 md:w-96 flex-shrink-0">
                  <div className="h-full flex flex-col rounded-2xl border border-slate-200 hover:border-yellow-600/50 hover:shadow-xl transition-all duration-300 bg-white shadow-sm overflow-hidden">
                    {news.imageUrl && (
                      <div className="w-full h-48 bg-slate-100 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">{new Date(news.pubDate).toLocaleDateString()}</p>
                      <h4 className="font-bold font-serif text-lg text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-3" dangerouslySetInnerHTML={{__html: news.title}}></h4>
                      <div className="mt-auto flex items-center justify-between gap-2 text-sm font-bold text-yellow-600 pt-4 border-t border-slate-100">
                        <span>Read Full Story</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Philosophy / Values Quote */}
      <section className="py-24 bg-[#0F172A] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <BookOpen className="w-12 h-12 text-yellow-600 mx-auto mb-8 opacity-80" />
          <blockquote className="text-3xl md:text-4xl font-serif text-white leading-tight mb-8">
            "The justice system can be improved not by putting more pressure on the judiciary, but by reducing their workload through amicable resolutions and efficient practice."
          </blockquote>
          <p className="text-yellow-500 font-medium tracking-wide uppercase text-sm">
            — Advocate Anirudha Sinai Borkar
          </p>
        </div>
      </section>

      {/* Internal Firm Insights (Blogs) */}
      {blogs && blogs.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-3">Firm Insights</h2>
                <h3 className="text-3xl font-serif font-bold text-slate-900">Articles from AB & Co. Legal</h3>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-yellow-600 transition-colors">
                Read All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <Link key={b.id} href={`/blog/${b.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col p-6 rounded-2xl border border-slate-200 hover:border-yellow-600/30 hover:shadow-lg transition-all duration-300 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">{new Date(b.createdAt).toLocaleDateString()}</p>
                    <h4 className="font-bold font-serif text-xl text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">{b.title}</h4>
                    <p className="text-slate-600 line-clamp-3 mb-6 flex-grow">{b.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-yellow-600">
                      Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="py-24 bg-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 to-yellow-500" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Need Expert Legal Counsel?</h2>
          <p className="text-yellow-50 text-xl mb-10 max-w-2xl mx-auto font-light">
            Whether you are navigating a complex property transaction, structuring a tech contract, or seeking an amicable family resolution, AB & Co. Legal is here to protect your interests.
          </p>
          <Link href="/book" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F172A] text-white rounded-lg font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            Schedule a Consultation Now
          </Link>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-medium text-yellow-100">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              Porvorim, Goa
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              hello@abcoflaw.in
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}