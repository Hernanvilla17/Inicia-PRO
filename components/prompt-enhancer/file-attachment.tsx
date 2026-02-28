"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, X, FileText, ImagePlus } from "lucide-react";

export interface AttachedFile {
  file: File;
  preview?: string;
  base64: string;
  mediaType: string;
  isImage: boolean;
  textContent?: string; // for text-based files
}

const MAX_FILES = 3;
const ACCEPTED_TYPES =
  "image/png,image/jpeg,image/gif,image/webp,application/pdf,text/plain,text/csv,text/markdown";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

const TEXT_TYPES = ["text/plain", "text/csv", "text/markdown"];

interface FileAttachmentProps {
  files: AttachedFile[];
  onChange: (files: AttachedFile[]) => void;
}

export function FileAttachment({ files, onChange }: FileAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    async (selectedFiles: File[]) => {
      const remaining = MAX_FILES - files.length;
      if (remaining <= 0) return;
      const filesToAdd = selectedFiles.slice(0, remaining);

      const newAttachments: AttachedFile[] = await Promise.all(
        filesToAdd.map(async (file) => {
          const isImage = file.type.startsWith("image/");
          const base64 = await readFileAsBase64(file);
          const isText = TEXT_TYPES.includes(file.type);
          const textContent = isText ? await readFileAsText(file) : undefined;

          return {
            file,
            preview: isImage ? URL.createObjectURL(file) : undefined,
            base64,
            mediaType: file.type,
            isImage,
            textContent,
          };
        })
      );

      onChange([...files, ...newAttachments]);
    },
    [files, onChange]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    await processFiles(selected);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    await processFiles(dropped);
  };

  const removeFile = (index: number) => {
    const removed = files[index];
    if (removed.preview) URL.revokeObjectURL(removed.preview);
    onChange(files.filter((_, i) => i !== index));
  };

  const isFull = files.length >= MAX_FILES;

  return (
    <div className="space-y-3">
      {/* Drop zone / Attach button */}
      {!isFull && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed px-4 py-3 transition-all ${
            isDragging
              ? "border-brand-blue/50 bg-brand-blue/[0.06]"
              : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isDragging ? "bg-brand-blue/20" : "bg-white/[0.06]"
            }`}
          >
            <ImagePlus
              className={`h-4 w-4 transition-colors ${
                isDragging ? "text-brand-blue" : "text-[#64748B]"
              }`}
            />
          </div>
          <div className="text-left">
            <span
              className={`text-sm font-medium transition-colors ${
                isDragging ? "text-brand-blue" : "text-[#94A3B8]"
              }`}
            >
              {files.length > 0
                ? `Agregar más (${files.length}/${MAX_FILES})`
                : "Adjuntar imágenes o archivos"}
            </span>
            <p className="text-[10px] text-[#475569]">
              PNG, JPG, PDF, TXT — máx. {MAX_FILES} archivos
            </p>
          </div>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {files.map((attachment, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="group relative"
              >
                {attachment.isImage && attachment.preview ? (
                  <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl ring-1 ring-white/10">
                    <img
                      src={attachment.preview}
                      alt={attachment.file.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-3">
                      <span className="block truncate text-[8px] font-medium text-white/80">
                        {attachment.file.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[72px] w-[72px] flex-col items-center justify-center gap-1.5 rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                    <FileText className="h-5 w-5 text-[#64748B]" />
                    <span className="max-w-[60px] truncate text-[8px] font-medium text-[#64748B]">
                      {attachment.file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}

            {/* Add more mini button when not full */}
            {!isFull && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/[0.08] text-[#475569] transition-all hover:border-white/[0.15] hover:text-[#64748B]"
              >
                <Paperclip className="h-4 w-4" />
                <span className="text-[8px] font-medium">Agregar</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Build the images and message content for the API call
 */
export function buildAttachmentPayload(files: AttachedFile[]) {
  const images = files
    .filter((f) => f.isImage && f.base64)
    .map((f) => ({ base64: f.base64, mediaType: f.mediaType }));

  // PDFs sent as document blocks
  const documents = files
    .filter((f) => f.mediaType === "application/pdf" && f.base64)
    .map((f) => ({ base64: f.base64, mediaType: f.mediaType, name: f.file.name }));

  // Text file contents included in message
  const textContents = files
    .filter((f) => f.textContent)
    .map((f) => `--- Contenido de ${f.file.name} ---\n${f.textContent}`)
    .join("\n\n");

  return { images, documents, textContents };
}
