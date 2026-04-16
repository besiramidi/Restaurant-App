import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";

const url = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  // wipe
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.table.deleteMany();
  await prisma.restaurant.deleteMany();

  // restaurant info
  await prisma.restaurant.create({
    data: {
      name: "Bella Tavola",
      about:
        "A family-run trattoria serving seasonal Italian fare since 1987. Wood-fired pizzas, handmade pasta, and an ever-changing wine list.",
      address: "221 Olive St, Riverside",
      phone: "+1 (555) 012-3344",
      email: "hello@bellatavola.test",
      hours:
        "Mon-Thu 17:00-22:00 · Fri-Sat 12:00-23:00 · Sun 12:00-21:00",
    },
  });

  // tables
  const tableData = [
    { number: 1, capacity: 2 },
    { number: 2, capacity: 2 },
    { number: 3, capacity: 4 },
    { number: 4, capacity: 4 },
    { number: 5, capacity: 4 },
    { number: 6, capacity: 6 },
    { number: 7, capacity: 6 },
    { number: 8, capacity: 8 },
  ];
  await prisma.table.createMany({ data: tableData });

  // menu categories + items
  const categories = [
    {
      name: "Antipasti",
      sortOrder: 1,
      items: [
        {
          name: "Bruschetta al Pomodoro",
          description:
            "Grilled country bread, heirloom tomato, basil, garlic, aged olive oil.",
          price: 9.5,
          imageUrl:
            "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=800&q=80",
        },
        {
          name: "Burrata & Prosciutto",
          description:
            "Creamy burrata, 24-month prosciutto di Parma, grilled peach, arugula.",
          price: 15,
          imageUrl:
            "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80",
        },
        {
          name: "Calamari Fritti",
          description: "Lightly fried squid, lemon, saffron aioli.",
          price: 13,
          imageUrl:
            "https://images.unsplash.com/photo-1625944525533-473f1b3d54a7?w=800&q=80",
        },
      ],
    },
    {
      name: "Pasta",
      sortOrder: 2,
      items: [
        {
          name: "Tagliatelle al Ragù",
          description:
            "Slow-braised beef and pork ragù, fresh egg tagliatelle, parmigiano.",
          price: 19,
          imageUrl:
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
        },
        {
          name: "Cacio e Pepe",
          description:
            "Hand-rolled tonnarelli, pecorino romano, cracked black pepper.",
          price: 17,
          imageUrl:
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
        },
        {
          name: "Lobster Ravioli",
          description: "Maine lobster, mascarpone, saffron cream, chives.",
          price: 26,
          imageUrl:
            "https://images.unsplash.com/photo-1587740908075-9e245311d8d2?w=800&q=80",
        },
      ],
    },
    {
      name: "Pizza",
      sortOrder: 3,
      items: [
        {
          name: "Margherita D.O.P.",
          description:
            "San Marzano tomato, fior di latte, basil, olive oil. 72-hour dough.",
          price: 16,
          imageUrl:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
        },
        {
          name: "Diavola",
          description: "Spicy soppressata, smoked mozzarella, chili honey.",
          price: 18,
          imageUrl:
            "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&q=80",
        },
        {
          name: "Funghi e Tartufo",
          description:
            "Wild mushrooms, taleggio, mozzarella, truffle cream, thyme.",
          price: 22,
          imageUrl:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        },
      ],
    },
    {
      name: "Secondi",
      sortOrder: 4,
      items: [
        {
          name: "Branzino al Forno",
          description:
            "Whole roasted sea bass, fennel, Castelvetrano olives, lemon.",
          price: 34,
          imageUrl:
            "https://images.unsplash.com/photo-1625944525533-473f1b3d54a7?w=800&q=80",
        },
        {
          name: "Bistecca alla Fiorentina",
          description:
            "1kg dry-aged T-bone, rosemary salt, grilled radicchio. (for two)",
          price: 78,
          imageUrl:
            "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
        },
      ],
    },
    {
      name: "Dolci",
      sortOrder: 5,
      items: [
        {
          name: "Tiramisù della Casa",
          description:
            "Espresso-soaked savoiardi, mascarpone cream, cocoa. Made daily.",
          price: 11,
          imageUrl:
            "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
        },
        {
          name: "Panna Cotta",
          description: "Vanilla bean, macerated berries, balsamic.",
          price: 10,
          imageUrl:
            "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
        },
      ],
    },
    {
      name: "Beverages",
      sortOrder: 6,
      items: [
        {
          name: "House Chianti (glass)",
          description: "Tuscan Sangiovese, cherry and leather.",
          price: 12,
          imageUrl: null,
        },
        {
          name: "Aperol Spritz",
          description: "Aperol, prosecco, soda, orange.",
          price: 13,
          imageUrl: null,
        },
        {
          name: "Espresso",
          description: "Single-origin, pulled on a lever machine.",
          price: 4,
          imageUrl: null,
        },
        {
          name: "Sparkling Water",
          description: "Chilled, 500ml.",
          price: 5,
          imageUrl: null,
        },
      ],
    },
  ];

  for (const cat of categories) {
    await prisma.menuCategory.create({
      data: {
        name: cat.name,
        sortOrder: cat.sortOrder,
        items: {
          create: cat.items,
        },
      },
    });
  }

  // one demo reservation
  await prisma.reservation.create({
    data: {
      name: "Demo Guest",
      email: "demo@example.com",
      phone: "555-0100",
      partySize: 2,
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      notes: "Window seat please.",
      status: "confirmed",
    },
  });

  console.log("Seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
