// src/utils/api.ts

export type Pokemon = {
  id: number;
  name: string;
  image: string; // URL de la imagen principal (official-artwork)
  types: string[];
  
  // 🚨 Nuevos campos necesarios para el detalle y la funcionalidad:
  sprites: { // Usaremos esto para el sprite pequeño y la URL del oficial
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

async function safeFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al buscar ${url}`);
  return res.json();
}

// 🚨 Función auxiliar para mapear datos de la API a nuestra interfaz, incluyendo los nuevos campos.
const formatPokemon = (data: any): Pokemon => {
    const officialArtwork = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default || '';

    return {
        id: data.id,
        name: data.name,
        image: officialArtwork,
        types: data.types.map((t: any) => t.type.name),
        // Nuevos campos del detalle:
        sprites: data.sprites,
        height: data.height,
        weight: data.weight,
        stats: data.stats, // La estructura ya es un array de objetos
    };
};


// 1️⃣ Listado completo con límite configurable
export async function getPokemons(limit = 150): Promise<Pokemon[]> {
  const data = await safeFetch<any>(`${BASE_URL}/pokemon?limit=${limit}`);
  const results = await Promise.all(
    data.results.map(async (p: any) => {
      const detail = await safeFetch<any>(p.url);
      return formatPokemon(detail); // Usamos la función auxiliar
    })
  );
  return results;
}

// 2️⃣ Detalle por ID/nombre (Ahora usa la función formatPokemon)
export async function getPokemonById(id: string | number): Promise<Pokemon> {
    const data = await safeFetch<any>(`${BASE_URL}/pokemon/${String(id).toLowerCase()}`);
    return formatPokemon(data);
}

// 3️⃣ Tipos
export async function getTypes(): Promise<string[]> {
  const data = await safeFetch<any>(`${BASE_URL}/type`);
  // Filtramos los tipos 'unknown' y 'shadow' que no suelen ser relevantes
  return data.results.map((t: any) => t.name).filter((name: string) => name !== 'unknown' && name !== 'shadow');
}

// 🚨 4. PUNTO EXTRA 5: Servicio de Traducción de Descripción Simulado
/**
 * Simula la consulta a una API externa (ej. OpenAI, Google Translate)
 * para obtener y traducir la descripción de un Pokémon.
 */
export const getTranslatedDescription = (pokemonName: string): Promise<{ original: string, translated: string }> => {
    return new Promise((resolve) => {
        
        let originalDescription = '';
        if (pokemonName.toLowerCase().includes('pikachu')) {
            originalDescription = "A small, yellow, mouse-like Pokémon. It has long, pointy ears with black tips, and two horizontal brown stripes on its back. It stores electricity in its red cheek pouches.";
        } else if (pokemonName.toLowerCase().includes('bulbasaur')) {
            originalDescription = "It has a light-blue-green body with a large, green, bulb on its back. The bulb absorbs sunlight, which it uses to grow. It is very sturdy and can endure prolonged rain.";
        } else {
            originalDescription = "A common species of Pokémon inhabiting various regions of the world. It possesses unique powers related to its type and evolution stage. This text comes from a third-party translation service.";
        }

        // Simular el tiempo de respuesta de la API externa (2 segundos)
        setTimeout(() => {
            let translatedDescription = '';

            // Simular la traducción basada en el original
            if (originalDescription.includes("electricity")) {
                translatedDescription = "Un Pokémon pequeño, amarillo, parecido a un ratón. Almacena electricidad en sus bolsas rojas de las mejillas. Es muy popular entre los entrenadores.";
            } else if (originalDescription.includes("bulb")) {
                translatedDescription = "Posee un cuerpo verde azulado con un gran bulbo verde en su espalda. El bulbo absorbe la luz solar para crecer.";
            } else {
                translatedDescription = "Una especie común de Pokémon que habita en varias regiones del mundo. Posee poderes únicos relacionados con su tipo y etapa evolutiva. Este texto proviene de un servicio de traducción de terceros.";
            }

            resolve({
                original: originalDescription,
                translated: translatedDescription
            });
        }, 2000); 
    });
};

