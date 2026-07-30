import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Kate Runs fundraising page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
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
