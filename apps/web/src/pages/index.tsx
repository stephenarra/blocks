import Layout from "@/components/home/Layout";
import { type NextPage } from "next";
import Link from "next/link";
import { Button } from "@/lib/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { ExploreModels } from "./explore";

const variants = {
  top: {
    initial: { opacity: 0, y: -70 },
    animate: { duration: 1, opacity: 1, y: 0 },
  },
  bottom: {
    initial: { opacity: 0, y: 70 },
    animate: { duration: 1, opacity: 1, y: 0 },
  },
  left: {
    initial: { opacity: 0, x: -70 },
    animate: { duration: 1, opacity: 1, x: 0 },
  },
  right: {
    initial: { opacity: 0, x: 100 },
    animate: { duration: 1, opacity: 1, x: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { duration: 1, opacity: 1 },
  },
};

const Home: NextPage = () => {
  const { data: user } = useSession();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 md:py-16 lg:py-20 lg:px-14 xl:py-24">
        <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          <motion.div
            variants={variants.right}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/image1.png"
              height={250}
              width={250}
              alt="Hero image"
              priority
            />
          </motion.div>
          <motion.div
            variants={variants.left}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl"
          >
            Start creating today
          </motion.div>
          <motion.div
            variants={variants.right}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8"
          >
            Build, share, and collaborate on simple voxel models and scenes.
          </motion.div>
          <motion.div
            variants={variants.bottom}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
          >
            {user ? (
              <Link href="/dashboard">
                <Button variant="default">Get Started</Button>
              </Link>
            ) : (
              <Button variant="default" onClick={() => signIn("google")}>
                Get Started
              </Button>
            )}
          </motion.div>
        </div>
      </div>
      <hr className="border-slate-200" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 md:py-16 lg:py-20 lg:px-14 xl:py-24">
        <div className="flex flex-col items-center gap-4 pb-8 text-center lg:items-start lg:text-left ">
          <motion.div className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-4xl md:text-4xl">
            Explore
          </motion.div>
        </div>
        <ExploreModels />
      </div>
    </Layout>
  );
};

export default Home;
