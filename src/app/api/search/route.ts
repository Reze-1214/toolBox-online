import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const toolAliases: Record<string, string[]> = {
  'qr-generator': ['qr', 'kode qr', 'barcode', 'kode'],
  'password-generator': ['password', 'kata sandi', 'sandi', 'acak', 'generator'],
  'json-formatter': ['json', 'format', 'formatter', 'indent', 'beautify'],
  'uuid-generator': ['uuid', 'id unik', 'generator', 'unique'],
  'word-counter': ['word', 'counter', 'kata', 'jumlah kata', 'teks', 'karakter', 'huruf'],
  'image-compressor': ['image', 'gambar', 'foto', 'kompres', 'compress'],
  'base64-encoder': ['base64', 'encode', 'decode', 'enkripsi', 'dekode', 'teks'],
  'timestamp-converter': ['timestamp', 'waktu', 'tanggal', 'konversi', 'converter'],
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildSearchText(tool: any) {
  return [
    tool.name,
    tool.description,
    tool.slug,
    tool.category?.name,
    tool.category?.slug,
    ...(toolAliases[tool.slug] || []),
  ].join(' ')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  if (!q.trim()) {
    return NextResponse.json([])
  }

  const tools = await db.tool.findMany({
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: { order: 'asc' },
  })

  const normalizedQuery = normalizeText(q)
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean)

  const filteredTools = tools.filter((tool) => {
    const searchableText = normalizeText(buildSearchText(tool))
    return queryTokens.every((token) => searchableText.includes(token))
  })

  return NextResponse.json(filteredTools.slice(0, 20))
}