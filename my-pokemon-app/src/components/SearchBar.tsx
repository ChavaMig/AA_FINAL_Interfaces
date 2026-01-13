// src/components/SearchBar.tsx
type Props = {
  value: string;
  onChange: (value: string) => void;
};

const SearchBar = ({ value, onChange }: Props) => (
  <input
    type="text"
    placeholder="Buscar por nombre…"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1px solid var(--card-text)',
      width: '260px',
      backgroundColor: 'transparent',
      color: 'var(--card-text)',
    }}
  />
);

export default SearchBar;
