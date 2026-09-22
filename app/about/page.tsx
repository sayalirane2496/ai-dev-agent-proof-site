import { SectionTitle } from '@/components/theme/SectionTitle';

export default function AboutPage() {
  return <>
    <section className="page-hero"><div className="wrap"><p className="eyebrow">About Northstar</p><h1>Clarity before complexity.</h1><p className="lede">We believe good advisory work should make decisions easier, not add another layer of process.</p></div></section>
    <section className="section"><div className="wrap">
      <SectionTitle eyebrow="Our point of view" title="Practical, coordinated and measurable." />
      <div className="grid-3">
        <article className="card"><h3>Practical</h3><p>Recommendations are designed for the actual people, constraints and resources in the business.</p></article>
        <article className="card"><h3>Coordinated</h3><p>Strategy and execution stay connected so priorities do not disappear after the presentation.</p></article>
        <article className="card"><h3>Measurable</h3><p>Every major initiative has a clear definition of progress and a review point.</p></article>
      </div>
    </div></section>
  </>;
}
