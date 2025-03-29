"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex-shrink-0">
              <h1 className="text-lg font-semibold text-indigo-900">
                Stickerface
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="pt-14 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                Interactive digital stickers and photo effects
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                Express yourself with our collection of interactive elements
              </p>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
            <div className="mt-10 max-w-md mx-auto grid gap-6 lg:grid-cols-2 lg:max-w-none">
              {/* Stickers Card */}
              <div className="flex flex-col overflow-hidden rounded-md">
                <Link href="/sticker" className="flex flex-col flex-1 group">
                  <div className="flex-1 bg-gradient-to-br from-indigo-50 to-white p-5 flex flex-col border border-indigo-100 hover:border-indigo-200 transition-colors rounded-md">
                    <div className="flex-1 flex items-center justify-center py-6">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center"></div>
                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center"></div>
                        <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center"></div>
                        <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center"></div>
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center"></div>
                        <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center"></div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <h3 className="text-base font-medium text-indigo-800">
                        Interactive Stickers
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Discover a collection of stickers that respond to your
                        touch
                      </p>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-xs font-medium text-indigo-600">
                        View collection
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 ml-1.5 text-indigo-500 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Photos Card */}
              <div className="flex flex-col overflow-hidden rounded-md">
                <Link href="/photos" className="flex flex-col flex-1 group">
                  <div className="flex-1 bg-gradient-to-br from-blue-50 to-white p-5 flex flex-col border border-blue-100 hover:border-blue-200 transition-colors rounded-md">
                    <div className="flex-1 flex items-center justify-center py-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="w-20 h-20 bg-blue-100"></div>
                        <div className="w-20 h-20 bg-indigo-100"></div>
                        <div className="w-20 h-20 bg-sky-100"></div>
                        <div className="w-20 h-20 bg-cyan-100"></div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <h3 className="text-base font-medium text-blue-800">
                        Photo Gallery
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Browse through photos with creative effects and
                        transformations
                      </p>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-xs font-medium text-blue-600">
                        Browse gallery
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 ml-1.5 text-blue-500 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
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
      <footer className="bg-white">
        <div className="max-w-6xl mx-auto py-5 px-4 sm:px-5 lg:px-6 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            © {new Date().getFullYear()} Stickerface. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
