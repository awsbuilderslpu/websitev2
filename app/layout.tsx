import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Navbar } from "@/components/navbar";
import  { Footer } from "@/components/footer";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://awslpu.in"),

  title: {
    default: "AWS Student Builder Group at LPU",
    template: "%s | AWS Student Builder Group at LPU",
  },

  description:
    "AWS Student Builder Group at Lovely Professional University. Learn, build, and grow through AWS, cloud computing, developer projects, events, and community.",

  keywords: [
    "AWS Student Builder Group",
    "AWS SBG LPU",
    "AWS LPU",
    "AWS Student Community",
    "AWS Student Builder Group LPU",
    "AWS Events LPU",
    "AWS Workshops LPU",
    "Cloud Computing LPU",
    "AWS Community India",
    "Lovely Professional University",
  ],

  authors: [
    {
      name: "AWS Student Builder Group at LPU",
    },
  ],

  creator: "AWS Student Builder Group at LPU",
  publisher: "AWS Student Builder Group at LPU",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://awslpu.in",
    siteName: "AWS Student Builder Group at LPU",
    title: "AWS Student Builder Group at LPU",
    description:
      "A student-led AWS community at Lovely Professional University building with cloud, technology, and people.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AWS Student Builder Group at LPU",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AWS Student Builder Group at LPU",
    description:
      "Learn. Build. Ship. AWS Student Builder Group at Lovely Professional University.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://awslpu.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#111827] text-[#F5F5F5]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}