import Link from "next/link";
import styles from "./Footer.module.css";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.cols}>
          <div>
            <p className={styles.wordmark}>Bella Tavola</p>
            <p className={styles.tag}>Trattoria · Est. 1987</p>
          </div>
          <div>
            <p className={styles.heading}>Visit</p>
            <p>221 Olive Street</p>
            <p>Riverside</p>
          </div>
          <div>
            <p className={styles.heading}>Hours</p>
            <p>Mon–Thu 17:00–22:00</p>
            <p>Fri–Sat 12:00–23:00</p>
            <p>Sun 12:00–21:00</p>
          </div>
          <div>
            <p className={styles.heading}>Contact</p>
            <p>+1 (555) 012-3344</p>
            <p>hello@bellatavola.test</p>
          </div>
          <div>
            <p className={styles.heading}>Site</p>
            <Link href="/menu">Menu</Link>
            <Link href="/order">Order online</Link>
            <Link href="/reservations">Reservations</Link>
          </div>
        </div>
        <div className={styles.base}>
          <span>© {year} Bella Tavola</span>
          <span className={styles.credit}>Cucina di famiglia</span>
        </div>
      </div>
    </footer>
  );
}
