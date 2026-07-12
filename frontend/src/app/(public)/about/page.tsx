import { Scale, Shield, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="animate-in">
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About Our Practice</h1>
          <p className="text-lg text-muted-foreground">Dedicated to providing exceptional legal services with integrity and professionalism.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">Founded with a mission to make quality legal representation accessible, our practice has grown from a solo endeavor to a trusted name in the legal community. With over 15 years of experience, we have successfully handled hundreds of cases across multiple practice areas.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">We believe everyone deserves competent legal counsel. Our approach combines deep legal expertise with genuine care for our clients&apos; wellbeing, ensuring each case receives the attention and strategy it deserves.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            {[{ i: Shield, t: 'Integrity', d: 'Ethical practice' }, { i: Users, t: 'Client Focus', d: 'Your interests first' }, { i: Award, t: 'Excellence', d: 'Best outcomes' }, { i: Scale, t: 'Fairness', d: 'Equal treatment' }].map((v) => (<div key={v.t} className="text-center"><v.i className="w-10 h-10 mx-auto text-primary mb-2" /><h3 className="font-medium">{v.t}</h3><p className="text-sm text-muted-foreground">{v.d}</p></div>))}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Qualifications</h2>
            <ul className="space-y-2 text-muted-foreground"><li>LL.B. from National Law School of India University</li><li>Admitted to the Bar Council of Maharashtra & Goa</li><li>Certified Mediator, Indian Institute of Arbitration & Mediation</li><li>Member, Bar Association of India</li></ul>
          </div>
        </div>
      </section>
    </div>
  );
}