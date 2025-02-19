export default function EventDetailLayout({ children }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">活動詳情</h1>
      {children}
    </div>
  );
}
