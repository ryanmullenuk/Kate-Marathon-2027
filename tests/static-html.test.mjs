import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function exportedPage() {
  return readFile(new URL("../out/index.html", import.meta.url), "utf8");
}

test("exports the Kate Runs fundraising page for GitHub Pages", async () => {
  const html = await exportedPage();
  const donationLinks =
    html.match(
      /href="https:\/\/www\.justgiving\.com\/page\/kateruns27"/gi,
    ) ?? [];

  assert.match(
    html,
    /<title>Kate Runs London 2027 \| For Lauren &amp; Young Epilepsy<\/title>/i,
  );
  assert.equal(donationLinks.length, 5);
  assert.doesNotMatch(html, /JustGiving link coming soon/i);
  assert.doesNotMatch(html, /Donation link coming soon/i);
  assert.doesNotMatch(html, /fundraising opens/i);
  assert.match(html, /Kate runs/);
  assert.match(html, /Lauren(?:&apos;|&#x27;|')s/i);
  assert.match(html, />story</i);
  assert.match(html, /Detailed London map showing the London Marathon course/i);
  assert.match(html, /ambient-particles/i);
  assert.doesNotMatch(html, /particle-field/i);
  assert.doesNotMatch(html, /Move or tap for a little extra energy/i);
  assert.match(html, /src="\/kate-run-transparent\.png"/i);
  assert.match(html, /hero__intro--highlight/i);
  assert.match(html, /kate-runs-share\.png/i);
  assert.match(html, /apple-touch-icon\.png/i);
  assert.match(html, /manifest\.webmanifest/i);
  assert.match(html, /aria-label="Visit the Young Epilepsy website"/i);
  assert.match(html, /aria-label="Young Epilepsy statistics"/i);
  assert.match(html, /100,000 children and young people in the UK/i);
  assert.match(html, /23 new cases diagnosed every day/i);
  assert.match(
    html,
    /seizures that cannot be controlled with medication/i,
  );
  assert.match(html, /greatly affects their mental health/i);
  assert.match(html, /support they need to take part fully at school/i);
  assert.match(html, /class="polaroid-gallery"/i);
  assert.match(html, /lauren-friends-black-white\.jpeg/i);
  assert.match(html, /lauren-friends-evening\.jpeg/i);
  assert.match(html, /lauren-seaside-selfie\.jpeg/i);
  assert.match(html, /lauren-travel-bench\.jpeg/i);
  assert.match(html, /lauren-friends-dinner\.jpeg/i);
  assert.match(
    html,
    /Lauren sitting on a rock looking across the mountains at sunset/i,
  );
  assert.match(html, /Full of life\. Full of joy\./i);
  assert.match(html, /passed away suddenly on 2nd May 2023/i);
  assert.match(html, /lauren-floral-wall\.jpg/i);
  assert.match(html, /lauren-rio-view\.jpg/i);
  assert.doesNotMatch(html, /donate\.justgiving\.com\/page\/kateruns27/i);
  assert.match(html, /Forever in our hearts\. Shine brightly\./i);
  assert.match(html, /Clever, independent, kind and full of joy\./i);
  assert.match(html, /She made amazing friends wherever she went\./i);
  assert.match(html, /An absolute pleasure to know\. Truly missed\./i);
  assert.doesNotMatch(html, /justgiving\.com\/fundraising\/Lauren-Szumski1/i);
  assert.doesNotMatch(html, /<figcaption>/i);
  assert.doesNotMatch(html, /class="[^"]*\bflower\b/i);
});
