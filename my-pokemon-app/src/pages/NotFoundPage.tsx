// src/pages/NotFoundPage.tsx
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';

const NotFoundPage = () => {
  return (
    <main
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Header />
      <ThemeToggle />
      <div style={{ color: 'var(--card-text)', marginTop: '2rem' }}>
        <h2>Página no encontrada</h2>
      </div>
    </main>
  );
};

export default NotFoundPage;
