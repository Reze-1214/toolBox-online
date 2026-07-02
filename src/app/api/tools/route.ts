import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const popular = searchParams.get('popular') === 'true'
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  const where: Record<string, unknown> = {}

  if (popular) {
    where.isPopular = true
  }

  if (category) {
    where.category = { slug: category }
  }

  if (slug) {
    where.slug = slug
  }

  const tools = await db.tool.findMany({
    where,
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(tools)
}