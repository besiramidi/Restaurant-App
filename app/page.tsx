import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./page.module.css";

export default async function Home() {
  const [restaurant, featured] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.menuItem.findMany({
      where: { available: true, imageUrl: { not: null } },
      include: { category: true },
      take: 3,
      orderBy: { id: "asc" },
    }),
  ]);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className="eyebrow">Ristorante Italiano · Ulm</span>
            <h1 className={styles.heroTitle}>
              Nonno
              <span className={styles.italic}> Franco</span>
              <span className={styles.heroMark}>.</span>
            </h1>
            <p className={styles.lede}>
              {restaurant?.about ??
                "Authentische italienische Küche in Ulm. Frische Zutaten, hausgemachte Pasta und herzliche Gastfreundschaft."}
            </p>
            <div className={styles.ctas}>
              <Link href="/reservations" className="btn btn-primary">
                Reserve a table
              </Link>
              <Link href="/menu" className="btn btn-ghost">
                View the menu
              </Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <div className={styles.stamp}>
              <span>Ulm</span>
              <strong>NF</strong>
              <span>Italia</span>
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>Visit</dt>
                <dd>{restaurant?.address}</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{restaurant?.hours}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{restaurant?.phone}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className={styles.marquee} aria-hidden>
          <div className={styles.marqueeTrack}>
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className={styles.marqueeContent}>
                <em>Antipasti</em> · Handmade Pasta ·{" "}
                <em>Wood-fired Pizza</em> · Secondi · <em>Dolci</em> ·
                Cellar-aged Wines ·{" "}
                <em>Antipasti</em> · Handmade Pasta ·{" "}
                <em>Wood-fired Pizza</em> · Secondi · <em>Dolci</em> ·
                Cellar-aged Wines ·
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredHead}>
          <span className="eyebrow">Dalla Cucina</span>
          <h2>
            Plates the kitchen is <em className={styles.italic}>most proud</em>{" "}
            of this week.
          </h2>
          <Link href="/menu" className={styles.seeAll}>
            See the full menu
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className={styles.featuredGrid}>
          {featured.map((item, idx) => (
            <article key={item.id} className={styles.dish}>
              <div className={styles.dishImage}>
                {item.imageUrl && (
                  /* Intentional: external unsplash images, plain img for simplicity */
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.imageUrl} alt={item.name} loading="lazy" />
                )}
                <span className={styles.dishIndex}>
                  0{idx + 1}
                </span>
              </div>
              <div className={styles.dishMeta}>
                <span className={styles.dishCat}>{item.category.name}</span>
                <h3 className={styles.dishName}>{item.name}</h3>
                <p>{item.description}</p>
                <span className={styles.dishPrice}>
                  {item.price.toFixed(2)} €
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.storyCopy}>
            <span className="eyebrow">Über Uns</span>
            <h2>
              Tradition trifft Leidenschaft. <br />
              Echte italienische Küche in Ulm.
            </h2>
            <p>
              Bei Nonno Franco kochen wir mit Herz und frischen Zutaten —
              so wie es Nonno Franco uns beigebracht hat. Jedes Gericht
              erzählt eine Geschichte aus Italien, serviert mit Liebe
              und Gastfreundschaft mitten in Ulm.
            </p>
            <div className={styles.signature}>— Familie Giordano</div>
          </div>
          <div className={styles.storyVisual}>
            <div className={styles.storyCard}>
              <span className={styles.storyLabel}>Unsere Philosophie</span>
              <p className={styles.storyQuote}>
                &ldquo;Gutes Essen braucht Zeit, Liebe und die besten
                Zutaten.&rdquo;
              </p>
              <span className={styles.storyAuthor}>— Nonno Franco</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.reserveCta}>
        <div className={styles.reserveCtaInner}>
          <h2>
            A table is waiting,
            <br />
            <em className={styles.italic}>andiamo.</em>
          </h2>
          <div className={styles.ctas}>
            <Link href="/reservations" className="btn btn-primary">
              Reserve a table
            </Link>
            <Link href="/order" className="btn btn-secondary">
              Order for pickup
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
