import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <section className="relative py-24 md:py-32 text-center text-white overflow-hidden">
      {/* Global Background Image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/heroimage.jpg" 
          alt="AB & Co. Legal Office" 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Dark semi-transparent overlay for text readability (matches Hero styling) */}
      <div className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-[2px] z-0" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-transparent to-transparent pointer-events-none z-0" />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {badge && (
          <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-3">
            {badge}
          </h2>
        )}
        <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-slate-300 font-light">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
