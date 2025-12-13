import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "THEO",
    status: "online",
    message: "THEO is awake and listening."
  });
}
