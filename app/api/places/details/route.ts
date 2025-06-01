import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const placeId = url.searchParams.get("place_id");
  const language = url.searchParams.get("language") || "tr";

  if (!placeId) {
    return NextResponse.json(
      { error: "place_id parameter is required" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=geometry,formatted_address,name,address_components&key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyCuWfmRQouyhfUcovYc33TeAvn5kZFeRTs"
    }&language=${language}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
