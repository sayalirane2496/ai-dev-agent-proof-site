import { SectionTitle } from '@/components/theme/SectionTitle';

const steps = [
  ['01','Assess','We start with the outcome you want and the evidence that explains the current state.'],
  ['02','Strategize','We agree the priorities, sequence and success measures before execution begins.'],
  ['03','Execute','We support the approved work with clear ownership, review points and visible progress.'],
  ['04','Measure','We review results, learn what changed and decide what should happen next.'],
];

export default function HowItWorksPage() {
  return <>
    <section className="page-hero"><div className="wrap"><p className="eyebrow">How it works</p><h1>One path from intent to action.</h1><p className="lede">Every engagement follows the same discipline while the work itself stays tailored to the business.</p></div></section>
    <section className="section"><div className="wrap"><SectionTitle title="Four deliberate steps." /> <div style={{display:'grid', gap:16}}>{steps.map(([n,t,d]) => <article className="card step" key={n}><div className="step-no">{n}</div><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></div></section>
  </>;
}
