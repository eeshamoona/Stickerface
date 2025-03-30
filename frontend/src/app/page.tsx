"use client";

import { Nunito } from "next/font/google";
import Link from "next/link";
import {
  FaArrowRight,
  FaCamera,
  FaHeart,
  FaPuzzlePiece,
  FaStar,
} from "react-icons/fa";

const nunito = Nunito({ subsets: ["latin"] });

export default function Home() {
  const currentYear = new Date().getFullYear();
  const location = "Chicago, IL";

  return (
    <div>
      <div
        className={`min-h-screen bg-white text-gray-700 ${nunito.className}`}
      >
        <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="min-h-[calc(80vh-56px)] md:min-h-[calc(70vh-56px)] grid md:grid-cols-2 items-center gap-8 py-14 md:py-20">
              <div className="text-center md:text-left">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  A Personal Project by Eesha Moona
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-900 tracking-tight leading-tight">
                  Physical Stickers, Digital Magic.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                  Exploring the fun intersection of tactile stickers and
                  interactive digital experiences like mini-games and photo
                  effects.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                  >
                    See Features
                    <FaArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                  <Link
                    href="#about"
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    Read the Story
                  </Link>
                </div>
              </div>
              <div className="relative h-64 md:h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute top-0 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-50 animate-pulse-fast"></div>
                    <div className="absolute bottom-0 right-10 w-28 h-28 bg-indigo-200 rounded-lg opacity-50 animate-pulse-fast animation-delay-400"></div>
                    <FaStar className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 text-indigo-500 animate-subtle-float z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
              <div className="flex justify-center md:justify-start">
                <FaHeart className="w-16 h-16 md:w-20 md:h-20 text-red-400 animate-pulse-fast" />
              </div>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Born from Curiosity & Code
                </h2>
                <p className="mt-3 text-base text-gray-600">
                  Stickerface started as a passion project exploring how to
                  blend the physical world with digital tools. I missed the
                  simple fun of stickers but saw potential for *more*. This
                  experiment aims for delightful, surprising interactions
                  triggered by something simple.
                </p>
                <p className="mt-3 text-base text-gray-600">
                  Imagine tapping a sticker on your laptop to unlock a mini-game
                  or a unique photo filter – that&apos;s the core idea: bridging
                  tactile joy with interactive possibilities.
                </p>
                <p className="mt-4 text-xs text-indigo-700 font-medium">
                  - Eesha Moona ({location})
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-gray-50">
          <div className="py-16 md:py-20 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div
                  className="relative group h-64 md:h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center p-6 overflow-hidden shadow-inner"
                  style={{ justifySelf: "center", aspectRatio: 1 }}
                >
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-purple-300/60 group-hover:scale-110 transition-transform duration-300 ease-in-out"></div>
                  <div className="absolute -top-5 -right-5 w-16 h-16 rounded-lg bg-indigo-300/70 rotate-12 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 ease-in-out"></div>
                  <FaPuzzlePiece className="h-16 w-16 md:h-20 md:h-20 text-indigo-500 z-10 transform group-hover:scale-110 transition-transform duration-300 ease-in-out" />
                </div>
                <div className="relative">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Interactive Fun
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                    Sticker Mini-Games
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Tap or scan these specially designed stickers to instantly
                    unlock engaging mini-games and playful animations on your
                    device.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/sticker"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 group"
                    >
                      Play Now
                      <FaArrowRight className="ml-1.5 h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-16 md:py-20 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative group aspect-[1] h-64 md:h-80 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center p-6 overflow-hidden shadow-inner md:order-first justify-self-center">
                  <div className="absolute top-5 left-5 w-24 h-14 bg-blue-300/60 rounded-md group-hover:-rotate-3 group-hover:scale-105 transition-transform duration-300 ease-in-out"></div>
                  <div className="absolute bottom-5 right-5 w-16 h-16 bg-sky-300/70 rounded-full group-hover:scale-110 transition-transform duration-300 ease-in-out"></div>
                  <FaCamera className="h-16 w-16 md:h-20 md:h-20 text-blue-500 z-10 transform group-hover:scale-110 transition-transform duration-300 ease-in-out" />
                </div>
                <div className="relative md:order-last">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Creative Filters
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                    Photo Effect Stickers
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Use these unique stickers as triggers to apply artistic
                    effects, creative filters, and fun transformations to your
                    photos.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/photos"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 group"
                    >
                      Try Effects
                      <FaArrowRight className="ml-1.5 h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="text-gray-400">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs">
              &copy; {currentYear} Eesha Moona - Stickerface Project. Based in{" "}
              {location}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
