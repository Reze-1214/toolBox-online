"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

function generateUUID(): string {
  return crypto.randomUUID()
}

export default function UUIDGenerator() {
  const { t } = useT()
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const addUUID = useCallback(() => {
    setUuids((prev) => [...prev, generateUUID()])
  }, [])

  const addMultipleUUIDs = useCallback((count: number) => {
    setUuids((prev) => [...prev, ...Array.from({ length: count }, generateUUID)])
  }, [])

  const clearUUIDs = useCallback(() => {
    setUuids([])
    setCopiedIndex(null)
    setCopiedAll(false)
  }, [])

  useEffect(() => {
    queueMicrotask(() => addUUID())
  }, [])

  const handleCopySingle = useCallback(async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (uuids.length === 0) return
    try {
      await navigator.clipboard.writeText(uuids.join("\n"))
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  }, [uuids])

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">
          Generated UUIDs
        </Label>
        <span className="text-sm tabular-nums text-muted-foreground">
          {t('tool.uuid.uuidCount', { count: uuids.length })}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={addUUID}
          className="rounded-sm"
          size="sm"
        >
          {t('tool.uuid.generate')}
        </Button>
        <Button
          onClick={() => addMultipleUUIDs(10)}
          variant="outline"
          className="rounded-sm"
          size="sm"
        >
          {t('tool.uuid.generate10')}
        </Button>
        <Button
          onClick={handleCopyAll}
          variant="outline"
          className="rounded-sm"
          size="sm"
          disabled={uuids.length === 0}
        >
          {copiedAll ? t('tool.uuid.copiedAll') : t('tool.uuid.copyAll')}
        </Button>
        <Button
          onClick={clearUUIDs}
          variant="ghost"
          className="rounded-sm text-muted-foreground hover:text-foreground"
          size="sm"
          disabled={uuids.length === 0}
        >
          {t('tool.uuid.clear')}
        </Button>
      </div>

      {/* UUID list */}
      <div className="space-y-2">
        {uuids.length === 0 ? (
          <div className="flex items-center justify-center h-24 rounded-sm border border-dashed border-border text-sm text-muted-foreground">
            {t('tool.uuid.empty')}
          </div>
        ) : (
          uuids.map((uuid, index) => (
            <div
              key={`${uuid}-${index}`}
              className="flex items-center gap-2 rounded-sm border border-border bg-muted/30 px-3 py-2.5"
            >
              <span className="flex-1 font-mono text-sm break-all select-all leading-relaxed">
                {uuid}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopySingle(uuid, index)}
                className={cn(
                  "rounded-sm shrink-0 tabular-nums",
                  copiedIndex === index && "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {copiedIndex === index ? t('shared.copied') : t('shared.copy')}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}