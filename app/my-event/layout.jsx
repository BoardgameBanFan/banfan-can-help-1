export default function MyEventLayout({ children }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">即將到來活動</h1>
      {children}
    </div>
  );
}
