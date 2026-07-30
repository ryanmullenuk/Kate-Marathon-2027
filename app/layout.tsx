import type { Metadata } from "next";
import { Anton, DM_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kateruns.co.uk"),
  title: "Kate Runs London 2027 | For Lauren & Young Epilepsy",
  description:
    "Follow Kate's London Marathon 2027 journey and help her raise £3,000 for Young Epilepsy in memory of Lauren Szumski.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Kate Runs London 2027",
    description:
      "26.2 miles for Lauren, raising money for Young Epilepsy.",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "Kate Runs London 2027 — 26.2 miles for Lauren and Young Epilepsy",
      },
    ],
    type: "website",
    url: "/",
    siteName: "Kate Runs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kate Runs London 2027",
    description:
      "26.2 miles for Lauren, raising money for Young Epilepsy.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
