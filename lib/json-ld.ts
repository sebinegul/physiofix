/**
 * Serialize data for embedding in a <script type="application/ld+json"> block.
 *
 * JSON.stringify alone is unsafe: if any string value contains "</script>",
 * the browser's HTML parser closes the script tag early and the remainder is
 * parsed as HTML/JS (stored-XSS via blog titles, authors, excerpts, etc.).
 * Escaping < > & (and U+2028/U+2029) inside the JSON makes the payload
 * inert while keeping it valid JSON for parsers.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
