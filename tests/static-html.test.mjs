import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function exportedPage() {
  return readFile(new URL("../out/index.html", import.meta.url), "utf8");
}

test("exports the Kate Runs fundraising page for GitHub Pages", async () => {
  const html = await exportedPage();

  assert.match(
    html,
    /<title>Kate Runs London 2027 \| For Lauren &amp; Young Epilepsy<\/title>/i,
  );
  assert.match(html, /Kate runs/);
  assert.match(html, /Lauren(?:&apos;|&#x27;|')s story/i);
  assert.match(html, /Detailed London map showing the London Marathon course/i);
  assert.match(html, /particle-field/i);
  assert.doesNotMatch(html, /class="[^"]*\bflower\b/i);
});
