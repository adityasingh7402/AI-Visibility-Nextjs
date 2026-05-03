import type { Metadata } from "next";
import { Poppins, Schibsted_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI Visibility Platform — Brand Dashboard",
  description:
    "Measure and optimize your brand's visibility across AI assistants like ChatGPT, Gemini, and Perplexity.",
  openGraph: {
    title: "AI Visibility Platform",
    description:
      "Measure and optimize your brand's visibility across AI assistants.",
    siteName: "AI Visibility Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Visibility Platform",
    description:
      "Measure and optimize your brand's visibility across AI assistants.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body
        className={`${poppins.variable} ${schibstedGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={6000}
        />
      </body>
    </html>
  );
}
