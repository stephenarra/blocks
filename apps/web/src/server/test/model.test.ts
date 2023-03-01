import { expect, it, describe } from "vitest";
import { type inferProcedureInput } from "@trpc/server";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { appRouter, type AppRouter } from "@/server/api/root";
import { type RouterInputs } from "@/utils/api";
import { mockDeep } from "vitest-mock-extended";
import { Session } from "next-auth";
import { PrismaClient } from "database";

describe("router", () => {
  it("unauthed user should not be able to create a model", async () => {
    const ctx = createInnerTRPCContext({ session: null });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.model.create()).rejects.toThrowError();
  });

  it("authed user can create a model", async () => {
    const prisma = mockDeep<PrismaClient>();
    const session: Session = {
      expires: new Date().toISOString(),
      user: { id: "test-user-id", name: "Test User" },
    };
    const ctx = createInnerTRPCContext({ session, prisma });
    const caller = appRouter.createCaller(ctx);

    const mockModel = {
      name: "Untitled",
      authorId: "test-user-id",
    };

    await prisma.model.create.mockResolvedValue(mockModel);

    // const input: RouterInputs["model"]["create"] = {};
    const model = await caller.model.create();

    expect(prisma.model.create).toHaveBeenCalled();
    expect(prisma.model.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining(mockModel),
      })
    );

    expect(model).toEqual(mockModel);
  });

  it("only owner can delete a model", async () => {
    const prisma = mockDeep<PrismaClient>();
    const caller1 = appRouter.createCaller(
      createInnerTRPCContext({
        session: {
          expires: new Date().toISOString(),
          user: { id: "user1", name: "User1" },
        },
        prisma,
      })
    );
    const caller2 = appRouter.createCaller(
      createInnerTRPCContext({
        session: {
          expires: new Date().toISOString(),
          user: { id: "user2", name: "User2" },
        },
        prisma,
      })
    );

    const mockModel = { name: "", authorId: "user2" };
    await prisma.model.findUnique.mockResolvedValue(mockModel);
    await prisma.model.delete.mockResolvedValue(mockModel);

    const input: RouterInputs["model"]["delete"] = { id: "model1" };

    await expect(caller1.model.delete(input)).rejects.toThrowError();
    const deleted = await caller2.model.delete(input);
    expect(deleted).toEqual(mockModel);
  });
});
