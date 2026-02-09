import bcrypt from "bcrypt";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({ adapter });

  const email = "demo@exemplo.com";
  const plainPassword = "123456";
  const saltRounds = 10;

  console.log("Gerando hash...");
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

  console.log("Verificando se o usuário já existe...");
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Usuário já existe, atualizando senha...");
    const user = await prisma.user.update({
      where: { email },
      data: {
        password: passwordHash,
      },
    });
    console.log("Usuário atualizado:", user);
  } else {
    console.log("Criando novo usuário...");
    const user = await prisma.user.create({
      data: {
        email,
        name: "Demo User",
        password: passwordHash,
      },
    });
    console.log("Usuário criado:", user);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
