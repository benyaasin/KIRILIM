"use client"

import { motion } from "framer-motion"

interface ConnectionPointProps {
  position: { id: string; x: number; y: number }
  isVisible: boolean
}

export default function ConnectionPoint({ position, isVisible }: ConnectionPointProps) {
  return (
    <motion.div
      className="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-300 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0,
      }}
      initial={{ scale: 0 }}
      animate={{ scale: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    />
  )
}

