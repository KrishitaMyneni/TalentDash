import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Compensation Intelligence`,
    template: `%s - ${SITE_NAME}`,
  },
  description:
    "Compare salaries across top tech companies. Real compensation data for software engineers, product managers, and more.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Compensation Intelligence`,
    description:
      "Compare salaries across top tech companies. Real compensation data for software engineers, product managers, and more.",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fafafa] text-gray-900">
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#77dd77]">
                  <span className="text-sm font-bold text-white">TD</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  TalentDash
                </span>
              </Link>
              <nav className="flex items-center gap-6">
                <Link
                  href="/salaries"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-[#77dd77]"
                >
                  Salaries
                </Link>
                <Link
                  href="/compare"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-[#77dd77]"
                >
                  Compare
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                © 2024 {SITE_NAME}. Compensation intelligence powered by structured data.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/salaries" className="text-gray-500 hover:text-[#77dd77]">
                  Salaries
                </Link>
                <Link href="/compare" className="text-gray-500 hover:text-[#77dd77]">
                  Compare
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
