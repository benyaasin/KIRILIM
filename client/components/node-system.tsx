"use client"

import { useState, useRef, useEffect } from "react"
import Node from "@/components/node"
import ConnectionLine from "@/components/connection-line"
import type { NodeData, ConnectionData } from "@/lib/types"
import { generateInitialNodes, generateConnections } from "@/lib/data-generator"

export default function NodeSystem() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [connections, setConnections] = useState<ConnectionData[]>([])
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // Initialize nodes and connections
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current
      setContainerSize({ width: clientWidth, height: clientHeight })

      const initialNodes = generateInitialNodes(clientWidth, clientHeight)
      setNodes(initialNodes)

      const initialConnections = generateConnections(initialNodes)
      setConnections(initialConnections)
    }
  }, [])

  // Update node position
  const updateNodePosition = (id: number, x: number, y: number) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === id ? { ...node, x, y } : node)))
  }

  // Handle node hover
  const handleNodeHover = (id: number | null) => {
    setHoveredNode(id)
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-50 overflow-hidden">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections.map((connection) => {
          const sourceNode = nodes.find((node) => node.id === connection.sourceId)
          const targetNode = nodes.find((node) => node.id === connection.targetId)

          if (!sourceNode || !targetNode) return null

          return (
            <ConnectionLine
              key={`${connection.sourceId}-${connection.targetId}`}
              sourceNode={sourceNode}
              targetNode={targetNode}
              sourcePoint={connection.sourcePoint}
              targetPoint={connection.targetPoint}
            />
          )
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isHovered={hoveredNode === node.id}
          onPositionChange={updateNodePosition}
          onHover={handleNodeHover}
          containerSize={containerSize}
        />
      ))}
    </div>
  )
}

