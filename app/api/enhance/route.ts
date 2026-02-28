import { NextRequest, NextResponse } from "next/server";
import { trackUsage } from "@/lib/track-usage";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { system, message, images, documents, mode } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build multimodal content array if attachments are provided
    type ContentBlock =
      | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
      | { type: "document"; source: { type: "base64"; media_type: string; data: string } }
      | { type: "text"; text: string };

    let userContent: string | ContentBlock[] = message;

    const hasImages = images && Array.isArray(images) && images.length > 0;
    const hasDocs = documents && Array.isArray(documents) && documents.length > 0;

    if (hasImages || hasDocs) {
      const contentBlocks: ContentBlock[] = [];

      // Add image blocks
      if (hasImages) {
        for (const img of images) {
          if (img.base64 && img.mediaType) {
            contentBlocks.push({
              type: "image",
              source: {
                type: "base64",
                media_type: img.mediaType,
                data: img.base64,
              },
            });
          }
        }
      }

      // Add document blocks (PDFs)
      if (hasDocs) {
        for (const doc of documents) {
          if (doc.base64 && doc.mediaType) {
            contentBlocks.push({
              type: "document",
              source: {
                type: "base64",
                media_type: doc.mediaType,
                data: doc.base64,
              },
            });
          }
        }
      }

      // Add text message last
      contentBlocks.push({ type: "text", text: message });
      userContent = contentBlocks;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        ...(hasDocs ? { "anthropic-beta": "pdfs-2024-09-25" } : {}),
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: system || "",
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "API request failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Fire-and-forget usage tracking
    if (data.usage) {
      trackUsage(
        mode || "Asistente",
        data.usage.input_tokens,
        data.usage.output_tokens
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
