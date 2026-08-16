import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button className={`${base} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  );
}
