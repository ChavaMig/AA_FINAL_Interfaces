// src/components/PokemonCard.tsx
import { Link } from 'react-router-dom';

type Props = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

const PokemonCard = ({ id, name, image, types }: Props) => {
  return (
    <Link to={`/pokemon/${id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          color: 'var(--card-text)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'contain',
            borderRadius: '8px',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
        />
        <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{name}</h3>
        <p style={{ margin: 0 }}>{types.join(' • ')}</p>
      </div>
    </Link>
  );
};

export default PokemonCard;
