"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bell, RefreshCw, Search, User, ZoomIn, ZoomOut, Sun, Moon } from "lucide-react"
import StoryCanvas from "@/components/story-canvas"
import StoryCard from "@/components/story-card"
import StatsChart from "@/components/stats-chart"
import Logo from "@/components/logo"
import CreateStoryModal from "@/components/create-story-modal"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const canvasRef = useRef<any>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { toast } = useToast()

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleHighlightNode = (nodeId: number) => {
    if (canvasRef.current && canvasRef.current.highlightNodeFromStory) {
      canvasRef.current.highlightNodeFromStory(nodeId)
    }
  }

  const handleZoomIn = () => {
    if (canvasRef.current && canvasRef.current.zoomIn) {
      canvasRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (canvasRef.current && canvasRef.current.zoomOut) {
      canvasRef.current.zoomOut()
    }
  }

  const handleReset = () => {
    if (canvasRef.current && canvasRef.current.resetMap) {
      canvasRef.current.resetMap()
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleCreateStory = (storyData: any) => {
    // In a real app, this would send data to an API
    console.log("Creating new story:", storyData)

    // Add the story to the canvas
    if (canvasRef.current && canvasRef.current.addNode) {
      // Calculate random position for the new node
      const x = Math.random() * 800 + 100
      const y = Math.random() * 400 + 100

      const newNodeId = canvasRef.current.addNode({
        x,
        y,
        content: storyData.title,
        author: storyData.author,
        connections: storyData.connections,
        location: storyData.location,
        color: storyData.color,
        storyExcerpt: storyData.content,
      })

      // Show success message
      toast({
        title: "Hikaye başarıyla oluşturuldu!",
        description: "Hikayeniz artık ağda görünür durumda.",
      })

      // Close the modal
      setIsCreateModalOpen(false)

      // Focus on the new node
      setTimeout(() => {
        canvasRef.current.highlightNodeFromStory(newNodeId)
      }, 500)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <nav className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsCreateModalOpen(true)}>Hikaye Başlat</Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className={`h-5 w-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
              </Button>
              <Link href="/login">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className={`h-5 w-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Kırılım</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input type="text" placeholder="Hikayelerde ara..." className="pl-10 pr-4 py-2 w-64" />
              </div>
            </div>

            <div className="flex items-center justify-end mb-4 space-x-4">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Tema Değiştir</span>
              </Button>
            </div>

            <div
              className={`w-full h-[600px] ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} rounded-lg relative transition-colors duration-300`}
            >
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white dark:bg-gray-700"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                  <span className="sr-only">Yakınlaştır</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white dark:bg-gray-700"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                  <span className="sr-only">Uzaklaştır</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white dark:bg-gray-700"
                  onClick={handleReset}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Sıfırla</span>
                </Button>
              </div>

              <div className="absolute bottom-4 left-4 z-10 bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-md text-xs text-gray-600 dark:text-gray-300 backdrop-blur-sm">
                <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 mr-1">
                  Ctrl
                </kbd>
                <span>tuşuna basılı tutarak haritayı 3 boyutlu hareket ettirebilirsiniz</span>
              </div>

              <StoryCanvas ref={canvasRef} isDarkMode={isDarkMode} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Popüler Hikayeler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StoryCard
                title="Gizemli Orman"
                author="@zeynepyazar"
                description="Ormanda kaybolan bir grup arkadaşın, gizemli yaratıklarla karşılaşması ve hayatta kalma mücadelesi..."
                connections={324}
                authors={128}
                color="primary"
                nodeId={1}
                onHighlightNode={handleHighlightNode}
              />

              <StoryCard
                title="Kayıp Şehir"
                author="@ahmetyilmaz"
                description="Antik bir medeniyetin izlerini takip eden arkeologların, boyutlar arası bir kapı keşfetmesiyle başlayan macera..."
                connections={256}
                authors={96}
                color="secondary"
                nodeId={2}
                onHighlightNode={handleHighlightNode}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Son Eklenenler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StoryCard
                title="Zaman Yolcusu"
                author="@elifdemir"
                description="2150 yılından gelen bir mektupla başlayan, zamanlar arası bir aşk hikayesi..."
                time="15 dakika önce"
                connections={42}
                color="primary"
                nodeId={3}
                onHighlightNode={handleHighlightNode}
              />

              <StoryCard
                title="Paralel Evren"
                author="@canözturk"
                description="Kuantum fiziği deneyi sırasında açılan bir portalın, paralel evrenleri birbirine bağlaması..."
                time="1 saat önce"
                connections={28}
                color="secondary"
                nodeId={4}
                onHighlightNode={handleHighlightNode}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-semibold text-primary">1,284</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Aktif Hikaye</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-semibold text-secondary">3,642</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Toplam Yazar</div>
                </div>
              </div>

              <StatsChart />
            </CardContent>
          </Card>
        </div>
      </main>

      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateStory={handleCreateStory}
      />
    </div>
  )
}

