export interface NodeData {
  id: number
  x: number
  y: number
  width: number
  height: number
  title: string
  subtitle: string
  description: string
  tags: string[]
  color: string
  borderColor?: string
  connections: number
  dataPoints: number
  isStartingPoint?: boolean
}

export interface ConnectionData {
  sourceId: number
  targetId: number
  sourcePoint: string
  targetPoint: string
}

