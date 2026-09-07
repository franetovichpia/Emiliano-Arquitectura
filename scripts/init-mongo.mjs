import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "emiliano-arquitectura";

if (!uri) {
  throw new Error("Falta la variable de entorno MONGODB_URI.");
}

const defaultCategories = [
  { slug: "portfolio-general", name: "Portfolio General", sortOrder: 1 },
  { slug: "astrocasas", name: "Astrocasas", sortOrder: 2 },
  { slug: "nuevos-proyectos", name: "Nuevos Proyectos", sortOrder: 3 },
];

async function initMongo() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  console.log(`Conectado a "${dbName}". Creando índices...`);

  await db.collection("projects").createIndexes([
    { key: { slug: 1 }, unique: true, name: "uq_slug" },
    { key: { status: 1 }, name: "idx_status" },
    { key: { categorySlug: 1 }, name: "idx_category" },
    { key: { zodiacSign: 1 }, name: "idx_zodiac" },
    { key: { sortOrder: 1 }, name: "idx_sort_order" },
  ]);

  await db
    .collection("projectCategories")
    .createIndex(
      { slug: 1 },
      { unique: true, name: "uq_category_slug" },
    );

  await db.collection("bimAnalysisData").createIndexes([
    { key: { projectId: 1 }, name: "idx_analysis_project" },
    { key: { category: 1 }, name: "idx_analysis_category" },
    { key: { material: 1 }, name: "idx_analysis_material" },
  ]);

  await db
    .collection("bimConstructionProgress")
    .createIndex(
      { projectId: 1 },
      { name: "idx_progress_project" },
    );

  await db
    .collection("adminUsers")
    .createIndex(
      { email: 1 },
      { unique: true, name: "uq_admin_email" },
    );

  console.log("Índices creados. Sembrando categorías por defecto...");

  for (const category of defaultCategories) {
    await db.collection("projectCategories").updateOne(
      { slug: category.slug },
      { $setOnInsert: category },
      { upsert: true },
    );

    console.log(`  ✓ ${category.name}`);
  }

  console.log("");
  console.log("Base de datos inicializada correctamente.");

  await client.close();
}

initMongo().catch((error) => {
  console.error("No se pudo inicializar la base de datos.");
  console.error(error);
  process.exitCode = 1;
});