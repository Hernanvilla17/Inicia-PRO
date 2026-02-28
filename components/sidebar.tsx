"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { Lock, ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 px-2">
      <span className="font-heading text-xl font-extrabold tracking-tight text-white">
        Inic
      </span>
      <span className="font-heading text-xl font-extrabold tracking-tight text-brand-blue">
        IA
      </span>
      <span className="ml-1.5 rounded-md bg-brand-blue/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue">
        Pro
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.comingSoon ? item.href : item.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-[10px] px-3 py-3.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-brand-blue/10 text-brand-blue"
                : "text-[#94A3B8] hover:bg-white/[0.03] hover:text-white"
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.comingSoon && (
              <Lock className="h-3.5 w-3.5 shrink-0 text-[#475569]" />
            )}
            {isActive && (
              <motion.div
                layoutId="activeNav"
                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-blue"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-2">
        <NavLinks />
        <div className="border-t border-sidebar-border pt-4 mt-4">
          <a
            href="https://iniciaconia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-xs font-medium text-[#64748B] transition-colors hover:bg-white/[0.03] hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            iniciaconia.com
          </a>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-sidebar-border bg-dark-deep/95 px-4 backdrop-blur-sm lg:hidden">
        <Logo />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-sidebar-border bg-sidebar lg:hidden"
            >
              <div className="flex h-14 items-center justify-between px-5">
                <Logo />
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-[#94A3B8] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-3 py-2">
                <NavLinks onNavigate={() => setIsOpen(false)} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border px-3 py-4">
                <a
                  href="https://iniciaconia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-xs font-medium text-[#64748B] transition-colors hover:bg-white/[0.03] hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  iniciaconia.com
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
