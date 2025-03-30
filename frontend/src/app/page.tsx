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

// Initialize Nunito font
const nunito = Nunito({ subsets: ["latin"] });

export default function Home() {
  // Calculate current year for footer
  const currentYear = new Date().getFullYear();
  const location = "Chicago, IL"; // Added based on context

  return (
    <div className={`min-h-screen bg-white text-gray-700 ${nunito.className}`}>
      {" "}
      {/* Slightly darker base text */}
      {/* --- Navigation --- */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Reduced header height */}
          <div className="h-14 flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link
                href="/"
                // Reduced font size, adjusted tracking hover
                className="text-lg font-bold text-gray-900 hover:text-indigo-700 transition-all duration-300 ease-in-out hover:tracking-normal"
              >
                Stickerface
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* --- Main Content --- */}
      <main>
        {/* --- Hero Section (Split Layout) --- */}
        <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Adjusted padding */}
            <div className="min-h-[calc(80vh-56px)] md:min-h-[calc(70vh-56px)] grid md:grid-cols-2 items-center gap-8 py-14 md:py-20">
              {" "}
              {/* 56px is approx header height h-14 */}
              {/* Text Content (Left) */}
              <div className="text-center md:text-left">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  {" "}
                  {/* Smaller tag */}A Personal Project by Eesha Moona
                </p>
                {/* Reduced heading size */}
                <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-900 tracking-tight leading-tight">
                  Physical Stickers, Digital Magic.
                </h1>
                {/* Reduced paragraph size */}
                <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                  Exploring the fun intersection of tactile stickers and
                  interactive digital experiences like mini-games and photo
                  effects.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  {" "}
                  {/* Adjusted button size/spacing */}
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
              {/* Visual Content (Right) - Placeholder */}
              <div className="relative h-64 md:h-full flex items-center justify-center">
                {/* Placeholder Visual - Replace with an actual image/graphic */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    {/* Pulsing background shapes */}
                    <div className="absolute top-0 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-50 animate-pulse-fast"></div>
                    <div className="absolute bottom-0 right-10 w-28 h-28 bg-indigo-200 rounded-lg opacity-50 animate-pulse-fast animation-delay-400"></div>
                    {/* Central floating icon */}
                    <FaStar className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 text-indigo-500 animate-subtle-float z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- About & Concept Section --- */}
        <section id="about" className="py-16 md:py-20 bg-white">
          {" "}
          {/* Reduced padding */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
              {/* Icon/Visual Element */}
              <div className="flex justify-center md:justify-start">
                {/* Slightly smaller icon, pulsing */}
                <FaHeart className="w-16 h-16 md:w-20 md:h-20 text-red-400 animate-pulse-fast" />
              </div>
              {/* Text Content */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {" "}
                  {/* Reduced heading size */}
                  Born from Curiosity & Code
                </h2>
                {/* Reduced text size */}
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
                  {" "}
                  {/* Smaller credit */}- Eesha Moona ({location})
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section (Alternating Layout) --- */}
        <section id="features" className="bg-gray-50">
          {" "}
          {/* Container for features */}
          {/* Feature 1: Stickers (Visual Left) */}
          <div className="py-16 md:py-20 overflow-hidden">
            {" "}
            {/* Reduced padding */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Visual Placeholder */}
                <div className="relative group aspect-square md:aspect-auto h-64 md:h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center p-6 overflow-hidden shadow-inner">
                  {" "}
                  {/* Reduced size slightly */}
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-purple-300/60 group-hover:scale-110 transition-transform duration-300 ease-in-out"></div>
                  <div className="absolute -top-5 -right-5 w-16 h-16 rounded-lg bg-indigo-300/70 rotate-12 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 ease-in-out"></div>
                  <FaPuzzlePiece className="h-16 w-16 md:h-20 md:h-20 text-indigo-500 z-10 transform group-hover:scale-110 transition-transform duration-300 ease-in-out" />{" "}
                  {/* Slightly smaller */}
                </div>
                {/* Text Content */}
                <div className="relative">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Interactive Fun
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                    {" "}
                    {/* Reduced heading size */}
                    Sticker Mini-Games
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {" "}
                    {/* Reduced text size */}
                    Tap or scan these specially designed stickers to instantly
                    unlock engaging mini-games and playful animations on your
                    device.
                  </p>
                  <div className="mt-4">
                    {" "}
                    {/* Reduced margin */}
                    <Link
                      href="/sticker"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 group"
                    >
                      {" "}
                      {/* Reduced text size */}
                      Play Now
                      <FaArrowRight className="ml-1.5 h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Feature 2: Photos (Visual Right) */}
          <div className="py-16 md:py-20 bg-white overflow-hidden">
            {" "}
            {/* Alternating bg, reduced padding */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Text Content (Order changed on MD) */}
                <div className="relative md:order-last">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Creative Filters
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                    {" "}
                    {/* Reduced heading size */}
                    Photo Effect Stickers
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {" "}
                    {/* Reduced text size */}
                    Use these unique stickers as triggers to apply artistic
                    effects, creative filters, and fun transformations to your
                    photos.
                  </p>
                  <div className="mt-4">
                    {" "}
                    {/* Reduced margin */}
                    <Link
                      href="/photos"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 group"
                    >
                      {" "}
                      {/* Reduced text size */}
                      Try Effects
                      <FaArrowRight className="ml-1.5 h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
                {/* Visual Placeholder (Order changed on MD) */}
                <div className="relative group aspect-square md:aspect-auto h-64 md:h-80 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center p-6 overflow-hidden shadow-inner md:order-first">
                  {" "}
                  {/* Reduced size slightly */}
                  <div className="absolute top-5 left-5 w-24 h-14 bg-blue-300/60 rounded-md group-hover:-rotate-3 group-hover:scale-105 transition-transform duration-300 ease-in-out"></div>
                  <div className="absolute bottom-5 right-5 w-16 h-16 bg-sky-300/70 rounded-full group-hover:scale-110 transition-transform duration-300 ease-in-out"></div>
                  <FaCamera className="h-16 w-16 md:h-20 md:h-20 text-blue-500 z-10 transform group-hover:scale-110 transition-transform duration-300 ease-in-out" />{" "}
                  {/* Slightly smaller */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* --- Footer --- */}
      <footer className="bg-gray-800 text-gray-400">
        {" "}
        {/* Darker footer for contrast */}
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {" "}
          {/* Reduced padding */}
          <div className="text-center">
            {/* Reduced text size */}
            <p className="text-xs">
              &copy; {currentYear} Eesha Moona - Stickerface Project. Based in{" "}
              {location}.
            </p>
            {/* Optional: Add links to personal site/socials here */}
            {/* <div className="mt-2 flex justify-center space-x-4">
                 <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs">GitHub</Link>
                 <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs">Portfolio</Link>
             </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
