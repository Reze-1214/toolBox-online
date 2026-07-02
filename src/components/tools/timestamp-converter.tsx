"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

function formatRelativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const absDiff = Math.abs(diff)
  const isFuture = diff < 0

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let relative: string
  if (seconds < 60) {
    relative = "just now"
  } else if (minutes < 60) {
    relative = `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else if (hours < 24) {
    relative = `${hours} hour${hours !== 1 ? "s" : ""}`
  } else if (days < 7) {
    relative = `${days} day${days !== 1 ? "s" : ""}`
  } else if (weeks < 5) {
    relative = `${weeks} week${weeks !== 1 ? "s" : ""}`
  } else if (months < 12) {
    relative = `${months} month${months !== 1 ? "s" : ""}`
  } else {
    relative = `${years} year${years !== 1 ? "s" : ""}`
  }

  if (relative === "just now") return relative
  return isFuture ? `in ${relative}` : `${relative} ago`
}

function toLocalISOString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function TimestampConverter() {
  const { t } = useT()
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(
    Math.floor(Date.now() / 1000)
  )
  const [copiedCurrent, setCopiedCurrent] = useState<string | null>(null)

  const [tsInput, setTsInput] = useState("")
  const [tsResult, setTsResult] = useState<{
    date: Date
    detectedUnit: "seconds" | "milliseconds"
  } | null>(null)
  const [tsCopied, setTsCopied] = useState<string | null>(null)

  const [dateInput, setDateInput] = useState("")
  const [dateResult, setDateResult] = useState<{
    seconds: number
    milliseconds: number
  } | null>(null)
  const [dateCopied, setdateCopied] = useState<string | null>(null)

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Handle timestamp to date conversion
  const handleTimestampConvert = useCallback((value: string) => {
    setTsInput(value)
    const trimmed = value.trim()
    if (!trimmed) {
      setTsResult(null)
      return
    }
    const num = Number(trimmed)
    if (isNaN(num) || !isFinite(num)) {
      setTsResult(null)
      return
    }
    const isMilliseconds = Math.abs(num) > 1e12
    const ms = isMilliseconds ? num : num * 1000
    const date = new Date(ms)
    if (isNaN(date.getTime())) {
      setTsResult(null)
      return
    }
    setTsResult({ date, detectedUnit: isMilliseconds ? "milliseconds" : "seconds" })
  }, [])

  // Handle date to timestamp conversion
  const handleDateConvert = useCallback((value: string) => {
    setDateInput(value)
    if (!value) {
      setDateResult(null)
      return
    }
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      setDateResult(null)
      return
    }
    setDateResult({
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    })
  }, [])

  const copyToClipboard = useCallback(
    async (text: string, key: string, setter: (v: string | null) => void) => {
      try {
        await navigator.clipboard.writeText(text)
        setter(key)
        setTimeout(() => setter(null), 2000)
      } catch {
        // Clipboard API may fail in non-secure contexts
      }
    },
    []
  )

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Section 1: Current Timestamp */}
      <section className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {t('tool.ts.current')}
        </Label>
        <div className="flex items-center gap-2 rounded-sm border border-border bg-muted/30 px-3 py-3 sm:py-4">
          <span className="flex-1 font-mono text-lg sm:text-xl tracking-tight select-all tabular-nums">
            {currentTimestamp}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              copyToClipboard(
                String(currentTimestamp),
                "current",
                setCopiedCurrent
              )
            }
            className={cn(
              "rounded-sm shrink-0",
              copiedCurrent === "current" &&
                "text-emerald-600 dark:text-emerald-400"
            )}
          >
            {copiedCurrent === "current" ? t('shared.copied') : "Copy"}
          </Button>
        </div>
      </section>

      <Separator />

      {/* Section 2: Timestamp to Date */}
      <section className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {t('tool.ts.tsToDate')}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            inputMode="numeric"
            placeholder={t('tool.ts.tsPlaceholder')}
            value={tsInput}
            onChange={(e) => handleTimestampConvert(e.target.value)}
            className="rounded-sm font-mono tabular-nums"
          />
        </div>

        {tsResult && (
          <div className="space-y-2 rounded-sm border border-border bg-muted/30 px-3 py-3">
            <div className="text-xs text-muted-foreground mb-1">
              {t('tool.ts.autoDetected', { type: t(tsResult.detectedUnit === 'seconds' ? 'tool.ts.seconds' : 'tool.ts.milliseconds') })}
            </div>
            {[
              {
                label: t('tool.ts.iso'),
                value: tsResult.date.toISOString(),
                copyKey: "iso",
              },
              {
                label: t('tool.ts.local'),
                value: toLocalISOString(tsResult.date),
                copyKey: "local",
              },
              {
                label: t('tool.ts.utc'),
                value: tsResult.date.toUTCString(),
                copyKey: "utc",
              },
              {
                label: t('tool.ts.relative'),
                value: formatRelativeTime(tsResult.date),
                copyKey: "relative",
              },
            ].map((item) => (
              <div
                key={item.copyKey}
                className="flex items-start gap-2 min-h-8"
              >
                <span className="text-sm text-muted-foreground shrink-0 pt-0.5 w-14">
                  {item.label}
                </span>
                <span className="flex-1 text-sm break-all select-all leading-relaxed font-mono tabular-nums">
                  {item.value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-sm shrink-0 h-7 px-2 text-xs",
                    tsCopied === item.copyKey &&
                      "text-emerald-600 dark:text-emerald-400"
                  )}
                  onClick={() =>
                    copyToClipboard(item.value, item.copyKey, setTsCopied)
                  }
                >
                  {tsCopied === item.copyKey ? t('shared.copied') : "Copy"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Section 3: Date to Timestamp */}
      <section className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {t('tool.ts.dateToTs')}
        </Label>
        <Input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => handleDateConvert(e.target.value)}
          className="rounded-sm font-mono tabular-nums"
        />
        {dateResult && (
          <div className="space-y-2 rounded-sm border border-border bg-muted/30 px-3 py-3">
            {[
              {
                label: t('tool.ts.seconds'),
                value: String(dateResult.seconds),
                copyKey: "sec",
              },
              {
                label: t('tool.ts.milliseconds'),
                value: String(dateResult.milliseconds),
                copyKey: "ms",
              },
            ].map((item) => (
              <div
                key={item.copyKey}
                className="flex items-center gap-2 min-h-8"
              >
                <span className="text-sm text-muted-foreground shrink-0 w-24">
                  {item.label}
                </span>
                <span className="flex-1 text-sm break-all select-all leading-relaxed font-mono tabular-nums">
                  {item.value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-sm shrink-0 h-7 px-2 text-xs",
                    dateCopied === item.copyKey &&
                      "text-emerald-600 dark:text-emerald-400"
                  )}
                  onClick={() =>
                    copyToClipboard(item.value, item.copyKey, setdateCopied)
                  }
                >
                  {dateCopied === item.copyKey ? t('shared.copied') : "Copy"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}