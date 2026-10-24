import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/api";
import { formatCurrency, formatStatus } from "../utils/format";
import "../styles/waiter.css";

export default function WaiterOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <main className="waiter-page">
      <header className="waiter-header">
        <div>
          <p className="eyebrow">RESTAURANT MANAGEMENT SYSTEM</p>
          <h1>Waiter Orders</h1>
          <p>Review orders received by the restaurant.</p>
        </div>

        <Link className="primary-button" to="/waiter">
          Back to Dashboard
        </Link>
      </header>

      <section className="waiter-section">
        <div className="section-heading">
          <h2>Order List</h2>
          <button
            type="button"
            className="secondary-button"
            onClick={loadOrders}
            disabled={loading}
          >
            Refresh Orders
          </button>
        </div>

        {error && <div className="alert error-alert">{error}</div>}

        {loading ? (
          <p>Loading orders…</p>
        ) : orders.length === 0 ? (
          <p>No orders have been received yet.</p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      {order.table_name ||
                        order.table_number ||
                        order.tableId ||
                        "—"}
                    </td>
                    <td>
                      {Array.isArray(order.items)
                        ? order.items
                            .map(
                              (item) =>
                                `${item.name} × ${item.quantity}`
                            )
                            .join(", ")
                        : order.item_name || "—"}
                    </td>
                    <td>
                      {order.total_amount != null
                        ? formatCurrency(order.total_amount)
                        : order.total != null
                          ? formatCurrency(order.total)
                          : "—"}
                    </td>
                    <td>
                      <span
                        className={`status status-${order.status || "pending"}`}
                      >
                        {formatStatus(order.status || "pending")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}