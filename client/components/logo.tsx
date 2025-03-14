"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isHovered) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isHovered])

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-center"
        initial={{ opacity: 1 }}
        animate={{
          opacity: isAnimating ? [1, 0.8, 1] : 1,
          scale: isAnimating ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        {/* Logo Icon */}
        <motion.div
          className="mr-2 relative"
          animate={{
            rotate: isAnimating ? [0, 15, -15, 0] : 0,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle
              cx="18"
              cy="18"
              r="16"
              className="fill-primary/20"
              animate={{
                scale: isAnimating ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M10 18C10 13.5817 13.5817 10 18 10C22.4183 10 26 13.5817 26 18C26 22.4183 22.4183 26 18 26"
              stroke="url(#paint0_linear)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: isAnimating ? [0.3, 1, 0.3] : 0.3,
                rotate: isAnimating ? [0, 180, 360] : 0,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M18 26C15.7909 26 14 24.2091 14 22C14 19.7909 15.7909 18 18 18C20.2091 18 22 19.7909 22 22C22 24.2091 20.2091 26 18 26Z"
              fill="url(#paint1_linear)"
              animate={{
                scale: isAnimating ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z"
              fill="url(#paint2_linear)"
              animate={{
                scale: isAnimating ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="paint0_linear" x1="10" y1="18" x2="26" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="14" y1="22" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient id="paint2_linear" x1="16" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Connection lines animation */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
            animate={{
              rotate: isAnimating ? [0, 360] : 0,
            }}
            transition={{ duration: 3, ease: "linear", repeat: isAnimating ? 1 : 0 }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 h-0.5 w-0 bg-gradient-to-r from-primary/0 to-primary/40"
                style={{
                  rotate: `${angle}deg`,
                  transformOrigin: "left center",
                }}
                animate={{
                  width: isAnimating ? ["0%", "100%", "0%"] : "0%",
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Logo Text */}
        <div className="flex flex-col">
          <motion.div
            className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            animate={{
              y: isAnimating ? [0, -2, 0] : 0,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            Kırılım
          </motion.div>
          <motion.div
            className="text-xs text-gray-500 dark:text-gray-400"
            animate={{
              opacity: isAnimating ? [0.7, 1, 0.7] : 0.7,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            İnteraktif Hikaye Ağı
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute -bottom-1 left-0 w-full overflow-hidden h-1">
        <motion.div
          className="h-full bg-gradient-to-r from-primary/0 via-primary to-primary/0"
          initial={{ x: "-100%" }}
          animate={{
            x: isAnimating ? ["-100%", "100%"] : "-100%",
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

