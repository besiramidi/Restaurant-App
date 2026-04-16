"use client";

import { useMemo, useState } from "react";
import styles from "./reservations.module.css";

type Reservation = {
  id: number;
  name: string;
  email: string;
  partySize: number;
  date: string;
  status: string;
  table: { id: number; number: number; capacity: number } | null;
};

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ReservationsPage() {
  const minDate = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 30);
    d.setSeconds(0, 0);
    return toLocalInputValue(d);
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    partySize: 2,
    date: minDate,
    notes: "",
  });
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success"; reservation: Reservation }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          partySize: Number(form.partySize),
          date: new Date(form.date).toISOString(),
          phone: form.phone || null,
          notes: form.notes || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not save reservation");
      }
      const reservation: Reservation = await res.json();
      setStatus({ kind: "success", reservation });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  const reservation =
    status.kind === "success" ? status.reservation : null;

  return (
    <main className={styles.main}>
      <div className={styles.shell}>
        <aside className={styles.left}>
          <span className="eyebrow">Tavolo per Due</span>
          <h1>
            Book a <em className={styles.italic}>table</em>.
          </h1>
          <p className={styles.lede}>
            The dining room holds thirty-eight covers. We seat in two-hour
            windows so each table can breathe — and so can the kitchen.
          </p>
          <dl className={styles.meta}>
            <div>
              <dt>Hours</dt>
              <dd>
                Mon–Thu 17:00–22:00
                <br />
                Fri–Sat 12:00–23:00
                <br />
                Sun 12:00–21:00
              </dd>
            </div>
            <div>
              <dt>Large parties</dt>
              <dd>
                For eight guests or more, please call
                <br />
                +1 (555) 012-3344
              </dd>
            </div>
            <div>
              <dt>Private dining</dt>
              <dd>The cellar seats fourteen. Inquire by email.</dd>
            </div>
          </dl>
        </aside>

        <section className={styles.right}>
          {reservation ? (
            <div className={styles.confirmation}>
              <span className="eyebrow">Confermato</span>
              <h2>
                {reservation.status === "confirmed"
                  ? "Your table is set."
                  : "We have your request."}
              </h2>
              <p className={styles.confirmCopy}>
                {reservation.status === "confirmed"
                  ? `A booking for ${reservation.partySize} has been placed for ${new Date(
                      reservation.date,
                    ).toLocaleString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}.`
                  : "Our host will review availability and confirm shortly by email."}
              </p>
              <dl className={styles.receipt}>
                <div>
                  <dt>Guest</dt>
                  <dd>{reservation.name}</dd>
                </div>
                <div>
                  <dt>Party</dt>
                  <dd>{reservation.partySize}</dd>
                </div>
                <div>
                  <dt>When</dt>
                  <dd>{new Date(reservation.date).toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd className={styles.status}>{reservation.status}</dd>
                </div>
                {reservation.table && (
                  <div>
                    <dt>Table</dt>
                    <dd>
                      No. {reservation.table.number} · seats{" "}
                      {reservation.table.capacity}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Ref</dt>
                  <dd>#{reservation.id.toString().padStart(5, "0")}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  setStatus({ kind: "idle" })
                }
              >
                Book another
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={submit} noValidate>
              <div className={styles.row}>
                <div className="field">
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="partySize">Party size</label>
                  <select
                    id="partySize"
                    value={form.partySize}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        partySize: Number(e.target.value),
                      })
                    }
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="date">Date & time</label>
                <input
                  id="date"
                  type="datetime-local"
                  required
                  min={minDate}
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="notes">Special requests</label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  placeholder="Allergies, anniversaries, window seat, etc."
                />
              </div>

              {status.kind === "error" && (
                <p className={styles.error}>{status.message}</p>
              )}

              <div className={styles.submit}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status.kind === "loading"}
                >
                  {status.kind === "loading"
                    ? "Sending..."
                    : "Request reservation"}
                </button>
                <span className={styles.fine}>
                  We’ll send a confirmation email within a few hours.
                </span>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
