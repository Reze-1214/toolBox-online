import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json([])
  }

  const recent = await db.recentlyUsed.findMany({
    where: { userId },
    include: {
      tool: {
        include: { category: { select: { name: true, slug: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    distinct: ['toolId'],
  })

  return NextResponse.json(recent.map((r) => r.tool))
}

export async function POST(request: Request) {
  try {
    const { userId, toolId } = await request.json()

    if (!userId || !toolId) {
      return NextResponse.json({ error: 'userId and toolId required' }, { status: 400 })
    }

    await db.recentlyUsed.create({
      data: { userId, toolId },
    })

    // Keep only last 50 entries per user
    const count = await db.recentlyUsed.count({ where: { userId } })
    if (count > 50) {
      const oldEntries = await db.recentlyUsed.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        take: count - 50,
        select: { id: true },
      })
      const ids = oldEntries.map((e) => e.id)
      await db.recentlyUsed.deleteMany({ where: { id: { in: ids } } })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}