import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Choufli hal 2.0",
  description:
    "A Hackathon organized by GDGC ISSATSo in its second edition 2.0",
  keywords: [
    "hackathon",
    "GDGC",
    "ISSATSo",
    "coding",
    "programming",
    "competition",
    "Tunisia",
  ],
  authors: [{ name: "GDGC ISSATSo" }],
  creator: "GDGC ISSATSo",
  publisher: "GDGC ISSATSo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gdg-on-campus-issatso.tn",
    title: "Choufli hal 2.0 | GDGC ISSATSo Hackathon",
    description:
      "Join the Choufli hal 2.0 Hackathon organized by GDGC ISSATSo. Register your team now!",
    siteName: "Choufli hal 2.0",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Choufli hal 2.0 Hackathon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Choufli hal 2.0 | GDGC ISSATSo Hackathon",
    description:
      "Join the Choufli hal 2.0 Hackathon organized by GDGC ISSATSo. Register your team now!",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <>
            {children}
            <SpeedInsights />
            <Analytics />
            <Toaster />
          </>
        </Providers>
      </body>
    </html>
  );
}
