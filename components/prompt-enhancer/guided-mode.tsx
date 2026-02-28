"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Sparkles, Check, Zap } from "lucide-react";
import { IniciaStepsVisual } from "./inicia-steps-visual";
import {
  FileAttachment,
  buildAttachmentPayload,
  type AttachedFile,
} from "./file-attachment";

interface GuidedModeProps {
  onResult: (result: string, originalPrompt?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const STEPS = [
  {
    letter: "I",
    name: "Identifica",
    color: "#3B82F6",
    category: "Esencial",
    question: "¿Qué quieres lograr?",
    placeholder: "Ej: Escribir un email de ventas para mi SaaS que convenza a CTOs",
    hint: "Sé específico con tu objetivo",
    required: true,
  },
  {
    letter: "N",
    name: "Nutre",
    color: "#3B82F6",
    category: "Esencial",
    question: "¿Cuál es el contexto?",
    placeholder: "Ej: Soy gerente de ventas en una agencia. El cliente no respondió en 2 semanas. Queremos mantener buena relación.",
    hint: "Quién eres, para quién es, cuál es la situación",
    required: true,
  },
  {
    letter: "I",
    name: "Indica",
    color: "#3B82F6",
    category: "Esencial",
    question: "¿Cómo quieres recibir el resultado?",
    placeholder: "Ej: Tabla con columnas: Idea | Tipo post | Caption (2 líneas) | Hashtags. Tono casual, máximo 200 palabras.",
    hint: "Tipo de formato, extensión, tono",
    required: true,
  },
  {
    letter: "C",
    name: "Controla",
    color: "#3B82F6",
    category: "Esencial",
    question: "¿Qué límites debe respetar?",
    placeholder: "Ej: No uses jerga técnica, no inventes datos, solo datos financieros, español neutro LATAM.",
    hint: "Qué evitar, en qué enfocarse, reglas",
    required: true,
  },
  {
    letter: "I",
    name: "Ilustra",
    color: "#FBBF24",
    category: "Potenciador",
    question: "¿Tienes un ejemplo de buen resultado?",
    placeholder: "Ej: Tono que me gusta: 'Tu café, caliente 8h. Acero, compacta, anti-derrames.' Escribe 5 más así.",
    hint: "Un ejemplo vale más que mil instrucciones",
    required: false,
  },
  {
    letter: "A",
    name: "Ajusta",
    color: "#FBBF24",
    category: "Potenciador",
    question: "¿Qué ajustarías del resultado?",
    placeholder: "Ej: Más profesional. Dato estadístico en intro. Cierre con llamado a acción. Mitad de extensión.",
    hint: "Correcciones específicas, cambios de tono o extensión",
    required: false,
  },
];

export function GuidedMode({ onResult, isLoading, setIsLoading }: GuidedModeProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const handleFilesChange = useCallback((files: AttachedFile[]) => {
    setAttachedFiles(files);
  }, []);

  const update = (i: number, v: string) => {
    const a = [...answers];
    a[i] = v;
    setAnswers(a);
  };

  const step = STEPS[current];
  const canProceed = step.required ? answers[current].trim().length > 0 : true;
  const isLast = current === STEPS.length - 1;

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const parts = [
        `OBJETIVO: ${answers[0]}`,
        `CONTEXTO: ${answers[1]}`,
        `FORMATO: ${answers[2]}`,
        `RESTRICCIONES: ${answers[3]}`,
      ];
      if (answers[4].trim()) parts.push(`EJEMPLOS: ${answers[4]}`);
      if (answers[5].trim()) parts.push(`AJUSTES: ${answers[5]}`);

      const { images, documents, textContents } =
        buildAttachmentPayload(attachedFiles);

      let fullMessage = `Crea un prompt profesional optimizado con la metodología INICIA:\n\n${parts.join("\n")}`;
      if (textContents) {
        fullMessage += `\n\nArchivos de texto adjuntos:\n${textContents}`;
      }

      const hasVisualAttachments = images.length > 0 || documents.length > 0;

      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: `Eres un experto en ingeniería de prompts. Tu trabajo es crear un prompt profesional mejorado usando la metodología INICIA.

Estructura tu respuesta usando estas etiquetas exactas. Cada sección debe contener el CONTENIDO REAL del prompt mejorado para esa dimensión, NO un análisis ni explicación de lo que hiciste:

[IDENTIFICA] - Define el rol de la IA y el objetivo claro del prompt
[NUTRE] - Proporciona el contexto relevante, antecedentes e información de fondo
[INDICA] - Especifica el formato, estructura, tono y extensión deseada del resultado
[CONTROLA] - Establece restricciones, límites, reglas y lo que debe evitarse
[AJUSTA] - Define criterios de refinamiento, personalización y guía para iteraciones

REGLAS DE FORMATO:
- Escribe en texto fluido, sin markdown, sin headers con #, sin listas con -, sin **negritas**
- Cada sección contiene CONTENIDO DIRECTO del prompt, como si hablaras directamente con la IA
- Las secciones juntas forman el prompt completo mejorado
- No todas las secciones son obligatorias. Solo incluye las que aporten valor real. Mínimo incluye [IDENTIFICA], [INDICA] y [CONTROLA]
- Escribe en español
- Sé conciso pero completo

ARCHIVOS ADJUNTOS:
- Si el usuario adjunta imágenes, ANALÍZALAS en detalle: identifica qué muestran, textos visibles, colores, estructura, estilo visual, datos, gráficos, etc.
- Usa lo que ves en las imágenes como CONTEXTO REAL para enriquecer el prompt mejorado
- Si adjunta documentos PDF o archivos de texto, lee su contenido y úsalo como contexto
- El prompt mejorado debe INCORPORAR la información de los archivos adjuntos de forma natural, referenciando lo que contienen para que el prompt resultante sea más específico y efectivo

Te han dado información estructurada sobre lo que el usuario quiere lograr. Crea un prompt profesional optimizado usando las secciones INICIA.`,
          message: fullMessage,
          images: hasVisualAttachments ? images : undefined,
          documents: hasVisualAttachments ? documents : undefined,
          mode: "Prompt Enhancer Guiado",
        }),
      });
      const data = await response.json();
      if (data.content?.[0]) {
        onResult(data.content[0].text, answers[0]);
        // Fire-and-forget webhook tracking
        try {
          fetch("https://n8n-n8n.rh89ob.easypanel.host/webhook/430941d5-790b-4526-96a0-4977cd325449", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "Prompt Enhancer Guiado",
              input_tokens: data.usage?.input_tokens || 0,
              output_tokens: data.usage?.output_tokens || 0,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch {}
      } else if (data.error) onResult(`Error: ${data.error}`);
    } catch {
      onResult("Error al conectar con la API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* INICIA Visual */}
      <IniciaStepsVisual isLoading={isLoading} />

      {/* Step indicators - horizontal bar */}
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => {
          const active = i === current;
          const done = s.required
            ? answers[i].trim().length > 0
            : answers[i].trim().length > 0;
          const isPotenciador = s.category === "Potenciador";
          return (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group flex flex-1 flex-col gap-2"
            >
              {/* Color bar */}
              <div
                className="h-1.5 w-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: active
                    ? s.color
                    : done
                      ? `${s.color}50`
                      : "rgba(255,255,255,0.04)",
                  boxShadow: active ? `0 0 12px ${s.color}40` : "none",
                }}
              />
              {/* Label */}
              <div className="flex items-center justify-center gap-1">
                {done && !active ? (
                  <Check className="h-3 w-3" style={{ color: s.color }} />
                ) : (
                  <span
                    className="text-[11px] font-extrabold transition-all"
                    style={{ color: active ? s.color : done ? s.color : "#334155" }}
                  >
                    {s.letter}
                  </span>
                )}
                <span
                  className={`hidden text-[11px] font-semibold transition-all sm:inline ${
                    active ? "text-white" : "text-[#475569]"
                  }`}
                >
                  {s.name}
                </span>
                {isPotenciador && (
                  <Zap
                    className="hidden h-2.5 w-2.5 sm:inline"
                    style={{ color: active ? s.color : "#475569" }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Question + Textarea */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold"
              style={{ backgroundColor: `${step.color}25`, color: step.color }}
            >
              {step.letter}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-white">
                  {step.question}
                </h3>
                {!step.required && (
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    Opcional
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B]">{step.hint}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl ring-1 ring-white/[0.06] transition-all focus-within:ring-2"
            style={{ boxShadow: `0 0 0 0px transparent` }}
          >
            <textarea
              value={answers[current]}
              onChange={(e) => update(current, e.target.value)}
              placeholder={step.placeholder}
              className="h-[140px] w-full resize-none bg-dark-deep/60 px-5 py-4 text-sm leading-relaxed text-white placeholder-[#475569] outline-none lg:h-[160px]"
              style={{
                caretColor: step.color,
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* File Attachment */}
      <FileAttachment files={attachedFiles} onChange={handleFilesChange} />

      {/* Navigation */}
      {isLast ? (
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!canProceed || isLoading}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl py-4 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] transition-all group-hover:from-[#2563EB] group-hover:to-[#3B82F6]" />
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.06)" }}
            />
            {isLoading ? (
              <div className="relative flex items-center gap-3">
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span className="text-base">Generando con INICIA...</span>
              </div>
            ) : (
              <>
                <Sparkles className="relative h-4.5 w-4.5" />
                <span className="relative text-base">Generar Prompt</span>
              </>
            )}
          </button>
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            className="mx-auto flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#64748B] transition-all hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#64748B] transition-all hover:text-white disabled:invisible"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <div className="flex items-center gap-2">
            {!step.required && (
              <button
                onClick={() => setCurrent(Math.min(STEPS.length - 1, current + 1))}
                className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium text-[#64748B] transition-all hover:text-white"
              >
                Saltar
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setCurrent(Math.min(STEPS.length - 1, current + 1))}
              disabled={!canProceed}
              className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: `${step.color}20`, color: step.color }}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
