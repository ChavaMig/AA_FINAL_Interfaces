import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getPokemons, getTypes, type Pokemon } from '../utils/api';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import SortButtons from '../components/SortButtons';
import TypeFilter from '../components/TypeFilter';

// Tipado de la carga útil de favoritos guardada en localStorage
interface FavoritesPayload {
    name: string; // Nombre del equipo
    pokemons: string[]; // Array de nombres de Pokémon favoritos
    date: string;
}

const HomePage = () => {
    const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [errorList, setErrorList] = useState<string | null>(null);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [errorTypes, setErrorTypes] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const limit = 24;

    // ESTADOS DE FAVORITOS
    const [favoritePokemonNames, setFavoritePokemonNames] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [teamName, setTeamName] = useState<string | null>(null);
    
    const navigate = useNavigate(); 


    // Fetching de datos
    useEffect(() => {
        getPokemons(150)
            .then(setAllPokemons)
            .catch((e) => setErrorList(e.message))
            .finally(() => setLoadingList(false));
    }, []);

    useEffect(() => {
        getTypes()
            .then(setTypes)
            .catch((e) => setErrorTypes(e.message))
            .finally(() => setLoadingTypes(false));
    }, []);

    // --- 2. Carga de favoritos de localStorage
    useEffect(() => {
        try {
            const favoritesData = localStorage.getItem('my-favorites');
            if (favoritesData) {
                const parsed: FavoritesPayload = JSON.parse(favoritesData);
                
                // OBTENER Y GUARDAR EL NOMBRE DEL EQUIPO
                setTeamName(parsed.name); 

                // Convertimos a minúsculas para coincidir con la lista de pokémon
                setFavoritePokemonNames(parsed.pokemons.map(name => name.toLowerCase())); 
            } else {
                setTeamName(null);
            }
        } catch (e) {
            console.error("Error al cargar favoritos de localStorage", e);
            setFavoritePokemonNames([]);
            setTeamName(null);
        }
    }, []);


    // --- 3. Lógica de Filtrado y Ordenación
    const filtered = useMemo(() => {
        let list = allPokemons;
        
        // FILTRO DE FAVORITOS
        if (showFavoritesOnly && favoritePokemonNames.length > 0) {
            list = list.filter((p) => favoritePokemonNames.includes(p.name.toLowerCase()));
        }

        if (search.trim()) {
            list = list.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (type) {
            list = list.filter((p) => p.types.includes(type));
        }
        
        list = [...list].sort((a, b) => {
            const an = a.name.toLowerCase();
            const bn = b.name.toLowerCase();
            return order === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an);
        });
        
        return list;
    }, [allPokemons, search, type, order, showFavoritesOnly, favoritePokemonNames]);
    
    // UX FIX: Resetea la página a 1 cuando cambian los filtros
    useEffect(() => {
        setPage(1);
    }, [search, type, order, showFavoritesOnly]);

    //  Lógica de Paginación
    const start = (page - 1) * limit;
    const end = start + limit;
    const currentPagePokemons = filtered.slice(start, end);
    const totalPages = Math.ceil(filtered.length / limit);

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

            {/* BOTÓN DE NAVEGACIÓN A FAVORITOS */}
            <button
                onClick={() => navigate('/create')} 
                style={{
                    marginTop: '1.5rem',
                    marginBottom: '1rem', 
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#ffcb05', 
                    color: '#2a75bb', 
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    transition: 'background-color 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                }}
            >
                <span role="img" aria-label="star">⭐</span> Seleccionar Pokémon Favoritos
            </button>
            
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
                    Pokédex
                </h1>
                <p
                    style={{
                        fontSize: '1.3rem',
                        maxWidth: '700px',
                        margin: '0 auto',
                        color: '#ffffff',
                    }}
                >
                    Busca, filtra y ordena Pokémon con la misma estética que la página de bienvenida.
                </p>
            </section>

            {/* Panel de controles */}
            <section
                style={{
                    width: '100%',
                    maxWidth: '1100px',
                    backgroundColor: '#1f2530',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginTop: '3rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1rem',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                    border: '2px solid #2a75bb',
                }}
            >
                {/* BOTÓN DE TOGGLE DE FAVORITOS */}
                {favoritePokemonNames.length > 0 && (
                    <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: showFavoritesOnly ? '#ffcb05' : '#4a5568', 
                            color: showFavoritesOnly ? '#2a75bb' : '#ffffff',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            border: `2px solid ${showFavoritesOnly ? '#2a75bb' : '#ffcb05'}`,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        {showFavoritesOnly ? ' Mostrar Todos' : `⭐ Mostrar Favoritos`}
                    </button>
                )}
                <SearchBar value={search} onChange={setSearch} />
                <SortButtons order={order} onChange={setOrder} />
                {loadingTypes ? (
                    <Loader />
                ) : errorTypes ? (
                    <ErrorMessage message={errorTypes} />
                ) : (
                    <TypeFilter
                        value={type}
                        onChange={setType}
                        options={types}
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#2a75bb',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            border: '2px solid #ffcb05',
                        }}
                    />
                )}
            </section>

            {/* SECCIÓN DE RETROALIMENTACIÓN DE RESULTADOS (Contador de Pokémon) */}
             <section 
                //aria-live="polite"
                style={{ 
                    width: '100%', 
                    maxWidth: '1100px', 
                    margin: '1rem auto 1rem auto',
                    paddingLeft: '2rem',
                    color: 'var(--text-main)', 
                    fontSize: '1.1rem'
                    }}
                >

            
                {loadingList || errorList ? null : (
                    filtered.length > 0 ? (
                        // Muestra el número de resultados (Contador)
                        <p style={{ color: '#ffd000ff', fontWeight: 'bold' }}>
                            {showFavoritesOnly ? `Mostrando **${filtered.length}** Pokémon Favoritos.` :
                            `Mostrando **${filtered.length}** Pokémon ${(search.trim() || type) ? ` que coinciden con los filtros.` : ` de la Pokédex.`}`
                            }
                        </p>
                    ) : (
                        // Mensaje de lista vacía (Empty State)
                        <p style={{ color: '#ff0000ff', fontWeight: 'bold' }}>
                            {showFavoritesOnly ? `No hay Pokémon que coincidan con los filtros en tu lista de favoritos.` : 
                            `No se encontró ningun Pokémon que coincida con la busqueda!`
                            }
                        </p>
                    )
                )}
            </section>

            {/* SECCIÓN: Nombre del Equipo Favorito (Ubicación final correcta) */}
            {teamName && showFavoritesOnly && (
                <section 
                    style={{
                        marginBottom: '1rem',
                        padding: '1rem 2rem',
                        backgroundColor: 'var(--card-background)', // Fondo de la tarjeta
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        border: '1px solid #ffcb05',
                        textAlign: 'center',
                        width: '90%',
                        maxWidth: '400px',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                        Equipo Favorito Actual: 
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', color: '#2a75bb', fontWeight: 'bolder' }}>
                        {teamName} ({favoritePokemonNames.length} Pokémon)
                    </p>
                </section>
            )}

            {/* Grid de Pokémon */}
            {loadingList ? (
                <Loader />
            ) : errorList ? (
                <ErrorMessage message={errorList} />
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1rem',
                        width: '100%',
                        maxWidth: '1100px',
                    }}
                >
                    {currentPagePokemons.map((p) => (
                        <PokemonCard key={p.id} {...p} />
                    ))}
                </div>
            )}

            {/* Controles de paginación */}
            <section
                style={{
                    marginTop: '3rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    backgroundColor: '#1f2530',
                    padding: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                    border: '2px solid #2a75bb',
                }}
            >
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2a75bb',
                        color: '#ffcb05',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                    }}
                >
                    ← Anterior
                </button>
                <span style={{ color: '#ffffff' }}>
                    Página {page} de {totalPages}
                </span>
                <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2a75bb',
                        color: '#ffcb05',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                    }}
                >
                    Siguiente →
                </button>
            </section>
        </main>
    );
};

export default HomePage;