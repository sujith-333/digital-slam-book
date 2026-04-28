"use client";

import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-6">

      {/* Centered Content */}
      <div className="text-center max-w-4xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-6 leading-tight"
        >
          Your friends say the{" "}
          <span className="text-purple-600">
            <TypeAnimation
              sequence={[
                "funniest", 2000,
                "sweetest", 2000,
                "wildest", 2000,
                "realest", 2000,
              ]}
              repeat={Infinity}
              speed={50}
            />
          </span>{" "}
          things
        </motion.h1>

        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Create your personal slam book, share with friends, and collect memories — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {session ? (
            <>
              <Link href="/create">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                  Create My Slam Book
                </button>
              </Link>

              <Link href="/dashboard">
                <button className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition">
                  Dashboard
                </button>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google")}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Continue with Google
              </button>

              <button
                onClick={() => signIn("google")}
                className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition"
              >
                See How It Works
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm"
      >
        Start collecting memories with your friends
      </motion.div>
    </section>
  );
}