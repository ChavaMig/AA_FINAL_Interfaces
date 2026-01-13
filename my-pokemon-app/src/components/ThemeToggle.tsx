// src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div style={{ position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 20 }}>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid var(--card-text)',
          backgroundColor: 'var(--panel-bg)',
          color: 'var(--card-text)',
          cursor: 'pointer',
        }}
      >
        {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      </button>
    </div>
  );
};

export default ThemeToggle;
