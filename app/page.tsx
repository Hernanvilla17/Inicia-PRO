"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { Lock, ArrowRight, Sparkles } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-amber" />
          <span className="text-sm font-medium text-brand-amber">
            Plataforma Premium
          </span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
          Bienvenido a{" "}
          <span className="text-brand-blue">InicIA Pro</span>
        </h1>
        <p className="mt-3 max-w-xl text-base text-[#94A3B8] lg:text-lg">
          Tu centro de herramientas de IA. Mejora tus prompts, accede a
          recursos profesionales y domina la inteligencia artificial.
        </p>
      </motion.div>

      {/* Feature Cards Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {NAV_ITEMS.map((navItem) => {
          const Icon = navItem.icon;
          const isActive = !navItem.comingSoon;

          return (
            <motion.div key={navItem.href} variants={cardVariant}>
              <Link
                href={navItem.href}
                className={`group relative block rounded-[14px] border p-6 transition-all duration-300 ${
                  isActive
                    ? "border-brand-blue/20 bg-dark-card hover:border-brand-blue/40 hover:bg-dark-card-hover hover:shadow-[0_0_30px_rgba(59,130,246,0.06)]"
                    : "border-white/[0.04] bg-dark-card hover:border-white/[0.08] hover:bg-dark-card-hover"
                }`}
              >
                {isActive && (
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-1 text-[11px] font-semibold text-brand-blue">
                      Disponible
                    </span>
                  </div>
                )}

                {navItem.comingSoon && (
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#64748B]">
                      <Lock className="h-3 w-3" />
                      Próximamente
                    </span>
                  </div>
                )}

                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
                    isActive
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "bg-white/[0.04] text-[#64748B]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3
                  className={`mb-1.5 font-heading text-base font-bold ${
                    isActive ? "text-white" : "text-[#CBD5E1]"
                  }`}
                >
                  {navItem.label}
                </h3>
                <p className="text-sm leading-relaxed text-[#64748B]">
                  {navItem.description}
                </p>

                {isActive && (
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-blue opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Abrir herramienta
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
