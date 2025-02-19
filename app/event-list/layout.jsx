export default function EventListLayout({ children }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">公開活動</h1>
      {children}
    </div>
  );
}
