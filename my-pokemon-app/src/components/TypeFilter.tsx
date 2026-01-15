// src/components/TypeFilter.tsx
type Props = {
    value: string;
    onChange: (type: string) => void;
    options: string[];
    style?: React.CSSProperties; // añadimos style como prop opcional
};

const TypeFilter = ({value, onChange, options, style}: Props) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '2px solid #2a75bb',
                backgroundColor: '#2a75bb',
                color: '#ffffff',
                fontWeight: 'bold',
                ...style, //  aplico estilos personalizados
            }}
        >
            <option value="">Todos los tipos</option>
            {options.map((type) => (
                <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
            ))}
        </select>
    );
};

export default TypeFilter;
