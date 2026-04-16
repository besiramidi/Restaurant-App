"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./order.module.css";

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

type CartLine = { itemId: number; quantity: number };

type OrderReceipt = {
  id: number;
  total: number;
  type: string;
  status: string;
};

export default function OrderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [checkout, setCheckout] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    type: "pickup" as "pickup" | "delivery",
    address: "",
    notes: "",
  });
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success"; order: OrderReceipt }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: Category[]) => {
        setCategories(data);
        if (data[0]) setActiveCat(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const itemsById = useMemo(() => {
    const m = new Map<number, MenuItem>();
    for (const c of categories) for (const it of c.items) m.set(it.id, it);
    return m;
  }, [categories]);

  const cartItems = cart
    .map((l) => {
      const item = itemsById.get(l.itemId);
      if (!item) return null;
      return { line: l, item };
    })
    .filter((x): x is { line: CartLine; item: MenuItem } => Boolean(x));

  const total = cartItems.reduce(
    (s, { line, item }) => s + line.quantity * item.price,
    0,
  );
  const count = cartItems.reduce((s, { line }) => s + line.quantity, 0);

  function addToCart(itemId: number) {
    setCart((c) => {
      const existing = c.find((l) => l.itemId === itemId);
      if (existing) {
        return c.map((l) =>
          l.itemId === itemId ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [...c, { itemId, quantity: 1 }];
    });
  }

  function updateQty(itemId: number, qty: number) {
    setCart((c) =>
      qty <= 0
        ? c.filter((l) => l.itemId !== itemId)
        : c.map((l) => (l.itemId === itemId ? { ...l, quantity: qty } : l)),
    );
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    if (checkout.type === "delivery" && !checkout.address.trim()) {
      setStatus({
        kind: "error",
        message: "Address required for delivery.",
      });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: checkout.customerName,
          customerEmail: checkout.customerEmail,
          customerPhone: checkout.customerPhone || null,
          type: checkout.type,
          address: checkout.type === "delivery" ? checkout.address : null,
          notes: checkout.notes || null,
          items: cart.map((l) => ({
            menuItemId: l.itemId,
            quantity: l.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not place order");
      }
      const order: OrderReceipt = await res.json();
      setStatus({ kind: "success", order });
      setCart([]);
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <main className={styles.main}>
      <header className={styles.head}>
        <div>
          <span className="eyebrow">Porta Via</span>
          <h1>
            Order
            <br />
            <em className={styles.italic}>to go.</em>
          </h1>
          <p className={styles.lede}>
            Pickup from the kitchen in twenty-five minutes, or delivered warm
            within three miles.
          </p>
        </div>
        <button
          type="button"
          className={styles.cartButton}
          onClick={() => setPanelOpen(true)}
          aria-label={`Open cart, ${count} items`}
        >
          <span>Cart</span>
          <strong>{count.toString().padStart(2, "0")}</strong>
        </button>
      </header>

      {loading && <p className={styles.loading}>Loading menu…</p>}

      {!loading && (
        <>
          <div className={styles.catBar}>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${styles.catChip} ${
                  activeCat === c.id ? styles.catChipActive : ""
                }`}
                onClick={() => {
                  setActiveCat(c.id);
                  document
                    .getElementById(`ord-cat-${c.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className={styles.catalog}>
            {categories.map((cat) => (
              <section
                key={cat.id}
                id={`ord-cat-${cat.id}`}
                className={styles.catBlock}
              >
                <div className={styles.catHead}>
                  <h2>{cat.name}</h2>
                  <hr className="rule" />
                </div>
                <div className={styles.grid}>
                  {cat.items.map((item) => {
                    const inCart = cart.find((l) => l.itemId === item.id);
                    return (
                      <article key={item.id} className={styles.card}>
                        <div className={styles.cardImage}>
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className={styles.cardImagePlain} />
                          )}
                          <span className={styles.cardPrice}>
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <div className={styles.cardBody}>
                          <h3>{item.name}</h3>
                          {item.description && <p>{item.description}</p>}
                          {inCart ? (
                            <div className={styles.qty}>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(item.id, inCart.quantity - 1)
                                }
                                aria-label="Remove one"
                              >
                                −
                              </button>
                              <span>{inCart.quantity}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(item.id, inCart.quantity + 1)
                                }
                                aria-label="Add one"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className={styles.addBtn}
                              onClick={() => addToCart(item.id)}
                            >
                              Add
                              <span aria-hidden>+</span>
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* Slide-over cart panel */}
      <div
        className={`${styles.panel} ${panelOpen ? styles.panelOpen : ""}`}
        role="dialog"
        aria-label="Your cart"
        aria-hidden={!panelOpen}
      >
        <div
          className={styles.panelBackdrop}
          onClick={() => setPanelOpen(false)}
          aria-hidden
        />
        <div className={styles.panelBody}>
          <div className={styles.panelHead}>
            <span className="eyebrow">Il Tuo Carrello</span>
            <button
              type="button"
              className={styles.panelClose}
              onClick={() => setPanelOpen(false)}
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {status.kind === "success" ? (
            <div className={styles.receipt}>
              <h2>Grazie.</h2>
              <p>
                Order #{status.order.id.toString().padStart(5, "0")} is being
                prepared. Total ${status.order.total.toFixed(2)}.
              </p>
              <p className={styles.receiptNote}>
                You’ll receive a confirmation email shortly.
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setStatus({ kind: "idle" });
                  setPanelOpen(false);
                }}
              >
                Keep browsing
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className={styles.empty}>
              <h3>Your cart is empty.</h3>
              <p>Add a plate to get started.</p>
            </div>
          ) : (
            <form className={styles.checkout} onSubmit={placeOrder}>
              <ul className={styles.lines}>
                {cartItems.map(({ line, item }) => (
                  <li key={item.id} className={styles.line}>
                    <div className={styles.lineInfo}>
                      <span>{item.name}</span>
                      <span className={styles.linePrice}>
                        ${(item.price * line.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.lineQty}>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.id, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.id, line.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <div className={styles.toggle}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${
                    checkout.type === "pickup" ? styles.toggleActive : ""
                  }`}
                  onClick={() =>
                    setCheckout({ ...checkout, type: "pickup" })
                  }
                >
                  Pickup
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${
                    checkout.type === "delivery" ? styles.toggleActive : ""
                  }`}
                  onClick={() =>
                    setCheckout({ ...checkout, type: "delivery" })
                  }
                >
                  Delivery
                </button>
              </div>

              <div className="field">
                <label htmlFor="cust-name">Name</label>
                <input
                  id="cust-name"
                  required
                  value={checkout.customerName}
                  onChange={(e) =>
                    setCheckout({
                      ...checkout,
                      customerName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="cust-email">Email</label>
                <input
                  id="cust-email"
                  type="email"
                  required
                  value={checkout.customerEmail}
                  onChange={(e) =>
                    setCheckout({
                      ...checkout,
                      customerEmail: e.target.value,
                    })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="cust-phone">Phone</label>
                <input
                  id="cust-phone"
                  type="tel"
                  value={checkout.customerPhone}
                  onChange={(e) =>
                    setCheckout({
                      ...checkout,
                      customerPhone: e.target.value,
                    })
                  }
                />
              </div>

              {checkout.type === "delivery" && (
                <div className="field">
                  <label htmlFor="addr">Delivery address</label>
                  <input
                    id="addr"
                    required
                    value={checkout.address}
                    onChange={(e) =>
                      setCheckout({ ...checkout, address: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="field">
                <label htmlFor="cust-notes">Notes</label>
                <textarea
                  id="cust-notes"
                  rows={3}
                  value={checkout.notes}
                  onChange={(e) =>
                    setCheckout({ ...checkout, notes: e.target.value })
                  }
                />
              </div>

              {status.kind === "error" && (
                <p className={styles.error}>{status.message}</p>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status.kind === "loading"}
              >
                {status.kind === "loading"
                  ? "Placing order…"
                  : `Place order · $${total.toFixed(2)}`}
              </button>
              <Link href="/menu" className={styles.secondaryLink}>
                Back to the menu
              </Link>
            </form>
          )}
        </div>
      </div>

      {/* floating cart button for small screens */}
      {count > 0 && !panelOpen && (
        <button
          type="button"
          className={styles.floatCart}
          onClick={() => setPanelOpen(true)}
        >
          <span>{count} in cart</span>
          <strong>${total.toFixed(2)}</strong>
        </button>
      )}
    </main>
  );
}
