"use client"

import { motion } from "framer-motion"
import { useState, useRef } from "react"
import type { NodeData } from "@/lib/types"
import NodeContent from "@/components/node-content"
import ConnectionPoint from "@/components/connection-point"

interface NodeProps {
  node: NodeData
  isHovered: boolean
  onPositionChange: (id: number, x: number, y: number) => void
  onHover: (id: number | null) => void
  containerSize: { width: number; height: number }
}

export default function Node({ node, isHovered, onPositionChange, onHover, containerSize }: NodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate connection points positions
  const connectionPoints = [
    { id: "top", x: node.width / 2, y: 0 },
    { id: "right", x: node.width, y: node.height / 2 },
    { id: "bottom", x: node.width / 2, y: node.height },
    { id: "left", x: 0, y: node.height / 2 },
  ]

  return (
    <motion.div
      ref={nodeRef}
      className={`absolute rounded-lg shadow-md overflow-hidden transition-shadow duration-200 ${
        isHovered ? "shadow-lg z-10" : "z-1"
      } ${isDragging ? "cursor-grabbing z-20" : "cursor-grab"}`}
      style={{
        width: node.width,
        height: node.height,
        backgroundColor: node.color,
        border: `2px solid ${node.borderColor || node.color}`,
        x: node.x - node.width / 2,
        y: node.y - node.height / 2,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: -node.x + node.width / 2,
        right: containerSize.width - node.x - node.width / 2,
        top: -node.y + node.height / 2,
        bottom: containerSize.height - node.y - node.height / 2,
      }}
      onDragStart={() => {
        setIsDragging(true)
        onHover(node.id)
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false)
        onPositionChange(node.id, node.x + info.offset.x, node.y + info.offset.y)
      }}
      onHoverStart={() => onHover(node.id)}
      onHoverEnd={() => !isDragging && onHover(null)}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05 }}
    >
      {/* Connection points */}
      {connectionPoints.map((point) => (
        <ConnectionPoint key={point.id} position={point} isVisible={isHovered || isDragging} />
      ))}

      {/* Node content */}
      <NodeContent node={node} isHovered={isHovered} isDragging={isDragging} />
    </motion.div>
  )
}

