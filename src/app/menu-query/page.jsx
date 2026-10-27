
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

async function fetchDishes() {
  const response = await fetch("/api/dishes?page=1&limit=10");

  if (!response.ok) {
    throw new Error("Failed to fetch menu");
  }

  const result = await response.json();
  return result.dishes;
}

async function addDish(newDish) {
  const response = await fetch("/api/dishes/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDish),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add dish");
  }

  return result.dish;
}

export default function MenuQueryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const queryClient = useQueryClient();

  const {
    data: dishes,
    error,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  });

  const mutation = useMutation({
    mutationFn: addDish,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });

      setName("");
      setDescription("");
      setPrice("");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    mutation.mutate({
      name,
      description,
      price: Number(price),
      category: "traditional",
    });
  }

  if (isPending) return <p>Loading menu...</p>;

  if (error) {
    return <p>Could not load menu: {error.message}</p>;
  }

  return (
    <section>
      <h2>Menu with TanStack Query</h2>

      <h3>Add a Dish</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dish-name">Dish name</label>
          <input
            id="dish-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="dish-description">Description</label>
          <input
            id="dish-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="dish-price">Price (ETB)</label>
          <input
            id="dish-price"
            type="number"
            min="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add Dish"}
        </button>
      </form>

      {mutation.isError && (
        <p role="alert">{mutation.error.message}</p>
      )}

      {mutation.isSuccess && (
        <p>Dish added successfully!</p>
      )}

      <hr />

      <h3>Available Dishes</h3>

      {isFetching && <p>Refreshing menu...</p>}

      {dishes.map((dish) => (
        <article key={dish.id}>
          <h3>{dish.name}</h3>
          <p>{dish.description}</p>
          <p>{dish.price} ETB</p>
          <Link href={`/menu/${dish.id}`}>View Dish</Link>
        </article>
      ))}
    </section>
  );
}
