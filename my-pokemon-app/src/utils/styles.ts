// src/utils/styles.ts

// Mapeo de colores para cada tipo de Pokémon (HEX o nombres de colores)
export const TypeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    dark: '#705848',
    fairy: '#EE99AC',
};

// Función para aplicar estilos al span del tipo
export const TypeStyles = (type: string): React.CSSProperties => {
    const color = TypeColors[type.toLowerCase()] || '#68A090'; // Color por defecto si no se encuentra

    return {
        padding: '0.3rem 0.8rem',
        borderRadius: '12px',
        backgroundColor: color,
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.8rem',
        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.2)`,
        minWidth: '60px',
        textAlign: 'center'
    };
};