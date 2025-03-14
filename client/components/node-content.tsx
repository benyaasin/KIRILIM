"use client"

import type { NodeData } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface NodeContentProps {
  node: NodeData
  isHovered: boolean
  isDragging: boolean
}

export default function NodeContent({ node, isHovered, isDragging }: NodeContentProps) {
  return (
    <div className="w-full h-full p-3 flex flex-col">
      {/* Title always visible */}
      <h3 className="font-medium text-sm text-white truncate">{node.title}</h3>

      {/* Subtitle with truncation */}
      <p className="text-xs text-white/80 truncate mt-1">{node.subtitle}</p>

      {/* Additional content visible on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-xs text-white/90 overflow-hidden"
          >
            <div className="border-t border-white/20 pt-2 mt-1">
              {node.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded mr-1 mb-1">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-2">
              <p className="line-clamp-3">{node.description}</p>
            </div>

            {!isDragging && (
              <div className="mt-2 text-white/70 text-xs">
                {node.connections} connections • {node.dataPoints} data points
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

