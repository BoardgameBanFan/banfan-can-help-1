import PocketCard from "@/components/Pocket/PocketCard/PocketCard";
import { Button } from "@/components/ui/button";
import config from "@/config/config";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "口袋清單列表",
  description: "口袋清單列表",
};

export default async function PocketListPage() {
  const response = await fetch(`${config.apiUrl}/pocket`);
  if (!response.ok) {
    return notFound();
  }

  const pockets = await response.json();

  return (
    <div>
      <h1 className="text-xl font-medium mb-4">口袋清單</h1>
      <div className="space-y-4">
        <Link href="/pocket/new">
          <Button variant="outline">新增清單</Button>
        </Link>

        {pockets?.map(pocket => (
          <PocketCard key={pocket._id} pocket={pocket} />
        ))}
      </div>
    </div>
  );
}
