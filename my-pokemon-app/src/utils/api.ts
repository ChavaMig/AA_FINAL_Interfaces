// src/utils/api.ts

export type Pokemon = {
    id: number;
    name: string;
    image: string;
    types: string[];

    sprites: {
        front_default: string;
        other?: { 'official-artwork'?: { front_default: string } };
    };
    height: number;
    weight: number;
    stats: {
        base_stat: number;
        stat: { name: string };
    }[];
};

const BASE_URL = 'https://pokeapi.co/api/v2';

// =======================
// TIPOS MÍNIMOS
// =======================
type PokemonListResponse = {
    results: {
        name: string;
        url: string;
    }[];
};

type PokemonTypesResponse = {
    results: {
        name: string;
    }[];
};

// =======================
// FETCH SEGURO
// =======================
async function safeFetch<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} al buscar ${url}`);
    return res.json();
}

// =======================
// FUNCIÓN ADAPTADORA
// =======================
const formatPokemon = (data: unknown): Pokemon => {
    const pokemon = data as {
        id: number;
        name: string;
        sprites: {
            front_default: string;
            other?: { 'official-artwork'?: { front_default: string } };
        };
        types: { type: { name: string } }[];
        height: number;
        weight: number;
        stats: {
            base_stat: number;
            stat: { name: string };
        }[];
    };

    const officialArtwork =
        pokemon.sprites.other?.['official-artwork']?.front_default ||
        pokemon.sprites.front_default ||
        '';

    return {
        id: pokemon.id,
        name: pokemon.name,
        image: officialArtwork,
        types: pokemon.types.map((t) => t.type.name),
        sprites: pokemon.sprites,
        height: pokemon.height,
        weight: pokemon.weight,
        stats: pokemon.stats,
    };
};

// =======================
// LISTADO
// =======================
export async function getPokemons(limit = 150): Promise<Pokemon[]> {
    const data = await safeFetch<PokemonListResponse>(
        `${BASE_URL}/pokemon?limit=${limit}`
    );

    const results = await Promise.all(
        data.results.map(async (p) => {
            const detail = await safeFetch<unknown>(p.url);
            return formatPokemon(detail);
        })
    );

    return results;
}

// =======================
// DETALLE
// =======================
export async function getPokemonById(id: string | number): Promise<Pokemon> {
    const data = await safeFetch<unknown>(
        `${BASE_URL}/pokemon/${String(id).toLowerCase()}`
    );
    return formatPokemon(data);
}

// =======================
// TIPOS
// =======================
export async function getTypes(): Promise<string[]> {
    const data = await safeFetch<PokemonTypesResponse>(`${BASE_URL}/type`);
    return data.results
        .map((t) => t.name)
        .filter((name) => name !== 'unknown' && name !== 'shadow');
}

// =======================
// SERVICIO EXTERNO SIMULADO
// =======================
export const getTranslatedDescription = (
    pokemonName: string
): Promise<{ original: string; translated: string }> => {
    return new Promise((resolve) => {
        let originalDescription = '';

        if (pokemonName.toLowerCase().includes('pikachu')) {
            originalDescription =
                'A small, yellow, mouse-like Pokémon. It has long, pointy ears with black tips, and two horizontal brown stripes on its back. It stores electricity in its red cheek pouches.';
        } else if (pokemonName.toLowerCase().includes('bulbasaur')) {
            originalDescription =
                'It has a light-blue-green body with a large, green, bulb on its back. The bulb absorbs sunlight, which it uses to grow. It is very sturdy and can endure prolonged rain.';
        } else {
            originalDescription =
                'A common species of Pokémon inhabiting various regions of the world. It possesses unique powers related to its type and evolution stage. This text comes from a third-party translation service.';
        }

        setTimeout(() => {
            let translatedDescription = '';

            if (originalDescription.includes('electricity')) {
                translatedDescription =
                    'Un Pokémon pequeño, amarillo, parecido a un ratón. Almacena electricidad en sus bolsas rojas de las mejillas. Es muy popular entre los entrenadores.';
            } else if (originalDescription.includes('bulb')) {
                translatedDescription =
                    'Posee un cuerpo verde azulado con un gran bulbo verde en su espalda. El bulbo absorbe la luz solar para crecer.';
            } else {
                translatedDescription =
                    'Una especie común de Pokémon que habita en varias regiones del mundo. Posee poderes únicos relacionados con su tipo y etapa evolutiva. Este texto proviene de un servicio de traducción de terceros.';
            }

            resolve({
                original: originalDescription,
                translated: translatedDescription,
            });
        }, 2000);
    });
};
