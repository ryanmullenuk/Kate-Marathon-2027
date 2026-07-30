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
  assert.match(html, /Lauren(?:&apos;|&#x27;|')s/i);
  assert.match(html, />story</i);
  assert.match(html, /Detailed London map showing the London Marathon course/i);
  assert.match(html, /particle-field/i);
  assert.match(html, /Move or tap for a little extra energy/i);
  assert.match(html, /src="\/kate-run-transparent\.png"/i);
  assert.match(html, /aria-label="Visit the Young Epilepsy website"/i);
  assert.match(html, /class="polaroid-gallery"/i);
  assert.match(html, /Full of life\. Full of joy\./i);
  assert.match(html, /Read the memories shared for Lauren/i);
  assert.doesNotMatch(html, /<figcaption>/i);
  assert.doesNotMatch(html, /class="[^"]*\bflower\b/i);
});
