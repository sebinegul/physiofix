"use client";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918151912525?text=Hi%2C%20I%20need%20physiotherapy%20consultation"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex items-center"
      aria-label="Chat with us on WhatsApp"
    >
      {/* Tooltip */}
      <span className="mr-3 hidden whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:block group-hover:opacity-100 sm:block sm:opacity-100">
        Chat with us
      </span>

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-14 sm:w-14 md:h-[60px] md:w-[60px]">
        {/* Pulse ring on hover */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-20 group-hover:animate-pulse" />

        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 32 32"
          fill="white"
          className="relative h-7 w-7 sm:h-7 sm:w-7 md:h-8 md:w-8"
        >
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.054 9.374L1.054 31.25l6.146-1.98C9.66 30.99 12.736 32 16.004 32 24.83 32 32 24.826 32 16S24.83 0 16.004 0zm9.336 22.594c-.39 1.096-1.932 2.014-3.164 2.28-.84.18-1.936.322-5.596-1.2-4.68-1.92-7.684-6.656-7.914-6.97-.222-.314-1.84-2.446-1.84-4.668 0-2.22 1.168-3.31 1.582-3.77.39-.43.946-.56 1.258-.56.312 0 .626.004.896.014.29.01.676-.11 1.054.806.39.95 1.33 3.246 1.444 3.478.114.232.19.502.038.816-.152.314-.226.508-.45.782-.224.274-.47.612-.67.818-.224.232-.458.484-.196.946.262.462 1.164 1.92 2.5 3.11 1.712 1.53 3.15 2.004 3.61 2.228.46.224.728.188 1.0-.152.272-.34 1.16-1.35 1.47-1.82.312-.47.626-.39 1.054-.234.43.152 2.72 1.282 3.188 1.514.468.232.78.35.896.544.116.19.116 1.11-.274 2.206z" />
        </svg>
      </span>
    </a>
  );
}
