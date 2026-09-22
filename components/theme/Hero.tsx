import Link from 'next/link';

export function Hero({ title, text, eyebrow = 'Practical growth advisory' }: { title: string; text: string; eyebrow?: string }) {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede">{text}</p>
          <div className="actions">
            <Link className="button primary" href="/contact">Book an assessment</Link>
            <Link className="button secondary" href="/services">Explore services</Link>
          </div>
        </div>
        <div className="card">
          <strong>Built around one simple path.</strong>
          <p>Assess the business, choose the priorities, execute the work, then measure what changed.</p>
        </div>
      </div>
    </section>
  );
}
