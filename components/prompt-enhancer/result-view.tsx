"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, Sparkles } from "lucide-react";
import { INICIA_TAG_COLORS, INICIA_SECTION_SUBTITLES } from "@/lib/prompts";

interface ResultViewProps {
  result: string;
  onEdit: (text: string) => void;
  onReset: () => void;
}

function parseResult(text: string) {
  const tags = Object.keys(INICIA_TAG_COLORS);
  const sections: { tag: string; content: string; color: string }[] = [];

  let remaining = text;
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const tagIndex = remaining.indexOf(tag);
    if (tagIndex === -1) continue;

    const afterTag = remaining.substring(tagIndex + tag.length);
    const nextTagIndex = tags
      .slice(i + 1)
      .reduce((minIdx: number, nextTag: string) => {
        const idx = afterTag.indexOf(nextTag);
        return idx !== -1 && idx < minIdx ? idx : minIdx;
      }, afterTag.length);

    const content = afterTag.substring(0, nextTagIndex).trim();
    sections.push({
      tag: tag.replace("[", "").replace("]", ""),
      content,
      color: INICIA_TAG_COLORS[tag],
    });

    remaining = afterTag.substring(nextTagIndex);
  }

  return sections;
}

export function ResultView({ result, onEdit, onReset }: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  const sections = useMemo(() => parseResult(result), [result]);

  // Build clean copy text — all section content joined, NO labels or icons
  const fullPromptText = useMemo(() => {
    return sections.map((s) => s.content).join("\n\n");
  }, [sections]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullPromptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = fullPromptText;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silent fail
      }
      document.body.removeChild(textarea);
    }
  };

  if (sections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="rounded-xl border border-white/[0.06] bg-dark-deep/80 p-5">
          <p className="text-sm leading-relaxed text-[#CBD5E1]">{result}</p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#94A3B8] transition-colors hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Nuevo prompt
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Success header */}
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
          <Sparkles className="h-3.5 w-3.5 text-green-400" />
        </div>
        <span className="text-sm font-medium text-green-400">
          Prompt mejorado con INICIA
        </span>
      </div>

      {/* INICIA Sections — all displayed prominently */}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <motion.div
            key={section.tag}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-dark-deep/60 p-5"
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 h-full w-[3px]"
              style={{ backgroundColor: `${section.color}60` }}
            />

            {/* Section header */}
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold"
                style={{
                  backgroundColor: `${section.color}20`,
                  color: section.color,
                }}
              >
                {section.tag[0]}
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: section.color }}
              >
                {section.tag}
                {INICIA_SECTION_SUBTITLES[section.tag] && (
                  <span className="text-[#64748B]">
                    {" "}
                    · {INICIA_SECTION_SUBTITLES[section.tag]}
                  </span>
                )}
              </span>
            </div>

            {/* Content */}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#CBD5E1]">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3"
      >
        {/* Copy prompt — primary */}
        <button
          onClick={copyToClipboard}
          className="group relative flex-1 inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] transition-all group-hover:from-[#2563EB] group-hover:to-[#3B82F6]" />
          {copied ? (
            <>
              <Check className="relative h-4 w-4" />
              <span className="relative">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="relative h-4 w-4" />
              <span className="relative">Copiar prompt</span>
            </>
          )}
        </button>

        {/* Editar */}
        <button
          onClick={() => onEdit(fullPromptText)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-3.5 text-sm font-semibold text-[#94A3B8] transition-all hover:border-white/[0.15] hover:text-white"
        >
          Editar
        </button>

        {/* Nuevo */}
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-3.5 text-sm font-semibold text-[#94A3B8] transition-all hover:border-white/[0.15] hover:text-white"
        >
          Nuevo
        </button>
      </motion.div>
    </motion.div>
  );
}
