export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag className={`surface p-6 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
