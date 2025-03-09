import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PocketListPage() {
  return (
    <div>
      <h1 className="text-xl font-medium mb-4">口袋清單</h1>
      <div className="space-y-4">
        <Link href="/pocket-list/new">
          <Button variant="outline">新增清單</Button>
        </Link>
      </div>
    </div>
  );
}
