import { prisma } from "database";

async function globalSetup() {
  const user = await prisma.user.findFirst({ where: { email: "e2e@e2e.com" } });
  if (!user) return;

  await prisma.model.deleteMany({ where: { authorId: user.id } });
  await prisma.session.deleteMany({ where: { userId: user.id } });
  await prisma.account.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
}

export default globalSetup;
