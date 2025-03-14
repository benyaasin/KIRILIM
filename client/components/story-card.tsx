"use client"

import { Card } from "@/components/ui/card"

interface StoryCardProps {
  title: string
  author: string
  description: string
  connections: number
  authors?: number
  time?: string
  color: "primary" | "secondary"
  nodeId?: number
  onHighlightNode?: (nodeId: number) => void
}

export default function StoryCard({
  title,
  author,
  description,
  connections,
  authors,
  time,
  color,
  nodeId,
  onHighlightNode,
}: StoryCardProps) {
  const handleClick = () => {
    if (nodeId && onHighlightNode) {
      onHighlightNode(nodeId)
    }
  }

  return (
    <Card
      className={`p-4 border border-gray-100 hover:bg-gray-50 transition-colors ${nodeId ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-2 h-2 rounded-full bg-${color} mt-2`}></div>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-500 mb-2">{author}</p>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex items-center space-x-4 mt-2">
            {time && <span className="text-xs text-gray-500">{time}</span>}
            <span className="text-xs text-gray-500">{connections} Bağlantı</span>
            {authors && <span className="text-xs text-gray-500">{authors} Yazar</span>}
          </div>
        </div>
      </div>
    </Card>
  )
}

