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
            <span className="eyebrow">Trattoria · Est. 1987</span>
            <h1 className={styles.heroTitle}>
              Bella
              <span className={styles.italic}> Tavola</span>
              <span className={styles.heroMark}>.</span>
            </h1>
            <p className={styles.lede}>
              {restaurant?.about ??
                "A family-run trattoria serving seasonal Italian fare since 1987."}
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
              <span>since</span>
              <strong>1987</strong>
              <span>riverside</span>
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
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.storyCopy}>
            <span className="eyebrow">La Famiglia</span>
            <h2>
              Three generations. One oven. <br />
              Dough that rests seventy-two hours.
            </h2>
            <p>
              Bella Tavola began as a twelve-seat room on Olive Street. Today
              the dining room is larger but the kitchen still runs on the same
              hand-bound notebook of recipes, translated from a village in
              Abruzzo in 1963. We source what is seasonal, we cook what is
              honest, we pour what we drink at home.
            </p>
            <div className={styles.signature}>— Nonna Lucia</div>
          </div>
          <div className={styles.storyVisual}>
            <div className={styles.storyCard}>
              <span className={styles.storyLabel}>Tonight’s oven</span>
              <p className={styles.storyQuote}>
                &ldquo;If the crust doesn&rsquo;t crack, the fire was not hot
                enough.&rdquo;
              </p>
              <span className={styles.storyAuthor}>— Marco, Pizzaiolo</span>
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
