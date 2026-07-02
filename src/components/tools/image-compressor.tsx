"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

interface ImageInfo {
  file: File
  name: string
  size: number
  width: number
  height: number
  url: string
}

interface CompressedInfo {
  blob: Blob
  size: number
  width: number
  height: number
  url: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getOutputMimeType(file: File, quality: number): string {
  // GIF and PNG don't support quality-based compression via canvas toDataURL,
  // so we convert them to JPEG/WebP. Keep PNG as-is when quality is 100.
  if (file.type === "image/gif") {
    return quality >= 100 ? "image/png" : "image/webp"
  }
  if (file.type === "image/png") {
    return quality >= 100 ? "image/png" : "image/webp"
  }
  // JPEG and WebP — keep as JPEG
  return "image/jpeg"
}

function getOutputExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg"
    case "image/webp":
      return ".webp"
    case "image/png":
      return ".png"
    default:
      return ".jpg"
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}

export default function ImageCompressor() {
  const { t } = useT()
  const [original, setOriginal] = useState<ImageInfo | null>(null)
  const [compressed, setCompressed] = useState<CompressedInfo | null>(null)
  const [quality, setQuality] = useState(75)
  const [maxWidth, setMaxWidth] = useState("")
  const [maxHeight, setMaxHeight] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]
  const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.gif"

  const handleFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return
    }

    // Revoke previous URLs
    if (original?.url) URL.revokeObjectURL(original.url)
    if (compressed?.url) URL.revokeObjectURL(compressed.url)

    const img = await loadImage(file)
    const url = URL.createObjectURL(file)

    setOriginal({
      file,
      name: file.name,
      size: file.size,
      width: img.naturalWidth,
      height: img.naturalHeight,
      url,
    })
    setCompressed(null)
  }, [original, compressed])

  const compressImage = useCallback(async () => {
    if (!original) return

    setIsProcessing(true)
    try {
      const img = await loadImage(original.file)
      const canvas = canvasRef.current || document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let targetW = img.naturalWidth
      let targetH = img.naturalHeight

      const maxW = maxWidth ? parseInt(maxWidth, 10) : 0
      const maxH = maxHeight ? parseInt(maxHeight, 10) : 0

      if (maxW > 0 || maxH > 0) {
        if (maxW > 0 && targetW > maxW) {
          const ratio = maxW / targetW
          targetW = maxW
          targetH = Math.round(targetH * ratio)
        }
        if (maxH > 0 && targetH > maxH) {
          const ratio = maxH / targetH
          targetH = maxH
          targetW = Math.round(targetW * ratio)
        }
      }

      targetW = Math.max(1, targetW)
      targetH = Math.max(1, targetH)

      canvas.width = targetW
      canvas.height = targetH
      ctx.clearRect(0, 0, targetW, targetH)
      ctx.drawImage(img, 0, 0, targetW, targetH)

      const mimeType = getOutputMimeType(original.file, quality)
      const qualityParam = quality / 100

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error("Compression failed"))
          },
          mimeType,
          qualityParam
        )
      })

      if (compressed?.url) URL.revokeObjectURL(compressed.url)

      setCompressed({
        blob,
        size: blob.size,
        width: targetW,
        height: targetH,
        url: URL.createObjectURL(blob),
      })
    } catch {
      // Compression may fail for certain formats
    } finally {
      setIsProcessing(false)
    }
  }, [original, quality, maxWidth, maxHeight, compressed])

  const handleDownload = useCallback(() => {
    if (!compressed || !original) return

    const mimeType = getOutputMimeType(original.file, quality)
    const ext = getOutputExtension(mimeType)
    const baseName = original.name.replace(/\.[^.]+$/, "")
    const fileName = `${baseName}-compressed${ext}`

    const link = document.createElement("a")
    link.href = compressed.url
    link.download = fileName
    link.click()
  }, [compressed, original, quality])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset so re-selecting the same file works
      e.target.value = ""
    },
    [handleFile]
  )

  const handleReset = useCallback(() => {
    if (original?.url) URL.revokeObjectURL(original.url)
    if (compressed?.url) URL.revokeObjectURL(compressed.url)
    setOriginal(null)
    setCompressed(null)
    setMaxWidth("")
    setMaxHeight("")
  }, [original, compressed])

  const compressionRatio = original && compressed
    ? Math.round((1 - compressed.size / original.size) * 100)
    : 0
  const savingsPositive = compressionRatio > 0

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Hidden canvas & file input */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Drop zone */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Image
        </Label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed p-8 text-muted-foreground transition-colors cursor-pointer",
            "hover:border-foreground/30 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragging && "border-primary bg-primary/5 text-primary",
            original && "border-solid border-border p-4"
          )}
        >
          {original ? (
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={original.url}
                  alt={original.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">
                  {original.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {original.width} × {original.height} &middot;{" "}
                  {formatBytes(original.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleReset()
                }}
                className="shrink-0 text-xs text-muted-foreground hover:text-foreground rounded-sm"
              >
                Change
              </Button>
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {t('tool.img.dropzone')}
                </p>
                <p className="text-xs mt-1">
                  {t('tool.img.dropzoneSubtext')}
                </p>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Controls */}
      {original && (
        <>
          {/* Quality slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                {t('tool.img.quality')}
              </Label>
              <span className="text-sm tabular-nums text-muted-foreground">
                {quality}%
              </span>
            </div>
            <Slider
              value={[quality]}
              min={1}
              max={100}
              step={1}
              onValueChange={(v) => setQuality(v[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Lower quality means smaller file size. PNG and GIF will be
              converted to WebP when quality is below 100%.
            </p>
          </div>

          {/* Max dimensions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t('tool.img.maxDimensions')}{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="max-width" className="text-xs text-muted-foreground">
                  {t('tool.img.width')}
                </Label>
                <Input
                  id="max-width"
                  type="number"
                  min={1}
                  placeholder={t('tool.img.auto')}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  className="rounded-sm"
                />
              </div>
              <span className="text-muted-foreground text-sm mt-5">×</span>
              <div className="flex-1 space-y-1">
                <Label htmlFor="max-height" className="text-xs text-muted-foreground">
                  {t('tool.img.height')}
                </Label>
                <Input
                  id="max-height"
                  type="number"
                  min={1}
                  placeholder={t('tool.img.auto')}
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                  className="rounded-sm"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave blank to keep original dimensions. Aspect ratio is
              preserved when resizing.
            </p>
          </div>

          {/* Compress button */}
          <Button
            onClick={compressImage}
            disabled={isProcessing}
            className="w-full rounded-sm"
          >
            {isProcessing ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Compressing…
              </>
            ) : (
              "Compress Image"
            )}
          </Button>

          {/* Results */}
          {compressed && (
            <div className="space-y-4">
              {/* Before / after comparison */}
              <div className="rounded-sm border p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Comparison
                </p>

                <div className="space-y-3">
                  {/* Original */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('tool.img.original')}</span>
                    <div className="text-right">
                      <span className="font-medium tabular-nums">
                        {formatBytes(original.size)}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {original.width} × {original.height}
                      </span>
                    </div>
                  </div>

                  {/* Compressed */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('tool.img.compressed')}</span>
                    <div className="text-right">
                      <span className="font-medium tabular-nums">
                        {formatBytes(compressed.size)}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {compressed.width} × {compressed.height}
                      </span>
                    </div>
                  </div>

                  {/* Ratio bar */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tool.img.savings')}</span>
                      <span
                        className={cn(
                          "font-medium tabular-nums",
                          savingsPositive
                            ? "text-green-600 dark:text-green-400"
                            : "text-orange-600 dark:text-orange-400"
                        )}
                      >
                        {savingsPositive ? "−" : "+"}
                        {Math.abs(compressionRatio)}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={savingsPositive ? compressionRatio : 0}
                        className={cn(
                          "h-2 rounded-sm",
                          savingsPositive
                            ? "[&>[data-slot=progress-indicator]]:bg-green-600 dark:[&>[data-slot=progress-indicator]]:bg-green-400"
                            : "[&>[data-slot=progress-indicator]]:bg-orange-600 dark:[&>[data-slot=progress-indicator]]:bg-orange-400"
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
                      <span>
                        {formatBytes(original.size)}
                      </span>
                      <span>
                        Saved{" "}
                        {savingsPositive
                          ? formatBytes(original.size - compressed.size)
                          : formatBytes(compressed.size - original.size)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview thumbnails */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-sm border p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t('tool.img.original')}
                  </p>
                  <div className="aspect-video rounded-sm bg-muted/50 flex items-center justify-center overflow-hidden">
                    <img
                      src={original.url}
                      alt={t('tool.img.original')}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                <div className="rounded-sm border p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t('tool.img.compressed')}
                  </p>
                  <div className="aspect-video rounded-sm bg-muted/50 flex items-center justify-center overflow-hidden">
                    <img
                      src={compressed.url}
                      alt={t('tool.img.compressed')}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Download button */}
              <Button
                variant="outline"
                onClick={handleDownload}
                className="w-full rounded-sm gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('tool.img.download')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}