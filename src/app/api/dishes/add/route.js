
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const dish = await request.json();

    if (!dish.name || !dish.description || dish.price == null) {
      return NextResponse.json(
        { message: "Name, description, and price are required." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Dish added successfully.",
        dish: {
          id: Date.now(),
          name: dish.name,
          description: dish.description,
          price: Number(dish.price),
          category: dish.category || "traditional",
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request." },
      { status: 400 }
    );
  }
}
