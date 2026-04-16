import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./menu.module.css";

export const metadata = {
  title: "Menu — Bella Tavola",
};

export default async function MenuPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: { available: true },
        orderBy: { id: "asc" },
      },
    },
  });

  return (
    <main className={styles.main}>
      <header className={styles.head}>
        <div className={styles.headInner}>
          <span className="eyebrow">La Carta</span>
          <h1>
            The menu,
            <br />
            <em className={styles.italic}>this season.</em>
          </h1>
          <p className={styles.lede}>
            Everything from the garden, the fisherman, and the farmer we trust.
            Prices include our hospitality; gratuity is at your discretion.
          </p>
        </div>
        <nav className={styles.jump} aria-label="menu sections">
          {categories.map((c) => (
            <a key={c.id} href={`#cat-${c.id}`}>
              {c.name}
            </a>
          ))}
        </nav>
      </header>

      <div className={styles.sections}>
        {categories.map((cat) => (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className={styles.section}
          >
            <div className={styles.sectionHead}>
              <h2>{cat.name}</h2>
              <span className={styles.count}>
                {cat.items.length.toString().padStart(2, "0")}
              </span>
            </div>
            <hr className="rule" />
            <ul className={styles.items}>
              {cat.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  {item.imageUrl ? (
                    <div className={styles.thumb}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className={styles.thumbPlain} aria-hidden />
                  )}
                  <div className={styles.body}>
                    <div className={styles.nameRow}>
                      <h3>{item.name}</h3>
                      <span className={styles.dots} aria-hidden />
                      <span className={styles.price}>
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    {item.description && (
                      <p className={styles.desc}>{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className={styles.orderCta}>
        <div>
          <span className="eyebrow">Prefer to eat at home?</span>
          <h2>
            Order for <em className={styles.italic}>pickup or delivery</em>.
          </h2>
        </div>
        <Link href="/order" className="btn btn-primary">
          Order online
        </Link>
      </section>
    </main>
  );
}
