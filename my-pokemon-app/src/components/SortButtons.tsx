// src/components/SortButtons.tsx
type Order = 'asc' | 'desc';

type Props = {
  order: Order;
  onChange: (order: Order) => void;
};

const SortButtons = ({ order, onChange }: Props) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        onClick={() => onChange('asc')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: order === 'asc' ? '2px solid var(--card-text)' : '1px solid var(--card-text)',
          backgroundColor: 'var(--panel-bg)',
          color: 'var(--card-text)',
          cursor: 'pointer',
        }}
      >
        A→Z
      </button>
      <button
        onClick={() => onChange('desc')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: order === 'desc' ? '2px solid var(--card-text)' : '1px solid var(--card-text)',
          backgroundColor: 'var(--panel-bg)',
          color: 'var(--card-text)',
          cursor: 'pointer',
        }}
      >
        Z→A
      </button>
    </div>
  );
};

export default SortButtons;
