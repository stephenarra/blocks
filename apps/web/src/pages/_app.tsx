import Head from "next/head";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import localFont from "@next/font/local";
import { Inter } from "@next/font/google";
import cx from "classnames";

import { api } from "../utils/api";
import "../styles/globals.css";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { NextPage } from "next";

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = (props) => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  }: { Component: NextApplicationPage; pageProps: any } = props;

  return (
    <>
      <Head>
        <title>Voxel Builder</title>
        <meta name="description" content="Collaborative voxel builder" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <main className={cx(sfPro.variable, inter.variable, "h-full w-full")}>
          {/* if requireAuth property is present - protect the page */}
          {Component.requireAuth ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            // public page
            <Component {...pageProps} />
          )}
        </main>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
