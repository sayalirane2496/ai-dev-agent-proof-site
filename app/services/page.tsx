import { SectionTitle } from '@/components/theme/SectionTitle';
import { ServiceCard } from '@/components/theme/ServiceCard';

const services = [
  ['Growth strategy', 'Clarify the market opportunity, priorities and commercial path.'],
  ['Operating model', 'Improve how work, decisions and accountability move through the business.'],
  ['Customer experience', 'Find practical changes that remove friction and strengthen retention.'],
  ['Digital delivery', 'Translate approved priorities into well-scoped digital work and releases.'],
  ['Performance reviews', 'Create a regular cadence for reviewing outcomes, risks and next actions.'],
  ['Leadership support', 'Give decision-makers a structured outside perspective when it matters.'],
];

export default function ServicesPage() {
  return <>
    <section className="page-hero"><div className="wrap"><p className="eyebrow">Services</p><h1>Focused support for consequential work.</h1><p className="lede">Choose the capability you need, or use the assessment to define the right combination.</p></div></section>
    <section className="section"><div className="wrap"><SectionTitle eyebrow="Capabilities" title="Built to work together." /><div className="grid-3">{services.map(([title,text]) => <ServiceCard key={title} title={title} text={text} />)}</div></div></section>
  </>;
}
