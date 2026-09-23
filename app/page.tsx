import Link from 'next/link';
import { Hero } from '@/components/theme/Hero';
import { SectionTitle } from '@/components/theme/SectionTitle';
import { ServiceCard } from '@/components/theme/ServiceCard';

export default function HomePage() {
  return (
    <>
      <Hero title="Vercel Preview Test" text="Northstar helps growing businesses turn scattered priorities into a clear, measurable plan of action." />
      <div className="proof-band"><div className="wrap">Assess → Strategize → Execute · A deliberate system for better decisions and better follow-through.</div></div>
      <section className="section"><div className="wrap">
        <SectionTitle eyebrow="What we do" title="One coordinated approach." text="Bring strategy, operations and execution into the same room instead of running disconnected programs." />
        <div className="grid-3">
          <ServiceCard title="Business assessment" text="Understand where the business is today, what is getting in the way, and which signals matter." />
          <ServiceCard title="Priority roadmap" text="Turn findings into a focused sequence of initiatives with owners, milestones and measures." />
          <ServiceCard title="Execution support" text="Move approved work forward with practical delivery support, review points and accountability." />
        </div>
      </div></section>
      <section className="section alt"><div className="wrap">
        <SectionTitle eyebrow="How it works" title="Simple enough to use. Rigorous enough to trust." />
        <div className="grid-3">
          {[['01','Assess','Get clear on the current state.'],['02','Strategize','Choose the few priorities that matter.'],['03','Execute','Deliver, measure and adjust.']].map(([n,t,d]) => <article className="card step" key={n}><div className="step-no">{n}</div><div><h3>{t}</h3><p>{d}</p></div></article>)}
        </div>
      </div></section>
      <section className="section"><div className="wrap card">
        <SectionTitle eyebrow="Ready when you are" title="Start with a business assessment." text="Tell us what you are trying to change. We will use the first conversation to define the right starting point." />
        <Link className="button primary" href="/contact">Request an assessment</Link>
      </div></section>
    </>
  );
}
