"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

export default function Base64Encoder() {
  const { t } = useT()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleEncode = useCallback(() => {
    setError("")
    setOutput("")
    setCopied(false)

    const trimmed = input
    if (!trimmed) return

    try {
      const encoded = btoa(unescape(encodeURIComponent(trimmed)))
      setOutput(encoded)
    } catch {
      setError("Failed to encode the input text.")
    }
  }, [input])

  const handleDecode = useCallback(() => {
    setError("")
    setOutput("")
    setCopied(false)

    const trimmed = input.trim()
    if (!trimmed) return

    try {
      const decoded = decodeURIComponent(escape(atob(trimmed)))
      setOutput(decoded)
    } catch {
      setError(t('tool.b64.invalidBase64'))
    }
  }, [input, t])

  const handleSwap = useCallback(() => {
    setError("")
    setCopied(false)
    setInput(output)
    setOutput(input)
  }, [input, output])

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

  const handleClear = useCallback(() => {
    setInput("")
    setOutput("")
    setError("")
    setCopied(false)
  }, [])

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleEncode}
          disabled={!input}
          className="rounded-sm"
        >
          {t('tool.b64.encode')}
        </Button>
        <Button
          variant="outline"
          onClick={handleDecode}
          disabled={!input.trim()}
          className="rounded-sm"
        >
          {t('tool.b64.decode')}
        </Button>
        <Button
          variant="outline"
          onClick={handleSwap}
          disabled={!input && !output}
          className="rounded-sm"
        >
          {t('tool.b64.swap')}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!output}
          className="rounded-sm"
        >
          {copied ? t('shared.copied') : t('tool.b64.copyOutput')}
        </Button>
        <Button
          variant="ghost"
          onClick={handleClear}
          disabled={!input && !output}
          className="rounded-sm"
        >
          {t('tool.b64.clear')}
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input column */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('tool.b64.input')}
          </Label>
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError("")
            }}
            placeholder={t('tool.b64.inputPlaceholder')}
            className={cn(
              "rounded-sm font-mono text-sm min-h-64 resize-y",
              error && "border-destructive focus-visible:border-destructive"
            )}
          />
          {input && (
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{input.length} {t('tool.b64.characters')}</span>
              <span>{new TextEncoder().encode(input).length} {t('tool.b64.bytes')}</span>
            </div>
          )}
        </div>

        {/* Output column */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('tool.b64.output')}
          </Label>
          <Textarea
            value={output}
            readOnly
            placeholder={t('tool.b64.outputPlaceholder')}
            className="rounded-sm font-mono text-sm min-h-64 resize-y bg-muted/30"
          />
          {error && (
            <p className="text-sm text-destructive leading-snug">{error}</p>
          )}
          {output && (
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{output.length} {t('tool.b64.characters')}</span>
              <span>{new TextEncoder().encode(output).length} {t('tool.b64.bytes')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}