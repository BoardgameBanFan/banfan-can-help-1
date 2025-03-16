import { ReactNode } from "react";

interface EventDetailLayoutProps {
  children: ReactNode;
}

export default function EventDetailLayout({ children }: EventDetailLayoutProps) {
  return <div className="container mx-auto px-4">{children}</div>;
}
