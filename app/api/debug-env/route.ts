import { NextResponse } from "next/server";

// TEMPORAL - Eliminar después de diagnosticar
export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY;

  return NextResponse.json({
    hasKey: !!key,
    keyLength: key ? key.length : 0,
    keyPrefix: key ? key.substring(0, 7) + "..." : "NOT SET",
    nodeEnv: process.env.NODE_ENV,
    // Check for common typos/variations
    variations: {
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      ANTHROPIC_KEY: !!process.env.ANTHROPIC_KEY,
      NEXT_PUBLIC_ANTHROPIC_API_KEY: !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    },
  });
}
