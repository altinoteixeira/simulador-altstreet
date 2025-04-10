export function Card({ children }) {
  return (
    <div className="border border-gray-200 rounded shadow-sm">{children}</div>
  );
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
