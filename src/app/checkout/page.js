
import { placeOrder } from "../actions";
import OrderStatus from "./OrderStatus";

export default function CheckoutPage() {
  const initialOrder = {
    orderId: "DEMO-1001",
    status: "Preparing",
    updatedAt: new Date().toISOString(),
  };

  return (
    <section>
      <h2>Checkout</h2>

      <form action={placeOrder}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required />
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" required />
        </div>

        <button type="submit">Place Order</button>
      </form>

      <OrderStatus initialOrder={initialOrder} />
    </section>
  );
}
