"use client"

import { motion } from "framer-motion"
import type { NodeData } from "@/lib/types"

interface ConnectionLineProps {
  sourceNode: NodeData
  targetNode: NodeData
  sourcePoint: string
  targetPoint: string
}

export default function ConnectionLine({ sourceNode, targetNode, sourcePoint, targetPoint }: ConnectionLineProps) {
  // Calculate connection points
  const getPointCoordinates = (node: NodeData, pointId: string) => {
    switch (pointId) {
      case "top":
        return { x: node.x, y: node.y - node.height / 2 }
      case "right":
        return { x: node.x + node.width / 2, y: node.y }
      case "bottom":
        return { x: node.x, y: node.y + node.height / 2 }
      case "left":
        return { x: node.x - node.width / 2, y: node.y }
      default:
        return { x: node.x, y: node.y }
    }
  }

  const source = getPointCoordinates(sourceNode, sourcePoint)
  const target = getPointCoordinates(targetNode, targetPoint)

  // Calculate control points for curved lines
  const midX = (source.x + target.x) / 2
  const midY = (source.y + target.y) / 2

  // Add some curvature based on distance
  const distance = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2))

  const curveFactor = Math.min(distance / 4, 50)

  // Determine curve direction based on connection points
  let controlPoint1 = { x: midX, y: midY }
  let controlPoint2 = { x: midX, y: midY }

  if (sourcePoint === "top" || sourcePoint === "bottom") {
    controlPoint1 = {
      x: source.x,
      y: source.y + (sourcePoint === "top" ? -curveFactor : curveFactor),
    }
  } else {
    controlPoint1 = {
      x: source.x + (sourcePoint === "left" ? -curveFactor : curveFactor),
      y: source.y,
    }
  }

  if (targetPoint === "top" || targetPoint === "bottom") {
    controlPoint2 = {
      x: target.x,
      y: target.y + (targetPoint === "top" ? -curveFactor : curveFactor),
    }
  } else {
    controlPoint2 = {
      x: target.x + (targetPoint === "left" ? -curveFactor : curveFactor),
      y: target.y,
    }
  }

  // Create path for curved line
  const path = `
    M ${source.x} ${source.y}
    C ${controlPoint1.x} ${controlPoint1.y}, 
      ${controlPoint2.x} ${controlPoint2.y}, 
      ${target.x} ${target.y}
  `

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke={sourceNode.color}
        strokeWidth={2}
        strokeOpacity={0.6}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 0.5 }}
      />

      {/* Small circles at connection points */}
      <circle cx={source.x} cy={source.y} r={3} fill={sourceNode.color} />
      <circle cx={target.x} cy={target.y} r={3} fill={targetNode.color} />
    </g>
  )
}

