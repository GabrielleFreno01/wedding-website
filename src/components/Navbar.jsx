import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/notre-histoire', label: 'Notre histoire' },
  { to: '/le-jour-j', label: 'Le jour J' },
  { to: '/voyage', label: 'Voyage' },
  { to: '/musique', label: 'Musique' },
  { to: '/faq', label: 'FAQ' },
  { to: '/rsvp', label: 'RSVP' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <NavLink to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          G&nbsp;&amp;&nbsp;H
        </NavLink>

        <button
          className="navbar-toggle"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${open ? 'navbar-links-open' : ''}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
