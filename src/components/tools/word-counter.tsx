"use client"

import { useMemo, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

interface StatCardProps {
  label: string
  value: number | string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-start justify-center rounded-sm border border-border bg-muted/30 px-3 py-3">
      <span className="text-xs font-medium text-muted-foreground leading-none">
        {label}
      </span>
      <span className="mt-1.5 text-lg font-semibold tabular-nums leading-none text-foreground">
        {value}
      </span>
    </div>
  )
}

function computeStats(text: string) {
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/)
  const wordCount = words.length

  const charWithSpaces = text.length
  const charWithoutSpaces = text.replace(/\s/g, "").length

  const sentences =
    text.trim() === ""
      ? 0
      : text
          .split(/[.!?]+/)
          .filter((s) => s.trim().length > 0).length

  const paragraphs =
    text.trim() === ""
      ? 0
      : text
          .split(/\n\s*\n/)
          .filter((p) => p.trim().length > 0).length ||
        (text.trim().length > 0 ? 1 : 0)

  const avgWordLength =
    wordCount === 0 ? 0 : words.reduce((sum, w) => sum + w.length, 0) / wordCount

  return {
    words: wordCount,
    charWithSpaces,
    charWithoutSpaces,
    sentences,
    paragraphs,
    avgWordLength: avgWordLength.toFixed(1),
  }
}

export default function WordCounter() {
  const { t } = useT()
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => computeStats(text), [text])

  const handleClear = useCallback(() => {
    setText("")
    setCopied(false)
  }, [])

  const handleCopyStats = useCallback(async () => {
    const lines = [
      `${t('tool.wc.words')}: ${stats.words}`,
      `${t('tool.wc.chars')}: ${stats.charWithSpaces}`,
      `${t('tool.wc.charsNoSpace')}: ${stats.charWithoutSpaces}`,
      `${t('tool.wc.sentences')}: ${stats.sentences}`,
      `${t('tool.wc.paragraphs')}: ${stats.paragraphs}`,
      `${t('tool.wc.avgWordLen')}: ${stats.avgWordLength}`,
    ]

    try {
      await navigator.clipboard.writeText(lines.join("\n"))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  }, [stats, t])

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Textarea */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Enter or paste your text
        </Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('tool.wc.placeholder')}
          className="rounded-sm min-h-40 resize-y text-sm leading-relaxed"
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label={t('tool.wc.words')} value={stats.words} />
        <StatCard label={t('tool.wc.chars')} value={stats.charWithSpaces} />
        <StatCard label={t('tool.wc.charsNoSpace')} value={stats.charWithoutSpaces} />
        <StatCard label={t('tool.wc.sentences')} value={stats.sentences} />
        <StatCard label={t('tool.wc.paragraphs')} value={stats.paragraphs} />
        <StatCard label={t('tool.wc.avgWordLen')} value={stats.avgWordLength} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleCopyStats}
          variant="outline"
          className="rounded-sm"
          size="sm"
          disabled={text.trim() === ""}
        >
          {copied ? t('shared.copied') : t('tool.wc.copyStats')}
        </Button>
        <Button
          onClick={handleClear}
          variant="ghost"
          className="rounded-sm text-muted-foreground hover:text-foreground"
          size="sm"
          disabled={text === ""}
        >
          {t('tool.wc.clear')}
        </Button>
      </div>
    </div>
  )
}