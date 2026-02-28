"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";
import { IniciaStepsVisual } from "./inicia-steps-visual";
import {
  FileAttachment,
  buildAttachmentPayload,
  type AttachedFile,
} from "./file-attachment";

interface SimpleModeProps {
  onResult: (result: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  initialPrompt?: string | null;
  onConsumeInitialPrompt?: () => void;
}

export function SimpleMode({
  onResult,
  isLoading,
  setIsLoading,
  initialPrompt,
  onConsumeInitialPrompt,
}: SimpleModeProps) {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Pre-fill prompt when coming from "Editar"
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      onConsumeInitialPrompt?.();
    }
  }, [initialPrompt, onConsumeInitialPrompt]);

  const handleFilesChange = useCallback((files: AttachedFile[]) => {
    setAttachedFiles(files);
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const { images, documents, textContents } =
        buildAttachmentPayload(attachedFiles);

      let fullMessage = `Mejora este prompt usando la metodología INICIA:\n\n${prompt}`;
      if (textContents) {
        fullMessage += `\n\nArchivos de texto adjuntos:\n${textContents}`;
      }

      const hasVisualAttachments =
        images.length > 0 || documents.length > 0;

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

El usuario te dará un prompt original. Mejóralo y restructúralo usando las secciones INICIA.`,
          message: fullMessage,
          images: hasVisualAttachments ? images : undefined,
          documents: hasVisualAttachments ? documents : undefined,
          mode: "Prompt Enhancer Rápido",
        }),
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        onResult(data.content[0].text);
        try {
          fetch(
            "https://n8n-n8n.rh89ob.easypanel.host/webhook/430941d5-790b-4526-96a0-4977cd325449",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "Prompt Enhancer Rápido",
                input_tokens: data.usage?.input_tokens || 0,
                output_tokens: data.usage?.output_tokens || 0,
                timestamp: new Date().toISOString(),
              }),
            }
          );
        } catch {}
      } else if (data.error) {
        onResult(`Error: ${data.error}`);
      }
    } catch {
      onResult("Error al conectar con la API. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-5">
      {/* INICIA Visual */}
      <IniciaStepsVisual isLoading={isLoading} />

      {/* Textarea */}
      <div
        className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-brand-blue/30 shadow-[0_0_40px_rgba(59,130,246,0.1)]"
            : "ring-1 ring-white/[0.06]"
        }`}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe o pega tu prompt aquí...  Ej: 'Escríbeme un email de ventas para mi SaaS'"
          className="h-[180px] w-full resize-none bg-dark-deep/60 px-5 py-4 text-sm leading-relaxed text-white placeholder-[#475569] outline-none lg:h-[200px]"
        />
        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-white/[0.04] bg-dark-deep/40 px-5 py-2.5">
          <span className="text-[11px] text-[#475569]">
            {prompt.length > 0
              ? `${prompt.length} caracteres`
              : "Ctrl+Enter para enviar"}
          </span>
          <div className="flex items-center gap-1.5">
            {["I", "N", "I", "C", "I", "A"].map((letter, i) => (
              <span
                key={i}
                className="text-[9px] font-extrabold"
                style={{
                  color: [
                    "#3B82F6",
                    "#3B82F6",
                    "#3B82F6",
                    "#3B82F6",
                    "#FBBF24",
                    "#FBBF24",
                  ][i],
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* File Attachment */}
      <FileAttachment files={attachedFiles} onChange={handleFilesChange} />

      {/* Submit — full width */}
      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isLoading}
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
            <span>Mejorando con INICIA...</span>
          </div>
        ) : (
          <>
            <Zap className="relative h-4.5 w-4.5" />
            <span className="relative text-base">Mejorar con INICIA</span>
          </>
        )}
      </button>
    </div>
  );
}
