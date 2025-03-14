"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CreateStoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateStory: (storyData: any) => void
}

export default function CreateStoryModal({ isOpen, onClose, onCreateStory }: CreateStoryModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [color, setColor] = useState("#6366f1")

  const handleAddTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = () => {
    if (!title || !content || !location) return

    const storyData = {
      title,
      content,
      location,
      tags,
      color,
      author: "@kullanici", // In a real app, this would be the current user
      connections: 0, // New stories start with 0 connections
    }

    onCreateStory(storyData)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setLocation("")
    setTag("")
    setTags([])
    setColor("#6366f1")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const availableColors = [
    { value: "#6366f1", label: "Mor" },
    { value: "#8b5cf6", label: "Eflatun" },
    { value: "#ec4899", label: "Pembe" },
    { value: "#10b981", label: "Yeşil" },
    { value: "#f59e0b", label: "Turuncu" },
    { value: "#ef4444", label: "Kırmızı" },
    { value: "#06b6d4", label: "Mavi" },
    { value: "#14b8a6", label: "Turkuaz" },
  ]

  const locationOptions = [
    { value: "Fantastik", label: "Fantastik" },
    { value: "Bilim Kurgu", label: "Bilim Kurgu" },
    { value: "Macera", label: "Macera" },
    { value: "Romantik", label: "Romantik" },
    { value: "Gerilim", label: "Gerilim" },
    { value: "Gizem", label: "Gizem" },
    { value: "Aksiyon", label: "Aksiyon" },
    { value: "Korku", label: "Korku" },
    { value: "Tarih", label: "Tarih" },
    { value: "Distopya", label: "Distopya" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Yeni Hikaye Başlat</DialogTitle>
          <DialogDescription>
            Hikaye ağına yeni bir düğüm ekleyin. Hikayeniz diğer yazarlar tarafından devam ettirilebilir.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Hikaye Başlığı</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hikayenizin başlığını girin"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Hikaye Başlangıcı</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hikayenizin ilk paragrafını yazın..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500">
              Hikayenizin ilk birkaç cümlesi, diğer yazarların ilgisini çekmek için önemlidir.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Tür</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Renk</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="color" className="flex items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableColors.map((colorOption) => (
                    <SelectItem key={colorOption.value} value={colorOption.value}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colorOption.value }} />
                        {colorOption.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Etiketler</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Etiket ekleyin"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" size="icon" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !content || !location}>
            Hikayeyi Başlat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

