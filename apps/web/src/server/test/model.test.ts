import { expect, it, describe } from "vitest";
import { type inferProcedureInput } from "@trpc/server";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { appRouter, type AppRouter } from "@/server/api/root";
// import { type RouterInputs } from "@/utils/api";
import { mockDeep } from "vitest-mock-extended";
import { Session } from "next-auth";
import { PrismaClient } from "database";

describe("router", () => {
  it("unauthed user should not be possible to create a post", async () => {
    const ctx = createInnerTRPCContext({ session: null });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.model.create()).rejects.toThrowError();
  });

  it("example", async () => {
    const prismaMock = mockDeep<PrismaClient>();
    const mockSession: Session = {
      expires: new Date().toISOString(),
      user: { id: "test-user-id", name: "Test User" },
    };
    const ctx = createInnerTRPCContext({ session: null, prisma: prismaMock });
    const caller = appRouter.createCaller(ctx);

    // const input: RouterInputs["model"]["create"] = {};
    const input: inferProcedureInput<AppRouter["example"]["hello"]> = {
      text: "test",
    };

    const example = await caller.example.hello(input);

    expect(example).toEqual({ greeting: "Hello test" });
  });
});
