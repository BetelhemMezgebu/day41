
"use client";

import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch order status");
  }

  return response.json();
};

export default function OrderStatus({ initialOrder }) {
  const orderId = initialOrder.orderId;

  const { data, error, isLoading, isValidating } = useSWR(
    `/api/orders/${orderId}`,
    fetcher,
    {
      fallbackData: initialOrder,
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  if (isLoading && !data) {
    return <p>Loading order status...</p>;
  }

  if (error && !data) {
    return <p>Could not load order status. Please try again.</p>;
  }

  return (
    <section>
      <h3>Order Status</h3>

      <p>Order ID: {data.orderId}</p>
      <p>Status: {data.status}</p>
      <p>
        Last updated:{" "}
        {new Date(data.updatedAt).toLocaleTimeString()}
      </p>

      {isValidating && <p>Checking for updates...</p>}
    </section>
  );
}
