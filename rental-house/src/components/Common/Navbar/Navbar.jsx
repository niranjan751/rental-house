import { useState, useEffect } from 'react';
import './Navbar.css';
import Login from '../../../login/Login';

const NAV_LINKS = [
  { label: 'Rent', href: '#search' },
  { label: 'List your place', href: '#list' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Cities', href: '#cities' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          <a href="/" className="navbar__brand" aria-label="RentalHub home">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L2 11H5V23H21V11H24L13 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M10 23V15H16V23" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
            <span>Rental<em>Hub</em></span>
          </a>

          <nav className="navbar__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </nav>

          <div className="navbar__actions">
            <button className="navbar__login" onClick={() => setShowLogin(true)}>Log in</button>
            <a href="#list" className="btn btn-primary">List a property</a>
          </div>

          <button
            className="navbar__burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>

        {open && (
          <div className="navbar__mobile">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <button
              className="navbar__login"
              onClick={() => { setOpen(false); setShowLogin(true); }}
            >
              Log in
            </button>
            <a href="#list" className="btn btn-primary" onClick={() => setOpen(false)}>List a property</a>
          </div>
        )}
      </header>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
}
