
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

    const search = (searchParams.get("q") || "").trim().toLowerCase();
    const category = searchParams.get("category") || "";

    const allDishes = await getDishes();

    const filteredDishes = allDishes.filter((dish) => {
      const matchesSearch = dish.name.toLowerCase().includes(search);
      const matchesCategory = !category || dish.category === category;

      return matchesSearch && matchesCategory;
    });

    const total = filteredDishes.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * limit;

    return NextResponse.json({
      dishes: filteredDishes.slice(start, start + limit),
      page: currentPage,
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
