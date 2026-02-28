"use client";

import { motion } from "framer-motion";
import { Lock, Bell } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useState } from "react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  previewItems: string[];
}

export function ComingSoon({
  title,
  description,
  icon: Icon,
  previewItems,
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6 py-10 lg:min-h-screen lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-blue/10"
        >
          <Icon className="h-10 w-10 text-brand-blue" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-amber/20 bg-brand-amber/5 px-3 py-1.5"
        >
          <Lock className="h-3.5 w-3.5 text-brand-amber" />
          <span className="text-xs font-semibold text-brand-amber">
            Próximamente
          </span>
        </motion.div>

        {/* Title & Description */}
        <h1 className="mb-3 font-heading text-2xl font-extrabold text-white lg:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-[#94A3B8] lg:text-base">
          {description}
        </p>

        {/* Preview Cards */}
        <div className="relative mb-8">
          <div className="space-y-2.5">
            {previewItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-xl border border-white/[0.04] bg-dark-card px-4 py-3 text-left text-sm text-[#94A3B8]"
              >
                {item}
              </motion.div>
            ))}
          </div>
          {/* Blur overlay */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-dark via-dark/80 to-transparent" />
        </div>

        {/* Email Capture */}
        {!submitted ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-sm gap-2"
          >
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-[10px] border border-white/[0.06] bg-dark-card px-4 py-2.5 text-sm text-white placeholder-[#475569] outline-none transition-colors focus:border-brand-blue/40"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light"
            >
              <Bell className="h-3.5 w-3.5" />
              Notifícame
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400"
          >
            Te notificaremos cuando esté listo
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
