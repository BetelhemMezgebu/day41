
"use client";

import useSWR from "swr";

function getSavedOrder(initialOrder) {
  try {
    const saved = localStorage.getItem("addisEatsOrder");

    if (saved) {
      const order = JSON.parse(saved);

      if (order.orderId === initialOrder.orderId) {
        return order;
      }
    }
  } catch {
    // Use the server-provided initial order if storage is unavailable.
  }

  return initialOrder;
}

async function fetchOrder(initialOrder) {
  const savedOrder = getSavedOrder(initialOrder);
  return savedOrder;
}

export default function OrderStatus({ initialOrder }) {
  const { data, error, isLoading } = useSWR(
    initialOrder?.orderId
      ? ["addis-eats-order", initialOrder.orderId]
      : null,
    () => fetchOrder(initialOrder),
    {
      fallbackData: initialOrder,
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  if (isLoading && !data) return <p>Loading order status...</p>;
  if (error && !data) return <p>Could not load the order status.</p>;
  if (!data) return <p>No order found.</p>;

  return (
    <section>
      <h2>Order Status</h2>
      <p>Order ID: {data.orderId}</p>
      <p>Status: {data.status}</p>
      <p>
        Last updated:{" "}
        {data.updatedAt
          ? new Date(data.updatedAt).toLocaleString()
          : "Not available"}
      </p>
      <p>Order status refreshes every five seconds.</p>
    </section>
  );
}
