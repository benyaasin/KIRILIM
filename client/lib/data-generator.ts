import type { NodeData, ConnectionData } from "./types"

// Color palette
const colors = [
  { bg: "#3b82f6", border: "#2563eb" }, // Blue
  { bg: "#8b5cf6", border: "#7c3aed" }, // Purple
  { bg: "#ec4899", border: "#db2777" }, // Pink
  { bg: "#10b981", border: "#059669" }, // Green
  { bg: "#f59e0b", border: "#d97706" }, // Amber
  { bg: "#ef4444", border: "#dc2626" }, // Red
]

// Node titles
const nodeTitles = [
  "Data Processing",
  "User Analytics",
  "API Gateway",
  "Authentication",
  "Storage Service",
  "Machine Learning",
  "Content Delivery",
  "Payment Processing",
  "Notification System",
  "Search Engine",
  "Recommendation Engine",
  "User Management",
]

// Node subtitles
const nodeSubtitles = [
  "Core System Component",
  "User-Facing Service",
  "Backend Infrastructure",
  "Security Module",
  "Data Pipeline",
  "Analytics Platform",
  "Integration Service",
  "Monitoring System",
]

// Tags
const allTags = [
  "high-priority",
  "critical",
  "scalable",
  "secure",
  "optimized",
  "legacy",
  "new",
  "experimental",
  "stable",
  "deprecated",
  "v2",
  "beta",
]

// Generate random nodes
export function generateInitialNodes(containerWidth: number, containerHeight: number): NodeData[] {
  const nodes: NodeData[] = []
  const nodeCount = 8

  // Define specific starting points for some nodes
  const startingPoints = [
    { x: containerWidth * 0.2, y: containerHeight * 0.3 },
    { x: containerWidth * 0.8, y: containerHeight * 0.3 },
    { x: containerWidth * 0.5, y: containerHeight * 0.7 },
  ]

  for (let i = 0; i < nodeCount; i++) {
    const colorIndex = i % colors.length
    const { bg, border } = colors[colorIndex]

    // Determine if this is a starting point node
    const isStartingPoint = i < startingPoints.length

    // Position: either use a starting point or random position
    const x = isStartingPoint ? startingPoints[i].x : Math.random() * (containerWidth * 0.8) + containerWidth * 0.1

    const y = isStartingPoint ? startingPoints[i].y : Math.random() * (containerHeight * 0.8) + containerHeight * 0.1

    // Generate random tags (2-4 tags)
    const tagCount = Math.floor(Math.random() * 3) + 2
    const tags: string[] = []
    for (let j = 0; j < tagCount; j++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)]
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    // Generate random connections and data points
    const connections = Math.floor(Math.random() * 15) + 5
    const dataPoints = Math.floor(Math.random() * 1000) + 100

    // Create node
    nodes.push({
      id: i + 1,
      x,
      y,
      width: 180,
      height: 100,
      title: nodeTitles[i % nodeTitles.length],
      subtitle: nodeSubtitles[Math.floor(Math.random() * nodeSubtitles.length)],
      description:
        "This node represents a system component with specific functionality and data processing capabilities. It connects to other nodes to form a complete workflow.",
      tags,
      color: bg,
      borderColor: border,
      connections,
      dataPoints,
      isStartingPoint,
    })
  }

  return nodes
}

// Generate connections between nodes
export function generateConnections(nodes: NodeData[]): ConnectionData[] {
  const connections: ConnectionData[] = []
  const connectionPoints = ["top", "right", "bottom", "left"]

  // Create connections between nodes
  for (let i = 0; i < nodes.length; i++) {
    // Each node connects to 1-3 other nodes
    const connectionCount = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < connectionCount; j++) {
      // Find a target node that isn't the current node
      let targetIndex = Math.floor(Math.random() * nodes.length)
      while (targetIndex === i) {
        targetIndex = Math.floor(Math.random() * nodes.length)
      }

      // Select random connection points
      const sourcePoint = connectionPoints[Math.floor(Math.random() * connectionPoints.length)]
      const targetPoint = connectionPoints[Math.floor(Math.random() * connectionPoints.length)]

      // Create connection
      connections.push({
        sourceId: nodes[i].id,
        targetId: nodes[targetIndex].id,
        sourcePoint,
        targetPoint,
      })
    }
  }

  return connections
}

