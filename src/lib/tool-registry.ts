const toolRegistry: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'qr-generator': () => import('@/components/tools/qr-generator'),
  'password-generator': () => import('@/components/tools/password-generator'),
  'json-formatter': () => import('@/components/tools/json-formatter'),
  'uuid-generator': () => import('@/components/tools/uuid-generator'),
  'word-counter': () => import('@/components/tools/word-counter'),
  'image-compressor': () => import('@/components/tools/image-compressor'),
  'base64-encoder': () => import('@/components/tools/base64-encoder'),
  'timestamp-converter': () => import('@/components/tools/timestamp-converter'),
}

export function dynamicImportTool(slug: string): Promise<{ default: React.ComponentType }> | null {
  const loader = toolRegistry[slug]
  if (!loader) return null
  return loader()
}

export function isToolImplemented(slug: string): boolean {
  return slug in toolRegistry
}

import type React from 'react'