"use client";

import { motion } from "framer-motion";

const STEPS = [
  { letter: "I", name: "Identifica", label: "Objetivo", color: "#3B82F6", type: "Esencial" },
  { letter: "N", name: "Nutre", label: "Contexto", color: "#3B82F6", type: "Esencial" },
  { letter: "I", name: "Indica", label: "Formato", color: "#3B82F6", type: "Esencial" },
  { letter: "C", name: "Controla", label: "Restricciones", color: "#3B82F6", type: "Esencial" },
  { letter: "I", name: "Ilustra", label: "Ejemplos", color: "#FBBF24", type: "Potenciador" },
  { letter: "A", name: "Ajusta", label: "Iteración", color: "#FBBF24", type: "Potenciador" },
];

// Timing
const CYCLE = 4.8;
const STEP_GAP = 0.5;
const FILL_SPEED = 0.08;
const HOLD_END = 3.8;

function getTimes(i: number) {
  const start = (i * STEP_GAP) / CYCLE;
  const filled = (i * STEP_GAP + FILL_SPEED) / CYCLE;
  const holdEnd = HOLD_END / CYCLE;

  if (i === 0) return [0, Math.max(filled, 0.01), holdEnd, 1];
  return [0, Math.max(start, 0.01), filled, holdEnd, 1];
}

interface IniciaStepsVisualProps {
  isLoading?: boolean;
}

export function IniciaStepsVisual({ isLoading = false }: IniciaStepsVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-1"
    >
      {/* Steps row */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {STEPS.map((step, i) => {
          const times = getTimes(i);
          const isFirst = i === 0;

          // Fill: 0 = empty, 1 = full
          const fillKeys = isFirst ? [0, 1, 1, 0] : [0, 0, 1, 1, 0];

          // Letter color: step.color when empty, white when filled
          const letterColorKeys = isFirst
            ? [step.color, "#FFFFFF", "#FFFFFF", step.color]
            : [step.color, step.color, "#FFFFFF", "#FFFFFF", step.color];

          // Name opacity
          const nameOpacityKeys = isFirst
            ? [0.4, 1, 1, 0.4]
            : [0.4, 0.4, 1, 1, 0.4];

          // Subtle scale pop when filling
          const scaleKeys = isFirst
            ? [1, 1.06, 1.02, 1]
            : [1, 1, 1.06, 1.02, 1];

          const baseTransition = {
            duration: CYCLE,
            repeat: Infinity,
            times,
            ease: "easeOut" as const,
          };

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.35, type: "spring", stiffness: 300 }}
              whileHover={!isLoading ? { scale: 1.08, y: -2 } : undefined}
              className="group flex cursor-default flex-col items-center gap-2"
            >
              {/* Letter badge */}
              <motion.div
                className="relative overflow-hidden rounded-xl"
                animate={isLoading ? { scale: scaleKeys } : {}}
                transition={isLoading ? baseTransition : {}}
              >
                {/* Empty state background (always visible) */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-extrabold sm:h-12 sm:w-12 sm:text-lg"
                  style={{
                    backgroundColor: `${step.color}15`,
                    border: `1px solid ${step.color}20`,
                    boxShadow: `0 0 20px ${step.color}12, inset 0 1px 0 ${step.color}15`,
                  }}
                >
                  {/* Color fill overlay - fills from bottom to top */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: step.color,
                      transformOrigin: "bottom",
                      borderRadius: "0.75rem",
                    }}
                    animate={
                      isLoading
                        ? { scaleY: fillKeys }
                        : { scaleY: 0 }
                    }
                    transition={
                      isLoading
                        ? baseTransition
                        : { duration: 0.3 }
                    }
                  />

                  {/* Letter */}
                  <motion.span
                    className="relative z-10 font-extrabold"
                    animate={
                      isLoading
                        ? { color: letterColorKeys }
                        : { color: step.color }
                    }
                    transition={
                      isLoading
                        ? baseTransition
                        : { duration: 0.3 }
                    }
                  >
                    {step.letter}
                  </motion.span>
                </div>
              </motion.div>

              {/* Name */}
              <motion.span
                className="text-center text-[10px] font-bold leading-tight sm:text-[11px]"
                style={{ color: step.color }}
                animate={
                  isLoading
                    ? { opacity: nameOpacityKeys }
                    : { opacity: 1 }
                }
                transition={isLoading ? baseTransition : { duration: 0.3 }}
              >
                {step.name}
              </motion.span>

              {/* Category */}
              <motion.span
                className="text-center text-[8px] font-medium uppercase tracking-wider sm:text-[9px]"
                style={{ color: "#475569" }}
                animate={
                  isLoading
                    ? {
                        opacity: isFirst
                          ? [0.3, 0.7, 0.7, 0.3]
                          : [0.3, 0.3, 0.7, 0.7, 0.3],
                      }
                    : { opacity: 1 }
                }
                transition={isLoading ? baseTransition : { duration: 0.3 }}
              >
                {step.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Divider with legend */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_6px_#3B82F680]" />
            <span className="text-[9px] font-medium text-[#64748B]">Esencial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_#FBBF2480]" />
            <span className="text-[9px] font-medium text-[#64748B]">Potenciador</span>
          </div>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
    </motion.div>
  );
}
