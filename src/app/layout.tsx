import type { Metadata, Viewport } from "next";
import { Chivo, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const chivo = Chivo({
  subsets: ["latin"],
  variable: "--font-chivo",
  weight: ["700", "800", "900"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CineStream",
  description: "Your private cinema",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${chivo.variable} ${hanken.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
