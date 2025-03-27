import { SWRProvider } from "@/lib/swr-config.jsx";

export default function CreateEventLayout({ children }) {
  return (
    <SWRProvider>
      <div className="">{children}</div>
    </SWRProvider>
  );
}
