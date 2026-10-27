
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
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const apiUrl = `/api/dishes?q=${encodeURIComponent(
    debouncedSearch
  )}&category=${encodeURIComponent(category)}&page=${page}&limit=2`;

  const { data, error, isLoading, isValidating } = useSWR(
    apiUrl,
    fetcher,
    { keepPreviousData: true }
  );

  if (isLoading && !data) {
    return <p>Loading menu...</p>;
  }

  if (error && !data) {
    return <p>Could not load the menu. Please try again.</p>;
  }

  const dishes = data?.dishes ?? [];
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

      {search !== debouncedSearch && <p>Updating search...</p>}
      {isValidating && <p>Updating menu...</p>}

      {category && (
        <p>
          Category: {category}{" "}
          <Link href="/menu">Clear category</Link>
        </p>
      )}

      <div>
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <article key={dish.id}>
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <p>{dish.price} ETB</p>
              <Link href={`/menu/${dish.id}`}>View Dish</Link>
            </article>
          ))
        ) : (
          <p>No dishes found.</p>
        )}
      </div>

      <nav aria-label="Menu pagination">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1 || isValidating}
        >
          Previous
        </button>

        <span>
          {" "}Page {data?.page ?? page} of {totalPages}{" "}
          (Total dishes: {data?.total ?? 0}){" "}
        </span>

        <button
          type="button"
          onClick={() => setPage((current) => current + 1)}
          disabled={page >= totalPages || isValidating}
        >
          Next
        </button>
      </nav>
    </section>
  );
}
