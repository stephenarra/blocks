import { chromium } from "@playwright/test";
import { prisma } from "database";
import path from "node:path";

/*
 * Create a session token to test authenticated user workflows
 */

async function globalSetup() {
  const storagePath = path.resolve(__dirname, ".auth/user.json");

  const date = new Date();
  const futureDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  const sessionToken = "04456e41-ec3b-4edf-92c1-48c14e57cacd2";

  // make sure a test user exists in our local database
  await prisma.user.upsert({
    where: {
      email: "e2e@e2e.com",
    },
    create: {
      name: "e2e",
      email: "e2e@e2e.com",
      sessions: { create: { expires: futureDate, sessionToken } },
      accounts: {
        create: {
          type: "oauth",
          provider: "google",
          providerAccountId: "2222222",
          access_token: "ggg_zZl1pWIvKkf3UDynZ09zLvuyZsm1yC0YoRPt",
          token_type: "Bearer",
          scope:
            "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    },
    update: {},
  });

  // set up the authentication cookie into our test browser state
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: futureDate.getTime() / 1000,
    },
  ]);

  await context.storageState({ path: storagePath });
  await browser.close();
}

export default globalSetup;
