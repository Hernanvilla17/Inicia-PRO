"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, BookOpen } from "lucide-react";
import { SimpleMode } from "./simple-mode";
import { GuidedMode } from "./guided-mode";
import { ResultView } from "./result-view";

type Mode = "simple" | "guided";

const STEPS = [
  { l: "I", name: "Identifica", color: "#3B82F6" },
  { l: "N", name: "Nutre", color: "#3B82F6" },
  { l: "I", name: "Indica", color: "#3B82F6" },
  { l: "C", name: "Controla", color: "#3B82F6" },
  { l: "I", name: "Ilustra", color: "#FBBF24" },
  { l: "A", name: "Ajusta", color: "#FBBF24" },
];

export function PromptEnhancer() {
  const [mode, setMode] = useState<Mode>("simple");
  const [result, setResult] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top when result appears
  useEffect(() => {
    if (result && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0 });
    }
  }, [result]);

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col lg:h-screen">
      {/* Compact Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 border-b border-white/[0.04] bg-dark-deep/50 px-6 py-4 lg:px-10"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          {/* Left: Title + INICIA pills */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-brand-blue/25 blur-md" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-brand-blue/30 bg-brand-blue/15">
                <Zap className="h-4.5 w-4.5 text-brand-blue" />
              </div>
            </div>
            <div>
              <h1 className="font-heading text-lg font-extrabold text-white">
                Prompt Enhancer
              </h1>
              <div className="flex items-center gap-1">
                {STEPS.map((step, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-extrabold"
                    style={{ color: step.color }}
                  >
                    {step.l}
                    {i < STEPS.length - 1 && (
                      <span className="text-[#1E293B]"> · </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Mode Switcher */}
          {!result && (
            <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
              <button
                onClick={() => setMode("simple")}
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  mode === "simple" ? "text-white" : "text-[#64748B] hover:text-[#94A3B8]"
                }`}
              >
                {mode === "simple" && (
                  <motion.div
                    layoutId="modeTab"
                    className="absolute inset-0 rounded-lg bg-brand-blue/15 ring-1 ring-brand-blue/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Zap className="relative h-3.5 w-3.5" />
                <span className="relative">Rápido</span>
              </button>
              <button
                onClick={() => setMode("guided")}
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  mode === "guided" ? "text-white" : "text-[#64748B] hover:text-[#94A3B8]"
                }`}
              >
                {mode === "guided" && (
                  <motion.div
                    layoutId="modeTab"
                    className="absolute inset-0 rounded-lg bg-brand-blue/15 ring-1 ring-brand-blue/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <BookOpen className="relative h-3.5 w-3.5" />
                <span className="relative">Guiado</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content - Fills remaining space */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        <div className={`mx-auto w-full max-w-4xl px-6 lg:px-10 ${
          result ? "py-6" : "flex min-h-full flex-col justify-center py-6"
        }`}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative w-full rounded-2xl border border-white/[0.06] bg-dark-card"
          >
            {/* Top gradient line */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />

            <div className="p-5 sm:p-7">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ResultView
                      result={result}
                      originalPrompt={originalPrompt}
                      onEdit={(text) => {
                        setEditingPrompt(text);
                        setResult(null);
                        setOriginalPrompt(null);
                        setMode("simple");
                      }}
                      onReset={() => {
                        setEditingPrompt(null);
                        setResult(null);
                        setOriginalPrompt(null);
                      }}
                    />
                  </motion.div>
                ) : mode === "simple" ? (
                  <motion.div
                    key="simple"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SimpleMode
                      onResult={(text, original) => {
                        setOriginalPrompt(original || null);
                        setResult(text);
                      }}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      initialPrompt={editingPrompt}
                      onConsumeInitialPrompt={() => setEditingPrompt(null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="guided"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <GuidedMode
                      onResult={(text, original) => {
                        setOriginalPrompt(original || null);
                        setResult(text);
                      }}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
