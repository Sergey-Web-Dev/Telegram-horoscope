import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sign = url.searchParams.get("sign");

    if (!sign) {
      return NextResponse.json(
        { error: "Invalid sign parameter" },
        { status: 400 }
      );
    }

    const API_URL = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;

    const response = await axios.get(API_URL);

    return NextResponse.json(await response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch horoscope" },
      { status: 500 }
    );
  }
}
