"use client"

import type React from "react"

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { motion } from "framer-motion"
import { MapPin, User, LinkIcon } from "lucide-react"

interface Node {
  id: number
  x: number
  y: number
  size: number
  content: string
  author: string
  connections: number
  location: string
  color?: string
  storyExcerpt?: string
}

interface Connection {
  source: number
  target: number
}

interface StoryCanvasProps {
  isDarkMode: boolean
}

const StoryCanvas = forwardRef<any, StoryCanvasProps>(({ isDarkMode }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [scale, setScale] = useState(1)
  const [perspective, setPerspective] = useState(0)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [initialNodes, setInitialNodes] = useState<Node[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Expose functions to parent components
  useImperativeHandle(ref, () => ({
    highlightNodeFromStory: (nodeId: number) => {
      // Find the node
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      // Find all predecessor nodes (sources that connect to this node)
      const predecessorIds = connections.filter((conn) => conn.target === nodeId).map((conn) => conn.source)

      // Highlight the node and its predecessors
      setHighlightedNodes([nodeId, ...predecessorIds])

      // Also select the node to show its details
      setSelectedNode(node)

      // Center on this node
      focusOnNode(node)
    },
    zoomIn: () => {
      if (selectedNode) {
        focusOnNode(selectedNode)
      } else if (hoveredNode) {
        focusOnNode(hoveredNode)
      } else {
        setScale((prev) => Math.min(prev + 0.2, 2))
      }
    },
    zoomOut: () => {
      setScale((prev) => Math.max(prev - 0.2, 0.5))
      setPerspective((prev) => Math.min(prev + 10, 30))

      // Reset perspective after a delay
      setTimeout(() => {
        setPerspective((prev) => Math.max(prev - 5, 0))
      }, 500)
    },
    resetMap: () => {
      resetMapToInitial()
    },
    changeNodeColor: (nodeId: number, newColor: string) => {
      setNodes((prevNodes) => prevNodes.map((node) => (node.id === nodeId ? { ...node, color: newColor } : node)))
    },
    addNode: (newNode: Omit<Node, "id" | "size">) => {
      // Generate a new ID
      const newId = Math.max(...nodes.map((n) => n.id)) + 1

      // Calculate size based on connections
      const maxConnections = Math.max(...nodes.map((node) => node.connections))
      const minSize = 40
      const maxSize = 80
      const sizeRatio = newNode.connections / maxConnections
      const size = minSize + sizeRatio * (maxSize - minSize)

      // Create the new node
      const nodeToAdd: Node = {
        ...newNode,
        id: newId,
        size,
      }

      // Add to nodes state
      setNodes((prevNodes) => [...prevNodes, nodeToAdd])

      return newId
    },
    removeNode: (nodeId: number) => {
      // Remove the node
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId))

      // Also remove any connections to/from this node
      // This would be handled in a real app with proper data management
    },
    updateNode: (nodeId: number, updates: Partial<Node>) => {
      setNodes((prevNodes) => prevNodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)))
    },
  }))

  // Get container size on mount
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current
      setContainerSize({ width: clientWidth, height: clientHeight })
    }
  }, [])

  // Handle keyboard events for Ctrl key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(false)
        // Reset rotations when Ctrl is released
        setRotateX(0)
        setRotateY(0)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Handle mouse movement for 3D effect when Ctrl is pressed
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      if (isCtrlPressed && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate rotation based on mouse position relative to center
        const rotateYValue = ((e.clientX - centerX) / rect.width) * 20 // -10 to 10 degrees
        const rotateXValue = ((e.clientY - centerY) / rect.height) * -20 // 10 to -10 degrees (inverted)

        setRotateY(rotateYValue)
        setRotateX(rotateXValue)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isCtrlPressed])

  // Generate nodes with different starting positions and sizes based on connections
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return

    const storyExcerpts = [
      "Ormanın derinliklerinde, ağaçların arasından süzülen ışık huzmelerinin altında, beş arkadaş kaybolmuştu. Ses çıkarmadan ilerliyorlardı, çünkü bir şeyin onları takip ettiğini hissediyorlardı...",
      "Antik haritayı elinde tutan profesör, ekibine döndü ve 'Kayıp şehir tam burada olmalı' dedi. Kazı ekibi heyecanla çalışmaya başladı, ancak hiçbiri toprağın altında onları bekleyen sırrı tahmin edemezdi...",
      "2150 yılından gelen mektup, Elif'in hayatını sonsuza dek değiştirecekti. Zarfı açtığında, kendi el yazısıyla yazılmış olduğunu fark etti. Mektupta gelecekten gelen kendisi, geçmişi değiştirmesi gerektiğini söylüyordu...",
      "Kuantum laboratuvarındaki kaza, kimsenin beklemediği bir şeyi tetiklemişti. Odanın ortasında beliren portal, bilim ekibini şaşkına çevirmişti. Can, elini portala uzattığında, parmakları başka bir gerçekliğe değdi...",
      "Son savaşçı, kılıcını kınından çıkardı ve ufka baktı. Krallık yok olmuştu, geriye sadece o kalmıştı. İntikam yemini etti ve karanlık güçlerin peşine düştü...",
      "Gizli servis ajanı Deniz, son görevinin detaylarını içeren dosyayı açtı. Bu sefer hedef, dünyayı tehdit eden bir yapay zeka sistemiydi. Zamanı azdı ve başarısız olursa, insanlık büyük tehlike altındaydı...",
      "Savaş meydanında karşılaşan iki düşman, birbirlerine âşık olacaklarını hiç düşünmemişlerdi. Ayşe, düşman komutanın gözlerine baktığında, kalbinin hızla attığını hissetti. Bu yasak aşk, iki ülke arasındaki savaşı değiştirebilir miydi?...",
      "Kasabanın en eski evinin bodrumunda bulunan günlük, yüzyıllardır saklanan bir sırrı ortaya çıkardı. Cem, günlüğü okudukça, kendi ailesinin bu karanlık sırla bağlantısını keşfetti...",
      "Uzay gemisi, bilinmeyen bir gezegenin yörüngesine girdi. Kaptan Burcu, ekibine dönerek 'Hazır olun, iniyoruz' dedi. Hiçbiri, bu gezegende onları bekleyen yaşam formlarının, insanlığın kökeni hakkındaki gerçeği bilmiyordu...",
      "Arkeolog Ali, antik labirentin girişinde durdu ve derin bir nefes aldı. Efsaneye göre, labirentin merkezinde insanlığın en büyük hazinesi saklıydı. Ancak labirent, içine girenleri bir daha asla dışarı çıkarmıyordu...",
      "Rüya dedektifi Selin, başkalarının rüyalarına girebilen nadir insanlardan biriydi. Son vakası, sürekli aynı kabusla uyanan bir çocuktu. Selin, çocuğun rüyasına girdiğinde, bu kabusu yaratan karanlık varlıkla yüzleşmek zorunda kaldı...",
    ]

    const baseNodes: Node[] = [
      {
        id: 1,
        x: containerSize.width * 0.2,
        y: containerSize.height * 0.25,
        size: 0,
        content: "Gizemli Orman",
        author: "@zeynepyazar",
        connections: 324,
        location: "Fantastik",
        color: "#6366f1",
        storyExcerpt: storyExcerpts[0],
      },
      {
        id: 2,
        x: containerSize.width * 0.5,
        y: containerSize.height * 0.15,
        size: 0,
        content: "Kayıp Şehir",
        author: "@ahmetyilmaz",
        connections: 256,
        location: "Macera",
        color: "#4f46e5",
        storyExcerpt: storyExcerpts[1],
      },
      {
        id: 3,
        x: containerSize.width * 0.35,
        y: containerSize.height * 0.5,
        size: 0,
        content: "Zaman Yolcusu",
        author: "@elifdemir",
        connections: 156,
        location: "Bilim Kurgu",
        color: "#4338ca",
        storyExcerpt: storyExcerpts[2],
      },
      {
        id: 4,
        x: containerSize.width * 0.65,
        y: containerSize.height * 0.4,
        size: 0,
        content: "Paralel Evren",
        author: "@canözturk",
        connections: 142,
        location: "Bilim Kurgu",
        color: "#3730a3",
        storyExcerpt: storyExcerpts[3],
      },
      {
        id: 5,
        x: containerSize.width * 0.25,
        y: containerSize.height * 0.75,
        size: 0,
        content: "Son Savaşçı",
        author: "@mertyılmaz",
        connections: 128,
        location: "Aksiyon",
        color: "#312e81",
        storyExcerpt: storyExcerpts[4],
      },
      {
        id: 6,
        x: containerSize.width * 0.55,
        y: containerSize.height * 0.65,
        size: 0,
        content: "Gizli Görev",
        author: "@deniztekin",
        connections: 189,
        location: "Gerilim",
        color: "#1e3a8a",
        storyExcerpt: storyExcerpts[5],
      },
      {
        id: 7,
        x: containerSize.width * 0.8,
        y: containerSize.height * 0.25,
        size: 0,
        content: "Aşk ve Savaş",
        author: "@ayşedemir",
        connections: 145,
        location: "Romantik",
        color: "#1e40af",
        storyExcerpt: storyExcerpts[6],
      },
      {
        id: 8,
        x: containerSize.width * 0.85,
        y: containerSize.height * 0.5,
        size: 0,
        content: "Karanlık Sırlar",
        author: "@cemkaya",
        connections: 167,
        location: "Gizem",
        color: "#1d4ed8",
        storyExcerpt: storyExcerpts[7],
      },
      {
        id: 9,
        x: containerSize.width * 0.7,
        y: containerSize.height * 0.8,
        size: 0,
        content: "Yıldızlara Yolculuk",
        author: "@burcuaydın",
        connections: 167,
        location: "Bilim Kurgu",
        color: "#2563eb",
        storyExcerpt: storyExcerpts[8],
      },
      {
        id: 10,
        x: containerSize.width * 0.9,
        y: containerSize.height * 0.7,
        size: 0,
        content: "Antik Labirent",
        author: "@alitoprak",
        connections: 167,
        location: "Macera",
        color: "#3b82f6",
        storyExcerpt: storyExcerpts[9],
      },
      {
        id: 11,
        x: containerSize.width * 0.95,
        y: containerSize.height * 0.35,
        size: 0,
        content: "Rüya Avcısı",
        author: "@selinöz",
        connections: 167,
        location: "Fantastik",
        color: "#60a5fa",
        storyExcerpt: storyExcerpts[10],
      },
    ]

    // Calculate size based on connections
    const maxConnections = Math.max(...baseNodes.map((node) => node.connections))
    const minSize = 40
    const maxSize = 80

    const sizedNodes = baseNodes.map((node) => {
      const sizeRatio = node.connections / maxConnections
      const size = minSize + sizeRatio * (maxSize - minSize)
      return { ...node, size }
    })

    setNodes(sizedNodes)
    setInitialNodes(JSON.parse(JSON.stringify(sizedNodes)))
  }, [containerSize])

  const connections: Connection[] = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 1, target: 5 },
    { source: 1, target: 6 },
    { source: 2, target: 7 },
    { source: 3, target: 8 },
    { source: 4, target: 9 },
    { source: 5, target: 10 },
    { source: 6, target: 11 },
  ]

  const handleNodeClick = (node: Node) => {
    if (!isDragging) {
      setSelectedNode(node)

      // Find connected nodes (both source and target)
      const connectedNodeIds = connections
        .filter((conn) => conn.source === node.id || conn.target === node.id)
        .map((conn) => (conn.source === node.id ? conn.target : conn.source))

      // Highlight the clicked node and its connections
      setHighlightedNodes([node.id, ...connectedNodeIds])
    }
  }

  const closeModal = () => {
    setSelectedNode(null)
    setHighlightedNodes([])
  }

  const updateNodePosition = (id: number, x: number, y: number) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === id ? { ...node, x, y } : node)))
  }

  const clearHighlights = (e: React.MouseEvent) => {
    // Only clear if clicking directly on the background (not on a node)
    if (e.currentTarget === e.target && highlightedNodes.length > 0 && !isDragging) {
      setHighlightedNodes([])
    }
  }

  const focusOnNode = (node: Node) => {
    // Zoom in and center on the node
    setScale(1.5)

    // Calculate center offset
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      // Center the node
      setOffset({
        x: containerWidth / 2 - node.x,
        y: containerHeight / 2 - node.y,
      })
    }
  }

  const resetMapToInitial = () => {
    // Reset zoom and perspective
    setScale(1)
    setPerspective(0)
    setRotateX(0)
    setRotateY(0)
    setOffset({ x: 0, y: 0 })

    // Reset nodes to initial positions
    setNodes(JSON.parse(JSON.stringify(initialNodes)))

    // Clear selections
    setSelectedNode(null)
    setHoveredNode(null)
    setHighlightedNodes([])
  }

  // Available colors for node customization
  const availableColors = [
    "#6366f1", // Indigo
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
  ]

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={clearHighlights}
      style={{
        perspective: `${1000 - perspective * 20}px`,
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          scale,
          x: offset.x,
          y: offset.y,
          rotateX: `${perspective + rotateX}deg`,
          rotateY: `${rotateY}deg`,
          transformOrigin: "center center",
        }}
        drag
        dragMomentum={true}
        dragElastic={0.1}
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        onDragStart={(e) => {
          // Only allow dragging the map when clicking on the background
          if (e.target !== e.currentTarget) {
            e.stopPropagation()
          }
        }}
        onDragEnd={(e, info) => {
          // Update the offset state after dragging
          setOffset((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }))
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, index) => {
            const source = nodes.find((n) => n.id === conn.source)
            const target = nodes.find((n) => n.id === conn.target)

            if (!source || !target) return null

            const isHighlighted = highlightedNodes.includes(source.id) && highlightedNodes.includes(target.id)

            const isHovered = hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id)

            return (
              <motion.line
                key={index}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={
                  isHighlighted
                    ? "stroke-primary"
                    : isHovered
                      ? "stroke-secondary"
                      : "stroke-gray-200 dark:stroke-gray-700"
                }
                strokeWidth={isHighlighted ? "3" : isHovered ? "2.5" : "2"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: isHighlighted ? 1 : isHovered ? 0.8 : highlightedNodes.length > 0 ? 0.3 : 1,
                }}
                transition={{ duration: 1.5, delay: index * 0.1 }}
              />
            )
          })}
        </svg>

        {nodes.map((node) => {
          const isHighlighted = highlightedNodes.includes(node.id)
          const isHovered = hoveredNode?.id === node.id

          return (
            <motion.div
              key={node.id}
              className={`absolute rounded-full shadow-lg flex flex-col items-center justify-center cursor-move ${
                isHighlighted ? "ring-2 ring-offset-2 z-10" : ""
              } ${isHovered ? "z-20" : ""}`}
              style={{
                width: isHovered ? `${node.size * 1.8}px` : `${node.size}px`,
                height: isHovered ? `${node.size * 1.8}px` : `${node.size}px`,
                backgroundColor: `${node.color}${isHighlighted || isHovered ? "40" : "20"}`,
                borderColor: node.color,
                borderWidth: "2px",
                left: 0,
                top: 0,
                x: node.x - (isHovered ? (node.size * 1.8) / 2 : node.size / 2),
                y: node.y - (isHovered ? (node.size * 1.8) / 2 : node.size / 2),
                opacity: highlightedNodes.length > 0 && !isHighlighted ? 0.5 : 1,
                boxShadow: isHovered ? "0 0 20px rgba(0,0,0,0.3)" : "",
                overflow: "hidden",
                transition: "width 0.3s, height 0.3s, transform 0.3s, box-shadow 0.3s",
              }}
              drag
              dragMomentum={true}
              dragElastic={0.8}
              dragTransition={{
                bounceStiffness: 600,
                bounceDamping: 20,
              }}
              onDragStart={(e) => {
                e.stopPropagation()
                setIsDragging(true)
              }}
              onDragEnd={(e, info) => {
                setIsDragging(false)
                updateNodePosition(node.id, node.x + info.offset.x, node.y + info.offset.y)
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleNodeClick(node)
              }}
              onHoverStart={() => setHoveredNode(node)}
              onHoverEnd={() => setHoveredNode(null)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: node.id * 0.1 }}
              whileDrag={{ scale: 1.1, zIndex: 20 }}
            >
              <div
                className={`text-center p-2 w-full h-full flex flex-col items-center justify-center overflow-hidden ${isHovered ? "justify-start pt-3" : ""}`}
              >
                <div
                  className={`text-sm font-medium mb-1 dark:text-white text-center truncate w-full px-2 ${isHovered ? "text-base" : ""}`}
                  style={{ color: node.color }}
                >
                  {node.content}
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-300 truncate w-full px-2">{node.author}</div>

                {isHovered ? (
                  <>
                    <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2 opacity-50"></div>

                    <div className="text-xs flex items-center mt-1 w-full px-2 justify-center">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" style={{ color: node.color }} />
                      <span style={{ color: node.color }}>{node.location}</span>
                    </div>

                    <div className="text-xs mt-1 flex items-center w-full px-2 justify-center">
                      <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" style={{ color: node.color }} />
                      <span style={{ color: node.color }}>{node.connections} Bağlantı</span>
                    </div>

                    <div className="mt-2 px-3 text-xs text-center overflow-hidden" style={{ color: node.color }}>
                      <p className="line-clamp-3">{node.storyExcerpt}</p>
                    </div>

                    <div className="mt-2 flex flex-wrap justify-center gap-1 px-2">
                      {["Popüler", "Aktif", node.location].map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${node.color}30`,
                            color: node.color,
                            border: `1px solid ${node.color}50`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs flex items-center mt-1 truncate w-full px-2 justify-center">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" style={{ color: node.color }} />
                      <span className="truncate" style={{ color: node.color }}>
                        {node.location}
                      </span>
                    </div>
                    <div className="text-xs mt-1 flex items-center truncate w-full px-2 justify-center">
                      <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" style={{ color: node.color }} />
                      <span style={{ color: node.color }}>{node.connections}</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {selectedNode && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">{selectedNode.content}</h3>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={closeModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="text-gray-400 mr-2 h-4 w-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedNode.author}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-gray-400 mr-2 h-4 w-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedNode.location}</p>
                </div>
                <div className="flex items-center">
                  <LinkIcon className="text-gray-400 mr-2 h-4 w-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedNode.connections} Bağlantı</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedNode.storyExcerpt}</p>

              {/* Color selection for original author */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 dark:text-gray-200">Renk Seçimi</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        // In a real app, you would check if the current user is the author
                        // For demo purposes, we'll allow changing the color without checking
                        setNodes((prevNodes) =>
                          prevNodes.map((node) => (node.id === selectedNode.id ? { ...node, color } : node)),
                        )
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Not: Renk değişikliği sadece hikayenin ilk yazarı tarafından yapılabilir.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                <h4 className="text-sm font-medium mb-2 dark:text-gray-200">Bağlantılı Hikayeler</h4>
                <div className="space-y-2">
                  {connections
                    .filter((conn) => conn.source === selectedNode.id || conn.target === selectedNode.id)
                    .map((conn, index) => {
                      const connectedNode = nodes.find(
                        (n) => n.id === (conn.source === selectedNode.id ? conn.target : conn.source),
                      )
                      if (!connectedNode) return null
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: connectedNode.color }}
                            ></div>
                            <span className="text-sm dark:text-white">{connectedNode.content}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{connectedNode.author}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                  onClick={closeModal}
                >
                  Kapat
                </button>
                <button
                  className="px-4 py-2 text-sm text-white rounded-md"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  Hikayeye Katıl
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
})

StoryCanvas.displayName = "StoryCanvas"

export default StoryCanvas

