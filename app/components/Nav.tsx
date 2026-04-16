import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Bella Tavola home">
          <span className={styles.brandMark}>BT</span>
          <span className={styles.brandName}>
            Bella<span className={styles.brandDot}>·</span>Tavola
          </span>
        </Link>
        <nav className={styles.links} aria-label="primary">
          <Link href="/menu">Menu</Link>
          <Link href="/order">Order</Link>
          <Link href="/reservations">Reservations</Link>
          <Link href="/admin" className={styles.admin}>
            Admin
          </Link>
        </nav>
        <Link href="/reservations" className={styles.cta}>
          Reserve
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
