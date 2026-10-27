
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "addisEatsDishes";

const initialDishes = [
  { id: 1, name: "Kitfo", price: 350, category: "traditional", description: "Minced beef Ethiopian dish." },
  { id: 2, name: "Doro Wot", price: 400, category: "traditional", description: "Spicy chicken stew served with injera." },
  { id: 3, name: "Shiro", price: 250, category: "vegetarian", description: "Chickpea stew." },
  { id: 4, name: "Chechebsa", price: 220, category: "traditional", description: "Flatbread mixed with spiced butter." },
];

async function fetchDishes() {
  if (typeof window === "undefined") return initialDishes;

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const response = await fetch("/api/dishes?limit=10");

  if (!response.ok) {
    throw new Error("Could not load dishes.");
  }

  const result = await response.json();
  const dishes = result.dishes ?? initialDishes;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  return dishes;
}

async function saveDish(dish) {
  const existing = await fetchDishes();

  const newDish = {
    ...dish,
    id: Date.now(),
    price: Number(dish.price),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...existing, newDish])
  );

  return newDish;
}

export default function MenuQueryPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("traditional");
  const [description, setDescription] = useState("");

  const {
    data: dishes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  });

  const addDishMutation = useMutation({
    mutationFn: saveDish,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dishes"] });
      setName("");
      setPrice("");
      setCategory("traditional");
      setDescription("");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || Number(price) <= 0) return;

    addDishMutation.mutate({
      name: name.trim(),
      price: Number(price),
      category,
      description: description.trim(),
    });
  }

  return (
    <main>
      <h1>Menu — TanStack Query</h1>

      <form onSubmit={handleSubmit}>
        <h2>Add a dish</h2>

        <label htmlFor="dish-name">Dish name</label>
        <input
          id="dish-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="dish-price">Price (ETB)</label>
        <input
          id="dish-price"
          type="number"
          min="1"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <label htmlFor="dish-category">Category</label>
        <select
          id="dish-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="traditional">Traditional</option>
          <option value="vegetarian">Vegetarian</option>
        </select>

        <label htmlFor="dish-description">Description</label>
        <input
          id="dish-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit" disabled={addDishMutation.isPending}>
          {addDishMutation.isPending ? "Adding..." : "Add dish"}
        </button>

        {addDishMutation.isError && (
          <p role="alert">{addDishMutation.error.message}</p>
        )}

        {addDishMutation.isSuccess && <p>Dish added successfully!</p>}
      </form>

      <h2>Available dishes</h2>

      {isLoading && <p>Loading dishes...</p>}
      {isError && <p role="alert">{error.message}</p>}

      <ul>
        {dishes.map((dish) => (
          <li key={dish.id}>
            <strong>{dish.name}</strong> — {dish.price} ETB
            <p>{dish.category}</p>
            <p>{dish.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
