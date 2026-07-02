"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: "L", label: "L", description: "Low (~7%)" },
  { value: "M", label: "M", description: "Medium (~15%)" },
  { value: "Q", label: "Q", description: "Quartile (~25%)" },
  { value: "H", label: "H", description: "High (~30%)" },
]

const QR_SIZE = 280

export default function QrGenerator() {
  const { t } = useT()
  const [text, setText] = useState("")
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M")
  const [isEmpty, setIsEmpty] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const generateQr = useCallback(async (value: string, level: ErrorCorrectionLevel) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!value.trim()) {
      setIsEmpty(true)
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }

    setIsEmpty(false)

    try {
      await QRCode.toCanvas(canvas, value, {
        width: QR_SIZE,
        margin: 2,
        errorCorrectionLevel: level,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
    } catch {
      // QR generation may fail for very long strings — silently ignore
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      generateQr(text, errorLevel)
    }, 200)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [text, errorLevel, generateQr])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [isEmpty])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Input section */}
      <div className="space-y-2">
        <Label htmlFor="qr-input" className="text-sm font-medium text-foreground">
          {t('tool.qr.content')}
        </Label>
        <Textarea
          id="qr-input"
          placeholder={t('tool.qr.contentPlaceholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="rounded-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Supports URLs, plain text, emails, phone numbers, and more.
        </p>
      </div>

      {/* Error correction level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          {t('tool.qr.errorCorrection')}
        </Label>
        <div className="flex items-center gap-1.5">
          {ERROR_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              title={level.description}
              onClick={() => setErrorLevel(level.value)}
              className={cn(
                "inline-flex items-center justify-center rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                errorLevel === level.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Higher levels allow more damage but increase QR code density.
        </p>
      </div>

      {/* QR Code display */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-sm border p-4 bg-white",
            isEmpty ? "border-dashed border-border" : "border-border"
          )}
          style={{ minWidth: QR_SIZE + 32, minHeight: QR_SIZE + 32 }}
        >
          <canvas
            ref={canvasRef}
            width={QR_SIZE}
            height={QR_SIZE}
            className={cn(
              "max-w-full h-auto",
              isEmpty && "hidden"
            )}
          />
          {isEmpty && (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-30"
              >
                <rect x="3" y="3" width="7" height="7" rx="0.5" />
                <rect x="14" y="3" width="7" height="7" rx="0.5" />
                <rect x="3" y="14" width="7" height="7" rx="0.5" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" />
                <path d="M21 14h-3v3" />
                <path d="M21 21h-3v-3" />
              </svg>
              <span className="text-xs">{t('tool.qr.empty')}</span>
            </div>
          )}
        </div>

        {/* Download button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={isEmpty}
          className="rounded-sm gap-2"
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
          {t('tool.qr.downloadPng')}
        </Button>
      </div>
    </div>
  )
}