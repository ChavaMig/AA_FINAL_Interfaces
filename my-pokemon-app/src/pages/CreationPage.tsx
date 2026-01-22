import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import type {SubmitHandler} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {getPokemons, type Pokemon} from '../utils/api';

import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';


// 
interface FavoriteFields {
    favorites: string[];
    listName?: string;
}

const CreationPage = () => {
    const [pokemonOptions, setPokemonOptions] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Lógica para detectar el tema (copiado del Home/Toggle)
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
        (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    );


    useEffect(() => {
        const observer = new MutationObserver(() => {
            const newTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark');
            if (newTheme && newTheme !== currentTheme) {
                setCurrentTheme(newTheme);
            }
        });

        observer.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});

        return () => observer.disconnect();
    }, [currentTheme]);

    //  Definición del color de texto GARANTIZADO
    // Blanco para modo oscuro, gris oscuro para modo claro
    const guaranteedTextColor = currentTheme === 'dark' ? '#ffffff' : '#333333';


    // LLAMADA A LA API PARA CARGAR TODOS LOS POKÉMONS
    useEffect(() => {
        getPokemons(150)
            .then(setPokemonOptions)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<FavoriteFields>({
        defaultValues: {
            favorites: [],
        },
    });

    // Función que se ejecuta al enviar el formulario
    const onSubmit: SubmitHandler<FavoriteFields> = async (data) => {
        try {
            if (data.favorites.length === 0) {
                alert(' Error: Debes seleccionar al menos un Pokémon.');
                return;
            }
            if (data.favorites.length > 6) {
                alert(' Error: Solo puedes seleccionar un máximo de 6 Pokémon.');
                return;
            }

            const teamName = data.listName || `Mi Equipo (${new Date().toLocaleDateString()})`;

            const favoritesPayload = {
                pokemons: data.favorites,
                name: teamName,
                date: new Date().toISOString(),
            };

            localStorage.setItem('my-favorites', JSON.stringify(favoritesPayload));

            alert(` ¡Equipo "${teamName}" (${data.favorites.length} Pokémon) guardado!`);

            navigate('/home');
            reset();

        } catch (error) {
            alert(' Error al guardar los favoritos.');
        }
    };

    if (loading) {
        return <Loader/>;
    }

    if (error) {
        return <ErrorMessage message={error}/>;
    }


    return (
        <main style={{minHeight: '100vh', backgroundColor: 'var(--background)'}}>
            <Header/>
            <ThemeToggle/>

            <section
                style={{
                    padding: '2rem',
                    maxWidth: '600px',
                    margin: '3rem auto',
                    backgroundColor: 'var(--card-background)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    // Si el texto principal funciona, lo deja, sino usa guaranteedTextColor
                    color: 'var(--text-main)'
                }}
            >
                {/* 1. Título principal */}

                <h2 style={{color: guaranteedTextColor, textAlign: 'center', marginBottom: '2rem'}}>
                    ⭐ Selecciona tu Equipo Pokémon Favorito ⭐
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} style={{display: 'grid', gap: '1.5rem'}}>

                    {/* Nombre de la Lista  */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {/* 2. Etiqueta del nombre */}
                        <label style={{color: guaranteedTextColor, marginBottom: '0.5rem'}}>Nombre del Equipo
                            (Opcional)</label>
                        <input
                            {...register("listName", {
                                maxLength: {
                                    value: 50,
                                    message: 'El nombre no puede exceder 50 caracteres.'
                                }
                            })}
                            placeholder="Ej: Equipo de Miguel"
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: errors.listName ? '2px solid red' : '1px solid #ccc',
                                // 3. Color del texto dentro del input
                                color: guaranteedTextColor,
                                backgroundColor: 'var(--background)'
                            }}
                        />
                        {errors.listName &&
                            <p style={{color: 'red', marginTop: '0.5rem'}}>{errors.listName.message}</p>}
                    </div>

                    {/* Selector de Favoritos  */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1rem',
                            // Usar el color garantizado para el borde del listado, ya que el texto principal falla
                            border: `1px solid ${currentTheme === 'dark' ? '#555555' : '#ccc'}`,
                            borderRadius: '8px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            // El color del texto del div label de abajo
                        }}
                    >
                        {/* 4. Título del listado de Pokémon */}
                        <label style={{color: guaranteedTextColor, marginBottom: '1rem', fontWeight: 'bold'}}>
                            Selecciona tu Equipo (Máx. 6)
                        </label>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
                            {pokemonOptions.map((pokemon) => (
                                <label
                                    key={pokemon.id}
                                    // 5. Etiqueta del nombre del Pokémon (Color garantizado)
                                    style={{
                                        color: guaranteedTextColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        value={pokemon.name}
                                        {...register("favorites", {
                                            required: 'Debes seleccionar al menos un Pokémon.',
                                            validate: {
                                                maxSix: (v) => v.length <= 6 || 'Solo puedes seleccionar un máximo de 6 Pokémon.',
                                            }
                                        })}
                                        style={{marginRight: '0.5rem'}}
                                    />
                                    {/* 5. Span del nombre del Pokémon  */}
                                    <span style={{
                                        marginLeft: '0.2rem',
                                        textTransform: 'capitalize',
                                        color: guaranteedTextColor
                                    }}>{pokemon.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.favorites &&
                            <p style={{color: 'red', marginTop: '0.5rem'}}>{errors.favorites.message}</p>}
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: '1rem',
                            backgroundColor: isSubmitting ? '#a0a0a0' : '#2a75bb',
                            color: '#ffcb05',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            marginTop: '1rem',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Lista de Favoritos'}
                    </button>
                </form>
            </section>
        </main>
    );
};

export default CreationPage;