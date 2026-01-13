// src/components/ErrorMessage.tsx
type Props = { message: string };

const ErrorMessage = ({ message }: Props) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,0,0,0.15)',
        color: 'var(--card-text)',
        border: '1px solid rgba(255,0,0,0.4)',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
      }}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
