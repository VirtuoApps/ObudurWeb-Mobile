import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = url.searchParams.get("input");
  const language = url.searchParams.get("language") || "tr";

  if (!input) {
    return NextResponse.json(
      { error: "Input parameter is required" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=geocode&key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyCuWfmRQouyhfUcovYc33TeAvn5kZFeRTs"
    }&language=${language}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
