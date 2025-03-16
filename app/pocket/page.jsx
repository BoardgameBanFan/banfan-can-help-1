import AddNewPocketButton from "@/components/Pocket/AddNewPocketButton";
import PocketCard from "@/components/Pocket/PocketCard/PocketCard";
import config from "@/config/config";
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
        <AddNewPocketButton />

        {pockets?.map(pocket => (
          <PocketCard key={pocket._id} pocket={pocket} />
        ))}
      </div>
    </div>
  );
}
