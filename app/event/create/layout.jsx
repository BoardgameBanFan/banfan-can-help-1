import { SWRProvider } from "@/lib/swr-config.jsx";

export default function CreateEventLayout({ children }) {
  return (
    <SWRProvider>
      <div className="p-4">{children}</div>
    </SWRProvider>
  );
}
