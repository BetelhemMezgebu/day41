
import { NextResponse } from "next/server";
import { getDishes } from "../../../lib/dishes";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10) || 1
    );

    const limit = Math.min(
      10,
      Math.max(
        1,
        Number.parseInt(searchParams.get("limit") || "2", 10) || 2
      )
    );

    const allDishes = await getDishes();
    const total = allDishes.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const start = (page - 1) * limit;
    const dishes = allDishes.slice(start, start + limit);

    return NextResponse.json({
      dishes,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to fetch dishes:", error);

    return NextResponse.json(
      { message: "Failed to fetch dishes" },
      { status: 500 }
    );
  }
}
