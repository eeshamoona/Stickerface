"use client";

import { Nunito } from "next/font/google";
import Link from "next/link";
import { FaCamera, FaHeart, FaPuzzlePiece, FaStar } from "react-icons/fa";

const nunito = Nunito({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className="min-h-screen bg-white text-gray-800"
      style={{ fontFamily: nunito.style.fontFamily }}
    >
      {/* Navigation */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo/Brand Name */}
            <div className="flex-shrink-0">
              {/* Optional: Replace text with a logo component if available */}
              <Link
                href="/"
                className="text-xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors"
              >
                Stickerface
              </Link>
            </div>
            {/* Optional: Add Nav links here if needed in future */}
            {/* <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900">Features</Link>
              <Link href="#about" className="text-sm font-medium text-gray-500 hover:text-gray-900">About</Link>
            </nav> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-24 text-center bg-gradient-to-b from-indigo-50 via-white to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FaStar className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-indigo-900 tracking-tight leading-tight">
              Where Physical Stickers Meet Digital Magic.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Stickerface transforms traditional stickers into interactive
              gateways for fun digital experiences, games, and unique photo
              effects.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Explore Features
              </Link>
              {/* Optional second CTA */}
              {/* <Link href="#about" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                Learn More
              </Link> */}
            </div>
          </div>
        </section>

        {/* What is Stickerface Section */}
        <section id="concept" className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Unlock a New Dimension of Fun
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Imagine placing a cool physical sticker on your notebook, phone,
              or laptop. Now, imagine pointing your device at it to unlock a
              mini-game, reveal a hidden animation, or apply a unique filter to
              your photos. That&apos;s the magic of Stickerface – bridging the
              tactile joy of stickers with the endless possibilities of digital
              interaction.
            </p>
            {/* Optional: Add simple visual icons/steps */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                  <FaPuzzlePiece className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  1. Get Your Sticker
                </h3>
                <p className="mt-1 text-gray-500">
                  Start with our unique physical stickers.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                  <FaCamera className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  2. Tap your phone to activate
                </h3>
                <p className="mt-1 text-gray-500">
                  Use any device to make your sticker come alive.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                  <FaStar className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  3. Keep playing
                </h3>
                <p className="mt-1 text-gray-500">
                  Tap again and again whenever you want.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Story Section */}
        <section id="about" className="py-16 md:py-24 bg-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FaHeart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tight text-indigo-900 sm:text-4xl">
              Born from Curiosity
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
              Stickerface started as a passion project exploring how we could
              blend the physical world we love with the digital tools we use
              every day. We missed the simple fun of collecting and sharing
              stickers but saw the potential to make them do *more*. This
              project is our experiment in creating delightful, surprising
              interactions that start with something as simple as a sticker.
            </p>
            {/* Optional: Add creator name/link */}
            <p className="mt-6 text-sm text-indigo-800">
              Created with <FaHeart className="inline h-4 w-4 text-red-500" />{" "}
              by Eesha Moona
            </p>
          </div>
        </section>

        {/* Features Section (Enhanced Cards) */}
        <section id="features" className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Discover the Experiences
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Dive into the two current ways to experience Stickerface magic:
              </p>
            </div>

            <div className="mt-10 max-w-md mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-none">
              {/* Stickers Card */}
              <div className="flex flex-col overflow-hidden rounded-lg shadow-lg border border-gray-100 hover:shadow-indigo-100 transition-shadow duration-300">
                <Link href="/sticker" className="flex flex-col flex-1 group">
                  {/* Enhanced Visual Placeholder Area */}
                  <div className="flex-shrink-0 h-56 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-8 relative overflow-hidden">
                    {/* Example: Abstract representation of interactive stickers */}
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-300/50 group-hover:scale-110 transition-transform"></div>
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-lg bg-indigo-300/60 rotate-12 group-hover:rotate-6 transition-transform"></div>
                    <FaPuzzlePiece className="h-16 w-16 text-indigo-500 z-10 transform group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        Interactive Fun
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-gray-900">
                        Sticker Mini-Games
                      </h3>
                      <p className="mt-3 text-base text-gray-500">
                        Scan these stickers to unlock engaging mini-games and
                        playful animations directly on your device.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center">
                      <span className="text-sm font-medium text-indigo-700 group-hover:text-indigo-900">
                        Play Now
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1.5 text-indigo-500 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Photos Card */}
              <div className="flex flex-col overflow-hidden rounded-lg shadow-lg border border-gray-100 hover:shadow-blue-100 transition-shadow duration-300">
                <Link href="/photos" className="flex flex-col flex-1 group">
                  {/* Enhanced Visual Placeholder Area */}
                  <div className="flex-shrink-0 h-56 bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center p-8 relative overflow-hidden">
                    {/* Example: Abstract representation of photo effects */}
                    <div className="absolute top-4 left-4 w-24 h-16 bg-blue-300/50 rounded-md group-hover:-rotate-3 transition-transform"></div>
                    <div className="absolute bottom-4 right-4 w-20 h-20 bg-sky-300/60 rounded-full group-hover:scale-105 transition-transform"></div>
                    <FaCamera className="h-16 w-16 text-blue-500 z-10 transform group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600">
                        Creative Filters
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-gray-900">
                        Photo Effect Stickers
                      </h3>
                      <p className="mt-3 text-base text-gray-500">
                        Use these stickers as triggers to apply unique artistic
                        effects, filters, and transformations to your photos.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center">
                      <span className="text-sm font-medium text-blue-700 group-hover:text-blue-900">
                        Try Effects
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1.5 text-blue-500 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 md:flex md:items-center md:justify-between">
          {/* Optional: Add Social Links */}
          {/* <div className="flex justify-center space-x-6 md:order-2">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                 <span className="sr-only">Twitter</span>
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg> // Placeholder for Twitter Icon
              </Link>
               <Link href="#" className="text-gray-400 hover:text-gray-500">
                 <span className="sr-only">GitHub</span>
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg> // Placeholder for GitHub Icon
              </Link>
           </div> */}
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Stickerface. All rights
              reserved. Experimenting at the intersection of physical and
              digital.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
