import Link from "next/link";
import styles from "./Footer.module.css";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.cols}>
          <div>
            <p className={styles.wordmark}>Nonno Franco</p>
            <p className={styles.tag}>Ristorante Italiano · Ulm</p>
          </div>
          <div>
            <p className={styles.heading}>Adresse</p>
            <p>Gänswieseweg 13</p>
            <p>89073 Ulm</p>
          </div>
          <div>
            <p className={styles.heading}>Öffnungszeiten</p>
            <p>Mo, Mi–Sa 11:30–14:00 · 17:30–21:30</p>
            <p>So 11:30–14:00 · 17:30–21:00</p>
            <p>Di Ruhetag</p>
          </div>
          <div>
            <p className={styles.heading}>Kontakt</p>
            <p>+49 178 98 28 881</p>
            <p>info@nonno-franco.de</p>
          </div>
          <div>
            <p className={styles.heading}>Site</p>
            <Link href="/menu">Menu</Link>
            <Link href="/order">Order online</Link>
            <Link href="/reservations">Reservations</Link>
          </div>
        </div>
        <div className={styles.base}>
          <span>© {year} Nonno Franco</span>
          <span className={styles.credit}>Cucina di famiglia</span>
        </div>
      </div>
    </footer>
  );
}
