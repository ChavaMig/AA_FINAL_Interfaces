import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

//  Importaciones de api.ts y styles.ts
import {getPokemonById, type Pokemon, getTranslatedDescription} from '../utils/api';
import {TypeColors, TypeStyles} from '../utils/styles';

const PokemonDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 1. ESTADOS PRINCIPALES (Punto 4: Detalle y persistencia)
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. ESTADOS DE TRADUCCIÓN (Punto Extra 5: Servicio Externo)
    const [translation, setTranslation] = useState<{ original: string, translated: string } | null>(null);
    const [loadingTranslation, setLoadingTranslation] = useState(false);
    const [translationError, setTranslationError] = useState<string | null>(null);

    // 3. EFECTO PRINCIPAL DE CARGA
    useEffect(() => {
        if (id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
            setError(null);
            setTranslation(null);

            getPokemonById(id)
                .then((data) => {
                    setPokemon(data);

                    // LLAMADA AL SERVICIO DE TRADUCCIÓN SIMULADO (Punto Extra 5)
                    setLoadingTranslation(true);
                    setTranslationError(null);

                    getTranslatedDescription(data.name)
                        .then(setTranslation)
                        .catch(() => setTranslationError("Error al obtener la traducción del servicio externo."))
                        .finally(() => setLoadingTranslation(false));
                })
                .catch((e) => {
                    setError(e.message);
                    setLoadingTranslation(false);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    // Cálculo de estilos
    const primaryType = pokemon?.types[0] || 'normal';
    //  Usa TypeColors
    const color = TypeColors[primaryType as keyof typeof TypeColors] || '#f0f0f0';


    return (
        <main
            style={{
                width: '100vw',
                minHeight: '100vh',
                backgroundColor: 'var(--background)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem 1rem',
            }}
        >
            <Header/>
            <ThemeToggle/>

            {loading ? (
                <Loader/>
            ) : error ? (
                <ErrorMessage message={error}/>
            ) : pokemon ? (
                <div
                    style={{
                        maxWidth: '800px',
                        width: '100%',
                        backgroundColor: 'var(--card-background)',
                        borderRadius: '12px',
                        padding: '2rem',
                        marginTop: '2rem',
                        boxShadow: `0 8px 0 0 ${color}, 0 6px 16px rgba(0,0,0,0.3)`,
                        color: 'var(--text-main)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* Título e Imagen */}
                    <h1 style={{textTransform: 'capitalize', color: color, fontSize: '2.5rem', marginBottom: '0.5rem'}}>
                        #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
                    </h1>
                    <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                            margin: '1rem 0',
                        }}
                    />

                    {/* Tipos */}
                    <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
                        {pokemon.types.map((type) => (
                            <span
                                key={type}
                                style={TypeStyles(type)} // 🚨 Usamos TypeStyles
                            >
                                {type}
                            </span>
                        ))}
                    </div>

                    //detalles

                    <div style={{width: '100%', textAlign: 'center', marginBottom: '2rem'}}>
                        <h2 style={{
                            color: '#2a75bb',
                            borderBottom: '2px solid #2a75bb',
                            paddingBottom: '0.5rem'
                        }}>Características</h2>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            margin: '1rem 0',
                            fontWeight: 'bold'
                        }}>
                            <p>Altura: <span style={{color: '#2a75bb'}}>{pokemon.height / 10} m</span></p>
                            <p>Peso: <span style={{color: '#2a75bb'}}>{pokemon.weight / 10} kg</span></p>
                            <p>Ataque Base: <span
                                style={{color: '#2a75bb'}}>{pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 'N/A'}</span>
                            </p>
                        </div>
                    </div>



                    <h2 style={{
                        color: '#ffcb05',
                        borderBottom: '2px solid #ffcb05',
                        paddingBottom: '0.5rem',
                        marginTop: '1rem',
                        width: '100%'
                    }}>
                        Servicio Externo (Traducción de Descripción)
                    </h2>

                    {loadingTranslation ? (
                        <Loader/>
                    ) : translationError ? (
                        <p style={{color: '#e74c3c', fontWeight: 'bold'}}>{translationError}</p>
                    ) : (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: 'var(--background)',
                            borderRadius: '8px',
                            border: '2px solid #9b59b6',
                            textAlign: 'left',
                            width: '100%'
                        }}>
                            <p style={{margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--text-main)'}}>
                                Descripción Original (Inglés):
                            </p>
                            <blockquote style={{
                                margin: '0 0 1rem 0',
                                paddingLeft: '1rem',
                                borderLeft: '3px solid #9b59b6',
                                color: 'var(--text-secondary)',
                                fontStyle: 'italic'
                            }}>
                                {translation?.original}
                            </blockquote>

                            <p style={{margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--text-main)'}}>
                                Traducción (Español):
                            </p>
                            <p style={{margin: 0, color: '#2a75bb', fontWeight: 'bold'}}>
                                {translation?.translated}
                            </p>
                        </div>
                    )}




                    <button
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: '3rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#2a75bb',
                            color: '#ffcb05',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        ← Volver a la Pokédex
                    </button>
                </div>
            ) : null}
        </main>
    );
};

export default PokemonDetailPage;