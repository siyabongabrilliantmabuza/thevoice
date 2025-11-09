import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { content } = await request.json()
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        authorId: payload.userId,
        postId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    })

    // Create notification
    const parentPost = await prisma.post.findUnique({
      where: { id },
    })

    if (parentPost && parentPost.authorId !== payload.userId) {
      await prisma.notification.create({
        data: {
          userId: parentPost.authorId,
          type: 'reply',
          message: `Someone replied to your post`,
          relatedId: id,
        },
      })
    }

    return NextResponse.json(reply)
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
