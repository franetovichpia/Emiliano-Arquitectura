import readline from "node:readline/promises";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "emiliano-arquitectura";

if (!uri) {
  throw new Error("Falta la variable de entorno MONGODB_URI.");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createAdminUser() {
  const email = (
    await rl.question("Email del admin: ")
  )
    .trim()
    .toLowerCase();

  const password = await rl.question(
    "Contraseña (mínimo 8 caracteres): ",
  );

  const fullName = await rl.question(
    "Nombre completo: ",
  );

  rl.close();

  if (password.length < 8) {
    throw new Error(
      "La contraseña debe tener al menos 8 caracteres.",
    );
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const passwordHash = await bcrypt.hash(
    password,
    12,
  );

  await db.collection("adminUsers").updateOne(
    { email },
    {
      $set: { email, passwordHash, fullName, role: "admin" },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  console.log(
    `Usuario admin "${email}" creado/actualizado correctamente.`,
  );

  await client.close();
}

createAdminUser().catch((error) => {
  console.error("No se pudo crear el usuario admin.");
  console.error(error);
  process.exitCode = 1;
});