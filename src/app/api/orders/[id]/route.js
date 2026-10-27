
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;

  return NextResponse.json({
    orderId: id,
    status: "Preparing",
    updatedAt: new Date().toISOString(),
  });
}
