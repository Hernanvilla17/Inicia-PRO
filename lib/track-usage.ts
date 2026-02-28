/**
 * Fire-and-forget usage tracking to n8n webhook.
 * Logs errors to console for debugging but never blocks.
 */
export function trackUsage(mode: string, inputTokens: number, outputTokens: number) {
  const webhookUrl = process.env.TRACKING_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[trackUsage] TRACKING_WEBHOOK_URL not configured");
    return;
  }

  const payload = {
    mode,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    timestamp: new Date().toISOString(),
  };

  console.log("[trackUsage] Sending:", payload);

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      console.log(`[trackUsage] Response status: ${res.status} ${res.ok ? "✓" : "✗"}`);
    })
    .catch((err) => {
      console.error("[trackUsage] Error:", err);
    });
}
