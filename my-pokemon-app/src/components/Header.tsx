// src/components/Header.tsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header
      style={{
        width: '100%',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--panel-bg)',
        color: 'var(--card-text)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--card-text)' }}>
        <h2 style={{ margin: 0 }}>Pokedex Mch</h2>
      </Link>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/home" style={{ textDecoration: 'none', color: 'var(--card-text)' }}>
          Pokedex
        </Link>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--card-text)' }}>
          Welcome
        </Link>
      </nav>
    </header>
  );
};

export default Header;
