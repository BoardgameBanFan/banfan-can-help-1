export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f1efe9]">
      {children}
    </div>
  );
}