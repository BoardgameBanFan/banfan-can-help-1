import config from "@/config/config";
import { notFound } from "next/navigation";

async function SinglePocketPage({ params }) {
  const { id } = await params;

  console.log("hello");

  const response = await fetch(`${config.apiUrl}/pocket/${id}`);
  if (!response.ok) {
    return notFound();
  }

  const pocket = await response.json();

  return <h1>{pocket.title}</h1>;
}

export default SinglePocketPage;
