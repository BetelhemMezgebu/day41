
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    orderId: "DEMO-1001",
    status: "Preparing",
    updatedAt: new Date().toISOString(),
  });
}
