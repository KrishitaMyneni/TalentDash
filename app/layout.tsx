import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
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

const currentYear = new Date().getFullYear();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-[60] rounded-md bg-surface px-3 py-2 text-sm font-medium text-foreground shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-50 border-b border-border bg-surface/95 shadow-sm backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link
                href="/"
                className="flex items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a5f]/40"
              >
                <span className="text-xl font-bold tracking-tight text-[#ff5a5f]">
                  TalentDash
                </span>
              </Link>
              <nav
                className="flex items-center gap-4 sm:gap-6"
                aria-label="Primary"
              >
                <Link
                  href="/salaries"
                  className="rounded-md px-2 py-1 text-sm font-medium text-muted-text outline-none transition-colors hover:text-[#ff5a5f] focus-visible:ring-2 focus-visible:ring-[#ff5a5f]/40"
                >
                  Salaries
                </Link>
                <Link
                  href="/compare"
                  className="rounded-md px-2 py-1 text-sm font-medium text-muted-text outline-none transition-colors hover:text-[#ff5a5f] focus-visible:ring-2 focus-visible:ring-[#ff5a5f]/40"
                >
                  Compare
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-border bg-surface/70 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
              <p className="text-sm text-muted-text">
                &copy; {currentYear} {SITE_NAME}. Compensation intelligence
                powered by structured data.
              </p>
              <div className="flex items-center gap-8 text-sm">
                <Link
                  href="/salaries"
                  className="rounded-md font-medium text-muted-text outline-none transition-colors hover:text-[#ff5a5f] focus-visible:ring-2 focus-visible:ring-[#ff5a5f]/40"
                >
                  Salaries
                </Link>
                <Link
                  href="/compare"
                  className="rounded-md font-medium text-muted-text outline-none transition-colors hover:text-[#ff5a5f] focus-visible:ring-2 focus-visible:ring-[#ff5a5f]/40"
                >
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
