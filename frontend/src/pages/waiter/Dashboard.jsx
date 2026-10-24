import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// 1. API Service (up 2 levels from src/pages/waiter/ to src/)
import { createOrder, getTables } from "../../services/api";

// 2. Utils (Notice the filename is formatters, not format)
import { formatStatus } from "../../utils/formatters";

export default function WaiterDashboard() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadTables = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTables();
      setTables(Array.isArray(data) ? data : data.tables || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedTable || !itemName.trim()) {
      setError("Please select a table and enter an item name.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    setSubmitting(true);

    try {
      await createOrder({
        tableId: selectedTable,
        items: [
          {
            name: itemName.trim(),
            quantity: parsedQuantity,
          },
        ],
      });

      setMessage("Order submitted successfully.");
      setItemName("");
      setQuantity("1");
      await loadTables();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const activeCount = tables.filter(
    (table) => table.status === "occupied" ||
               table.status === "active"
  ).length;

  return (
    <main className="waiter-page">
      <header className="waiter-header">
        <div>
          <p className="eyebrow">RESTAURANT MANAGEMENT SYSTEM</p>
          <h1>Waiter Dashboard</h1>
          <p>Welcome to the active tables and floor order taking panel.</p>
        </div>

        <Link className="primary-button" to="/waiter/orders">
          View Orders
        </Link>
      </header>

      <section className="waiter-stats">
        <article className="stat-card">
          <span>Total Tables</span>
          <strong>{loading ? "…" : tables.length}</strong>
        </article>

        <article className="stat-card">
          <span>Active Tables</span>
          <strong>{loading ? "…" : activeCount}</strong>
        </article>

        <article className="stat-card">
          <span>Available Tables</span>
          <strong>{loading ? "…" : tables.length - activeCount}</strong>
        </article>
      </section>

      {error && (
        <div className="alert error-alert" role="alert">
          {error}
          <button type="button" onClick={loadTables}>
            Retry
          </button>
        </div>
      )}

      {message && (
        <div className="alert success-alert" role="status">
          {message}
        </div>
      )}

      <section className="waiter-section">
        <div className="section-heading">
          <div>
            <h2>Dining Tables</h2>
            <p>Monitor table availability and occupancy.</p>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={loadTables}
            disabled={loading}
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p>Loading tables…</p>
        ) : tables.length === 0 ? (
          <p>No tables found. Check your backend table data.</p>
        ) : (
          <div className="table-grid">
            {tables.map((table) => (
              <button
                className={`dining-table ${
                  selectedTable === String(table.id) ? "selected" : ""
                }`}
                key={table.id}
                type="button"
                onClick={() => setSelectedTable(String(table.id))}
              >
                <strong>
                  {table.name || `Table ${table.table_number || table.id}`}
                </strong>

                <span className={`status status-${table.status}`}>
                  {formatStatus(table.status)}
                </span>

                <small>
                  {table.capacity
                    ? `${table.capacity} seats`
                    : "Capacity not provided"}
                </small>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="waiter-section">
        <h2>Take a New Order</h2>

        <form className="order-form" onSubmit={handleSubmit}>
          <label htmlFor="table">Select table</label>
          <select
            id="table"
            value={selectedTable}
            onChange={(event) => setSelectedTable(event.target.value)}
            required
          >
            <option value="">Choose a table</option>
            {tables.map((table) => (
              <option key={table.id} value={String(table.id)}>
                {table.name || `Table ${table.table_number || table.id}`}
              </option>
            ))}
          </select>

          <label htmlFor="item">Food or drink item</label>
          <input
            id="item"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="For example, Doro Wat"
            required
          />

          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />

          <button
            className="primary-button"
            type="submit"
            disabled={submitting || loading}
          >
            {submitting ? "Submitting…" : "Submit Order"}
          </button>
        </form>
      </section>
    </main>
  );
}