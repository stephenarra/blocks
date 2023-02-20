import Layout from "@/components/home/Layout";
import { type NextPage } from "next";
import Link from "next/link";
import { Button } from "@/lib/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

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
            <Link href="/login">
              <Button variant="default">Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </div>
      <hr className="border-slate-200" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 md:py-16 lg:py-20 lg:px-14 xl:py-24">
        <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          <motion.div className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
            Explore
          </motion.div>
          <p className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8">
            Coming soon.
          </p>
        </div>
      </div>

      {/* <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-3xl md:text-5xl"> */}
      {/* <span className="block xl:inline">Discover reactions</span> */}
      {/* </h1> */}
      {/* <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
            Easily find and follow your favorite YouTube reactions.
          </p> */}
      {/* <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
        <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
          <Image
            src="/image1.png"
            height={250}
            width={250}
            alt="Hero image"
            priority
          />
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
            Start creating today
          </h1>
          <p className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8">
            Build, share, and collaborate on simple voxel models and scenes.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="default">Get Started</Button>
          </Link>
        </div>
      </section> */}
      {/* <hr className="border-slate-200" />
      <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
        <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
            Explore
          </h2>
          <p className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8">
            Coming soon.
          </p>
        </div>
      </section> */}
    </Layout>
  );
};

export default Home;
