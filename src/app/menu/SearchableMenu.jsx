
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch dishes");
  }

  return response.json();
};

export default function SearchableMenu() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const {
    data,
    error,
    isLoading,
    isValidating,
  } = useSWR(`/api/dishes?page=${page}&limit=2`, fetcher, {
    keepPreviousData: true,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  if (isLoading && !data) {
    return <p>Loading menu...</p>;
  }

  if (error && !data) {
    return <p>Could not load the menu. Please try again.</p>;
  }

  const dishes = data?.dishes ?? [];

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name
      .toLowerCase()
      .includes(debouncedSearch.trim().toLowerCase());

    const matchesCategory =
      !category || dish.category === category;

    return matchesSearch && matchesCategory;
  });

  const totalPages = data?.totalPages ?? 1;

  return (
    <section>
      <h2>Our Menu</h2>

      <label htmlFor="dish-search">Search dishes</label>
      <input
        id="dish-search"
        type="search"
        placeholder="Search by dish name..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {isValidating && <p>Updating menu...</p>}

      {category && (
        <p>
          Category: {category}{" "}
          <Link href="/menu">Clear category</Link>
        </p>
      )}

      <div>
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <article key={dish.id}>
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <p>{dish.price} ETB</p>

              <Link href={`/menu/${dish.id}`}>
                View Dish
              </Link>
            </article>
          ))
        ) : (
          <p>No dishes found on this page.</p>
        )}
      </div>

      <nav aria-label="Menu pagination">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          {" "}Page {page} of {totalPages}{" "}
        </span>

        <button
          type="button"
          onClick={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
          disabled={page >= totalPages}
        >
          Next
        </button>
      </nav>
    </section>
  );
}
