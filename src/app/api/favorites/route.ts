import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json([])
  }

  const favorites = await db.favorite.findMany({
    where: { userId },
    include: {
      tool: {
        include: { category: { select: { name: true, slug: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(favorites.map((f) => f.tool))
}

export async function POST(request: Request) {
  try {
    const { userId, toolId } = await request.json()

    if (!userId || !toolId) {
      return NextResponse.json({ error: 'userId and toolId required' }, { status: 400 })
    }

    const favorite = await db.favorite.create({
      data: { userId, toolId },
    })

    return NextResponse.json(favorite)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    if (msg.includes('Unique')) {
      return NextResponse.json({ message: 'Already favorited' })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, toolId } = await request.json()

    if (!userId || !toolId) {
      return NextResponse.json({ error: 'userId and toolId required' }, { status: 400 })
    }

    await db.favorite.deleteMany({
      where: { userId, toolId },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}