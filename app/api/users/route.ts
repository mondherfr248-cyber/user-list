import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/users");

    if (!res.ok) {
      throw new Error("Fetch failed");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch users" },
      { status: 500 }
    );
  }
}

