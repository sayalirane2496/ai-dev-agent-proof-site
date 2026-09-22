import Link from 'next/link';

const links = [
  ['About', '/about'],
  ['Services', '/services'],
  ['How it works', '/how-it-works'],
  ['Contact', '/contact'],
] as const;

export function Header() {
  return (
    <header className="wrap nav">
      <Link href="/" className="brand" aria-label="Northstar Advisory home">Northstar Advisory</Link>
      <nav className="nav-links" aria-label="Primary navigation">
        {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
    </header>
  );
}
