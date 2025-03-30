import { Analytics } from "@vercel/analytics/react";
import { Nunito } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["500", "600", "700"] });
export const metadata = {
  title: "Stickerface",
  description: "Interactive stickers for your digital space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning={true}>
        <header className="sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Reduced header height */}
            <div
              className={`h-14 flex items-center justify-between ${nunito.className}`}
            >
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="
                    text-2xl font-bold text-transparent bg-clip-text 
                    bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 
                    transition duration-300 ease-out 
                    hover:bg-gradient-to-l hover:from-indigo-500 hover:via-indigo-700 hover:to-indigo-500 
                    tracking-tight
                  "
                >
                  Stickerface
                </Link>
              </div>
            </div>
          </div>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
