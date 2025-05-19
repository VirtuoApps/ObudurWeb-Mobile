import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Header from "../../Header/Header";
import CreationSteps from "../../ilan-olustur/CreationSteps/CreationSteps";

// Define the params type
type PageProps = {
  params: {
    id: string;
    locale: string;
  };
};

// Function to fetch hotel data
async function getHotelData(id: string) {
  noStore();

  console.log("id", id);
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_NEO_NESTJS_API_URL ||
      "http://localhost:8080/api/v1";
    const res = await fetch(`${baseUrl}/admin/hotels/${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("res", res);

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  // Disable caching at the page level
  noStore();

  // Fetch hotel data using the id directly from params
  const hotelData = await getHotelData(params.id);

  // If hotel data not found, show 404
  if (!hotelData) {
    notFound();
  }

  return (
    <>
      <Header />
      <CreationSteps isUpdate={true} hotelData={hotelData} />
    </>
  );
}
