"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const

type CharsetKey = keyof typeof CHAR_SETS

function generatePassword(
  length: number,
  options: Record<CharsetKey, boolean>
): string {
  const activeKeys = (Object.keys(CHAR_SETS) as CharsetKey[]).filter(
    (key) => options[key]
  )

  if (activeKeys.length === 0) return ""

  const pool = activeKeys.map((key) => CHAR_SETS[key]).join("")
  const poolLen = pool.length
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)

  // Guarantee at least one character from each selected set
  let password = activeKeys
    .map((key) => {
      const chars = CHAR_SETS[key]
      const rand = new Uint32Array(1)
      crypto.getRandomValues(rand)
      return chars[rand[0] % chars.length]
    })
    .join("")

  // Fill the rest randomly from the full pool
  for (let i = password.length; i < length; i++) {
    password += pool[array[i] % poolLen]
  }

  // Shuffle using Fisher-Yates
  const chars = password.split("")
  for (let i = chars.length - 1; i > 0; i--) {
    const rand = new Uint32Array(1)
    crypto.getRandomValues(rand)
    const j = rand[0] % (i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join("")
}

type Strength = "weak" | "medium" | "strong" | "veryStrong"

function getStrength(
  length: number,
  options: Record<CharsetKey, boolean>
): { label: Strength; percent: number; color: string } {
  const activeSets = (Object.keys(options) as CharsetKey[]).filter(
    (key) => options[key]
  ).length

  // Pool size estimation
  let poolSize = 0
  if (options.uppercase) poolSize += 26
  if (options.lowercase) poolSize += 26
  if (options.numbers) poolSize += 10
  if (options.symbols) poolSize += 26

  // Entropy bits = length * log2(poolSize)
  const entropy = poolSize > 0 ? length * Math.log2(poolSize) : 0

  if (activeSets === 0 || length < 8) {
    return { label: "weak", percent: 10, color: "bg-red-500" }
  }

  if (entropy < 40) {
    return { label: "weak", percent: 25, color: "bg-red-500" }
  }
  if (entropy < 60) {
    return { label: "medium", percent: 50, color: "bg-amber-500" }
  }
  if (entropy < 100) {
    return { label: "strong", percent: 75, color: "bg-emerald-500" }
  }
  return { label: "veryStrong", percent: 100, color: "bg-emerald-600" }
}

export default function PasswordGenerator() {
  const { t } = useT()
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState<Record<CharsetKey, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    const pw = generatePassword(length, options)
    setPassword(pw)
    setCopied(false)
  }, [length, options])

  useEffect(() => {
    queueMicrotask(() => handleGenerate())
  }, [])

  const handleCopy = useCallback(async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  }, [password])

  const toggleOption = useCallback((key: CharsetKey) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const strength = getStrength(length, options)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Password display */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Generated Password
        </Label>
        <div className="flex items-stretch gap-2">
          <div className="flex-1 flex items-center min-h-10 rounded-sm border border-border bg-muted/30 px-3 py-2 overflow-x-auto">
            <span className="font-mono text-sm break-all whitespace-pre select-all leading-relaxed">
              {password || (
                <span className="text-muted-foreground text-xs font-sans">
                  {t('tool.pw.noOptions')}
                </span>
              )}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!password}
            className="rounded-sm shrink-0"
          >
            {copied ? t('shared.copied') : t('shared.copy')}
          </Button>
        </div>
      </div>

      {/* Strength indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">
            {t('tool.pw.strength')}
          </Label>
          <span
            className={cn(
              "text-xs font-medium",
              strength.label === "weak" && "text-red-500",
              strength.label === "medium" && "text-amber-500",
              strength.label === "strong" && "text-emerald-500",
              strength.label === "veryStrong" && "text-emerald-600"
            )}
          >
            {strength.label === "weak" && t('tool.pw.weak')}
            {strength.label === "medium" && t('tool.pw.medium')}
            {strength.label === "strong" && t('tool.pw.strong')}
            {strength.label === "veryStrong" && t('tool.pw.veryStrong')}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              strength.color
            )}
            style={{ width: `${strength.percent}%` }}
          />
        </div>
      </div>

      {/* Length slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">
            {t('tool.pw.length')}
          </Label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {length}
          </span>
        </div>
        <Slider
          value={[length]}
          onValueChange={([val]) => setLength(val)}
          min={8}
          max={128}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      {/* Character set checkboxes */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Character Sets
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(CHAR_SETS) as CharsetKey[]).map((key) => (
            <label
              key={key}
              htmlFor={`pw-${key}`}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <Checkbox
                id={`pw-${key}`}
                checked={options[key]}
                onCheckedChange={() => toggleOption(key)}
              />
              <span className="text-sm text-foreground">
                {key === 'uppercase' && t('tool.pw.uppercase')}
                {key === 'lowercase' && t('tool.pw.lowercase')}
                {key === 'numbers' && t('tool.pw.numbers')}
                {key === 'symbols' && t('tool.pw.symbols')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        className="rounded-sm w-full"
      >
        {t('shared.generate')}
      </Button>
    </div>
  )
}