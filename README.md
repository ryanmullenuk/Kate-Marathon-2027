# Kate Runs London 2027

One-page fundraising website for Kate's 2027 London Marathon campaign in
support of Young Epilepsy and in memory of Lauren Szumski.

## Updating the fundraiser

The values used by the donation buttons and trainer tracker are grouped at the
top of `app/page.tsx`:

- `DONATION_URL` — replace `#donate` with the JustGiving URL.
- `AMOUNT_RAISED` — enter the current amount raised in pounds.
- `FUNDRAISING_TARGET` — currently set to £3,000.

Lauren's memorial section is marked as coming soon and is ready for supplied
photos and copy.

## Local development

```bash
pnpm install
pnpm dev
```

## Publishing

The website is built with Next.js and React, then exported as a static site.
Every change merged into `main` is built and published automatically through
GitHub Pages.

The production domain is `https://kateruns.co.uk`.
