"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

function getJsonDepth(value: unknown, current = 0): number {
  if (value === null || typeof value !== "object") {
    return current
  }
  if (Array.isArray(value)) {
    return value.length === 0
      ? current + 1
      : Math.max(...value.map((item) => getJsonDepth(item, current + 1)))
  }
  const entries = Object.values(value as Record<string, unknown>)
  return entries.length === 0
    ? current + 1
    : Math.max(...entries.map((v) => getJsonDepth(v, current + 1)))
}

function computeStats(json: string): {
  lines: number
  bytes: number
  depth: number
} | null {
  if (!json.trim()) return null
  try {
    const parsed = JSON.parse(json)
    const lines = json.split("\n").length
    const bytes = new TextEncoder().encode(json).length
    const depth = getJsonDepth(parsed)
    return { lines, bytes, depth }
  } catch {
    return null
  }
}

export default function JsonFormatter() {
  const { t } = useT()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const processJson = useCallback(
    (mode: "format" | "minify") => {
      setError("")
      setOutput("")
      setCopied(false)

      const trimmed = input.trim()
      if (!trimmed) return

      try {
        const parsed = JSON.parse(trimmed)
        const result =
          mode === "format"
            ? JSON.stringify(parsed, null, 2)
            : JSON.stringify(parsed)
        setOutput(result)
      } catch (err) {
        setError(
          err instanceof SyntaxError
            ? err.message
            : t('tool.json.invalid')
        )
      }
    },
    [input, t]
  )

  const handleCopy = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  }, [output])

  const inputStats = computeStats(input)
  const outputStats = computeStats(output)

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => processJson("format")}
          disabled={!input.trim()}
          className="rounded-sm"
        >
          {t('tool.json.format')}
        </Button>
        <Button
          variant="outline"
          onClick={() => processJson("minify")}
          disabled={!input.trim()}
          className="rounded-sm"
        >
          {t('tool.json.minify')}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!output}
          className="rounded-sm"
        >
          {copied ? t('shared.copied') : t('tool.json.copy')}
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input column */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('tool.json.input')}
          </Label>
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError("")
            }}
            placeholder={t('tool.json.inputPlaceholder')}
            className={cn(
              "rounded-sm font-mono text-sm min-h-64 resize-y",
              error && "border-destructive focus-visible:border-destructive"
            )}
          />
          {error && (
            <p className="text-sm text-destructive leading-snug">{error}</p>
          )}
          {inputStats && (
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{inputStats.lines} {t('tool.json.lines')}</span>
              <span>{inputStats.bytes} {t('tool.json.bytes')}</span>
              <span>{t('tool.json.depth')} {inputStats.depth}</span>
            </div>
          )}
        </div>

        {/* Output column */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('tool.json.output')}
          </Label>
          <Textarea
            value={output}
            readOnly
            placeholder=""
            className="rounded-sm font-mono text-sm min-h-64 resize-y bg-muted/30"
          />
          {outputStats && (
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{outputStats.lines} {t('tool.json.lines')}</span>
              <span>{outputStats.bytes} {t('tool.json.bytes')}</span>
              <span>{t('tool.json.depth')} {outputStats.depth}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}