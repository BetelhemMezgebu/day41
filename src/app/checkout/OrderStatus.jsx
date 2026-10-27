
"use client";

import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch order status");
  }

  return response.json();
};

export default function OrderStatus() {
  const { data, error, isLoading, isValidating } = useSWR(
    "/api/orders/status",
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  if (isLoading) {
    return <p>Loading order status...</p>;
  }

  if (error) {
    return <p>Could not load order status.</p>;
  }

  return (
    <section>
      <h2>Order Status Demo</h2>
      <p>Order: {data.orderId}</p>
      <p>Status: {data.status}</p>
      <p>Last checked: {new Date(data.updatedAt).toLocaleTimeString()}</p>
      <p>{isValidating ? "Checking status..." : "Waiting for next check"}</p>
    </section>
  );
}
