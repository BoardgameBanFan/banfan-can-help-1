import PocketForm from "@/components/Pocket/PocketForm";

export const metadata = {
  title: "新建口袋清單",
  description: "新建口袋清單",
};

export default function NewPocketPage() {
  return (
    <div>
      <h1 className="text-xl font-medium mb-4">新建口袋清單</h1>
      <PocketForm />
    </div>
  );
}
