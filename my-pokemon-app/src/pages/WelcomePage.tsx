// src/pages/WelcomePage.tsx
import {Link} from 'react-router-dom';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';

const WelcomePage = () => {
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
            <Header/>
            <ThemeToggle/>

            {/* Hero Section */}
            <section
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #2a75bb, #1f2530)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
            >
                <h1
                    style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        color: '#ffcb05',
                    }}
                >
                    PokeApi Mch
                </h1>
                <p
                    style={{
                        fontSize: '1.3rem',
                        maxWidth: '700px',
                        margin: '0 auto',
                        color: '#ffffff',
                    }}
                >
                    Explora el mundo Pokémon con esta aplicación interactiva.
                    Busca tus favoritos, filtra por tipo y descubre sus detalles.
                </p>
            </section>

            {/* Features Section */}
            <section
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    marginTop: '3rem',
                    width: '100%',
                    maxWidth: '1100px',
                }}
            >
                <div
                    style={{
                        flex: '1 1 300px',
                        backgroundColor: '#1f2530',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                        textAlign: 'center',
                        border: '2px solid #2a75bb',
                    }}
                >
                    <h3 style={{color: '#ffcb05'}}>Buscar por nombre</h3>
                    <p style={{color: '#ffffff'}}>
                        Encuentra Pokémon por nombre y accede rápidamente a sus detalles.
                    </p>
                </div>

                <div
                    style={{
                        flex: '1 1 300px',
                        backgroundColor: '#1f2530',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                        textAlign: 'center',
                        border: '2px solid #2a75bb',
                    }}
                >
                    <h3 style={{color: '#ffcb05'}}>Filtrar por tipo</h3>
                    <p style={{color: '#ffffff'}}>
                        Selecciona por tipo elemental y explora categorías específicas.
                    </p>
                </div>

                <div
                    style={{
                        flex: '1 1 300px',
                        backgroundColor: '#1f2530',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                        textAlign: 'center',
                        border: '2px solid #2a75bb',
                    }}
                >
                    <h3 style={{color: '#ffcb05'}}>Detalle</h3>
                    <p style={{color: '#ffffff'}}>
                        Consulta información completa de cada Pokémon con imágenes y tipos.
                    </p>
                </div>
            </section>

            {/* a la pokedex */}
            <section style={{marginTop: '4rem', textAlign: 'center'}}>
                <Link
                    to="/home"
                    style={{
                        display: 'inline-block',
                        padding: '1rem 2.5rem',
                        borderRadius: '12px',
                        backgroundColor: '#2a75bb',
                        color: '#ffcb05',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    Entrar a la Pokédex 🐦‍🔥
                </Link>
            </section>
        </main>
    );
};

export default WelcomePage;
