"use client"

import type React from "react"
import { useState } from "react"
import { ProgressiveImg } from "jazz-react"
import { createImage } from "jazz-browser-media-images"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import type { ImageDefinition, Group, Account } from "jazz-tools"

interface ImageUploaderProps {
  image: ImageDefinition | null | undefined
  onImageChange: (image: ImageDefinition) => void
  owner: Group | Account
}

export function ImageUploader({ image, onImageChange, owner }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const newImage = await createImage(file, { owner })
      onImageChange(newImage)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <div className="space-y-3 sm:space-y-4">
          <Label htmlFor="image-upload">Image</Label>

          {image && (
            <div className="mb-3 sm:mb-4 flex justify-center">
              <ProgressiveImg image={image} maxWidth={256}>
                {({ src }) => (
                  <img
                    src={src || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md border"
                  />
                )}
              </ProgressiveImg>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <Button
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="w-full h-12 sm:h-10"
            >
              <Upload className="h-4 w-4 mr-2" />
              {image ? "Change Image" : "Upload Image"}
            </Button>
          </div>

          {isUploading && <div className="text-sm text-muted-foreground">Uploading...</div>}
        </div>
      </CardContent>
    </Card>
  )
}

