"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { name: "Home", href: "/" },
  { name: "Convert", href: "/convert" },
  { name: "Explainer", href: "/explainer" },
 
];



function AnimatedWave() {
  // Responsive, animated SVG wave for footer background
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none z-0">
      <svg
        className="relative block w-[calc(100%+1.3px)] h-[90px] sm:h-[120px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M0,48 C150,120 350,0 600,38 C850,76 1050,8 1200,48 L1200,120 L0,120 Z"
          fill="url(#footer-gradient)"
        />
        <defs>
          <linearGradient id="footer-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#706cf8" />
            <stop offset="60%" stopColor="#d46dda" />
            <stop offset="100%" stopColor="#7ee8fa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 pt-10 pb-0 bg-gradient-to-t from-[#f7f9fc] to-transparent">
      <AnimatedWave />
      <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-end justify-between">
        {/* Left: Logo and tagline */}
        <motion.div
          className="flex flex-col items-center md:items-start gap-3 mb-6 md:mb-0"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="flex items-center gap-2"
            initial={{ scale: 0.7 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
          >
            <span className="text-2xl font-extrabold text-[#706cf8]">DecodeX</span>
            <span className="text-xl">✨</span>
          </motion.div>
          <span className="text-gray-600 font-medium text-center md:text-left max-w-xs">
            AI-powered Code Converter & Explainer. Save hours, boost productivity.
          </span>
        </motion.div>
        {/* Center: Navigation */}
        <nav className="flex flex-wrap gap-x-8 gap-y-3 items-center justify-center mb-6 md:mb-0">
          {links.map(link => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.1, color: "#706cf8" }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="text-gray-700 hover:text-[#706cf8] font-medium text-base transition-colors"
            >
              <Link href={link.href}>{link.name}</Link>
            </motion.div>
          ))}
        </nav>
        
      
      </div>
      {/* Copyright and animated gradient bar */}
      <div className="relative mt-8 px-4 pb-4">
        <motion.div
          initial={{ width: "20%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="h-1 rounded-full bg-gradient-to-r from-[#706cf8] via-[#d46dda] to-[#7ee8fa] mb-4"
        />
        <p className="text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} DecodeX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}