export function ServiceCard({ title, text }: { title: string; text: string }) {
  return <article className="card"><h3>{title}</h3><p>{text}</p></article>;
}
