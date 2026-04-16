"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./admin.module.css";

type Reservation = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  partySize: number;
  date: string;
  notes: string | null;
  status: string;
  table: { id: number; number: number; capacity: number } | null;
  createdAt: string;
};

type OrderItemRow = {
  id: number;
  quantity: number;
  price: number;
  menuItem: { id: number; name: string };
};

type OrderRow = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  type: string;
  address: string | null;
  notes: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItemRow[];
};

type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  sortOrder: number;
  items: MenuItem[];
};

type Tab = "reservations" | "orders" | "menu";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("reservations");

  return (
    <main className={styles.main}>
      <header className={styles.head}>
        <span className="eyebrow">Quartier Generale</span>
        <h1>
          Front of <em className={styles.italic}>house</em>.
        </h1>
        <p className={styles.lede}>
          Seat the room, clear the kitchen rail, keep the menu true.
        </p>
      </header>

      <nav className={styles.tabs} aria-label="admin sections">
        {(
          [
            { id: "reservations", label: "Reservations" },
            { id: "orders", label: "Orders" },
            { id: "menu", label: "Menu" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className={styles.panel}>
        {tab === "reservations" && <ReservationsPanel />}
        {tab === "orders" && <OrdersPanel />}
        {tab === "menu" && <MenuPanel />}
      </div>
    </main>
  );
}

/* ------------------ Reservations ------------------ */

function ReservationsPanel() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/reservations");
    const data = await r.json();
    setReservations(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: number, status: string) {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete reservation?")) return;
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <section>
      <div className={styles.panelHead}>
        <h2>Reservations</h2>
        <button className="btn btn-ghost" onClick={load} type="button">
          Refresh
        </button>
      </div>
      {loading && <p className={styles.empty}>Loading…</p>}
      {!loading && reservations.length === 0 && (
        <p className={styles.empty}>No reservations yet.</p>
      )}
      <ul className={styles.list}>
        {reservations.map((r) => (
          <li key={r.id} className={styles.row}>
            <div className={styles.rowHead}>
              <div>
                <h3>{r.name}</h3>
                <p className={styles.sub}>
                  {r.email}
                  {r.phone ? ` · ${r.phone}` : ""}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <dl className={styles.rowMeta}>
              <div>
                <dt>When</dt>
                <dd>{new Date(r.date).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Party</dt>
                <dd>{r.partySize}</dd>
              </div>
              <div>
                <dt>Table</dt>
                <dd>
                  {r.table
                    ? `No. ${r.table.number} · seats ${r.table.capacity}`
                    : "Unassigned"}
                </dd>
              </div>
              {r.notes && (
                <div>
                  <dt>Notes</dt>
                  <dd>{r.notes}</dd>
                </div>
              )}
            </dl>
            <div className={styles.actions}>
              {r.status !== "confirmed" && (
                <button
                  className="btn btn-ghost"
                  onClick={() => setStatus(r.id, "confirmed")}
                  type="button"
                >
                  Confirm
                </button>
              )}
              {r.status !== "cancelled" && (
                <button
                  className="btn btn-ghost"
                  onClick={() => setStatus(r.id, "cancelled")}
                  type="button"
                >
                  Cancel
                </button>
              )}
              {r.status !== "completed" && (
                <button
                  className="btn btn-ghost"
                  onClick={() => setStatus(r.id, "completed")}
                  type="button"
                >
                  Mark complete
                </button>
              )}
              <button
                className={styles.danger}
                onClick={() => remove(r.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------ Orders ------------------ */

function OrdersPanel() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/orders");
    const data = await r.json();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <section>
      <div className={styles.panelHead}>
        <h2>Orders</h2>
        <button className="btn btn-ghost" onClick={load} type="button">
          Refresh
        </button>
      </div>
      {loading && <p className={styles.empty}>Loading…</p>}
      {!loading && orders.length === 0 && (
        <p className={styles.empty}>No orders yet.</p>
      )}
      <ul className={styles.list}>
        {orders.map((o) => (
          <li key={o.id} className={styles.row}>
            <div className={styles.rowHead}>
              <div>
                <h3>
                  {o.customerName}{" "}
                  <span className={styles.orderNum}>
                    · #{o.id.toString().padStart(5, "0")}
                  </span>
                </h3>
                <p className={styles.sub}>
                  {o.customerEmail} · {o.type}
                  {o.address ? ` · ${o.address}` : ""}
                </p>
              </div>
              <div className={styles.totalChip}>${o.total.toFixed(2)}</div>
            </div>
            <ul className={styles.itemList}>
              {o.items.map((it) => (
                <li key={it.id}>
                  <span>
                    {it.quantity} × {it.menuItem.name}
                  </span>
                  <span>${(it.quantity * it.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.rowFoot}>
              <StatusBadge status={o.status} />
              <span className={styles.placed}>
                Placed {new Date(o.createdAt).toLocaleString()}
              </span>
            </div>
            <div className={styles.actions}>
              {(
                ["pending", "preparing", "ready", "completed"] as const
              ).map((s) => (
                <button
                  key={s}
                  className={`btn btn-ghost ${
                    o.status === s ? styles.activeBtn : ""
                  }`}
                  onClick={() => setStatus(o.id, s)}
                  type="button"
                  disabled={o.status === s}
                >
                  {s}
                </button>
              ))}
              <button
                className={styles.danger}
                onClick={() => remove(o.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------ Menu ------------------ */

function MenuPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState("");
  const [newItem, setNewItem] = useState<{
    categoryId: number | "";
    name: string;
    description: string;
    price: string;
    imageUrl: string;
  }>({ categoryId: "", name: "", description: "", price: "", imageUrl: "" });
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/menu");
    const data = await r.json();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCat.trim()) return;
    await fetch("/api/admin/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCat, sortOrder: categories.length + 1 }),
    });
    setNewCat("");
    load();
  }

  async function removeCategory(id: number) {
    if (!confirm("Delete category and all items?")) return;
    await fetch(`/api/admin/menu/categories/${id}`, { method: "DELETE" });
    load();
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.categoryId || !newItem.name || !newItem.price) return;
    await fetch("/api/admin/menu/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: Number(newItem.categoryId),
        name: newItem.name,
        description: newItem.description || null,
        price: Number(newItem.price),
        imageUrl: newItem.imageUrl || null,
      }),
    });
    setNewItem({
      categoryId: newItem.categoryId,
      name: "",
      description: "",
      price: "",
      imageUrl: "",
    });
    load();
  }

  async function saveEdit() {
    if (!editItem) return;
    await fetch(`/api/admin/menu/items/${editItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        imageUrl: editItem.imageUrl,
        available: editItem.available,
        categoryId: editItem.categoryId,
      }),
    });
    setEditItem(null);
    load();
  }

  async function removeItem(id: number) {
    if (!confirm("Delete item?")) return;
    await fetch(`/api/admin/menu/items/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleAvail(item: MenuItem) {
    await fetch(`/api/admin/menu/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    load();
  }

  return (
    <section>
      <div className={styles.panelHead}>
        <h2>Menu</h2>
        <button className="btn btn-ghost" onClick={load} type="button">
          Refresh
        </button>
      </div>

      <div className={styles.menuForms}>
        <form className={styles.menuForm} onSubmit={addCategory}>
          <h3>New category</h3>
          <div className={styles.menuRow}>
            <input
              placeholder="e.g. Aperitivi"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button className="btn btn-ghost" type="submit">
              Add
            </button>
          </div>
        </form>

        <form className={styles.menuForm} onSubmit={addItem}>
          <h3>New item</h3>
          <div className={styles.menuRow}>
            <select
              value={newItem.categoryId}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  categoryId: e.target.value
                    ? Number(e.target.value)
                    : "",
                })
              }
            >
              <option value="">Category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <input
              placeholder="Price"
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
          </div>
          <div className={styles.menuRow}>
            <input
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
            <input
              placeholder="Image URL (optional)"
              value={newItem.imageUrl}
              onChange={(e) =>
                setNewItem({ ...newItem, imageUrl: e.target.value })
              }
            />
            <button className="btn btn-primary" type="submit">
              Add item
            </button>
          </div>
        </form>
      </div>

      {loading && <p className={styles.empty}>Loading…</p>}
      <div className={styles.menuCats}>
        {categories.map((cat) => (
          <div key={cat.id} className={styles.menuCat}>
            <div className={styles.menuCatHead}>
              <h3>{cat.name}</h3>
              <button
                className={styles.danger}
                onClick={() => removeCategory(cat.id)}
                type="button"
              >
                Delete category
              </button>
            </div>
            <ul className={styles.menuItems}>
              {cat.items.map((item) => (
                <li key={item.id} className={styles.menuItem}>
                  {editItem?.id === item.id ? (
                    <div className={styles.editForm}>
                      <input
                        value={editItem.name}
                        onChange={(e) =>
                          setEditItem({ ...editItem, name: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editItem.price}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            price: Number(e.target.value),
                          })
                        }
                      />
                      <textarea
                        rows={2}
                        value={editItem.description ?? ""}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            description: e.target.value,
                          })
                        }
                      />
                      <input
                        placeholder="Image URL"
                        value={editItem.imageUrl ?? ""}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            imageUrl: e.target.value,
                          })
                        }
                      />
                      <div className={styles.actions}>
                        <button
                          className="btn btn-primary"
                          onClick={saveEdit}
                          type="button"
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => setEditItem(null)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.menuItemMain}>
                        <strong>{item.name}</strong>
                        <span className={styles.menuItemPrice}>
                          ${item.price.toFixed(2)}
                        </span>
                        {!item.available && (
                          <span className={styles.off}>unavailable</span>
                        )}
                      </div>
                      {item.description && (
                        <p className={styles.menuItemDesc}>
                          {item.description}
                        </p>
                      )}
                      <div className={styles.actions}>
                        <button
                          className="btn btn-ghost"
                          onClick={() => setEditItem(item)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => toggleAvail(item)}
                          type="button"
                        >
                          {item.available
                            ? "Mark unavailable"
                            : "Mark available"}
                        </button>
                        <button
                          className={styles.danger}
                          onClick={() => removeItem(item.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "confirmed" || status === "ready" || status === "completed"
      ? "good"
      : status === "cancelled"
        ? "bad"
        : "neutral";
  return <span className={`${styles.badge} ${styles[`badge_${tone}`]}`}>{status}</span>;
}
