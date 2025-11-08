import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { content, images, videos, voiceUrl } = await request.json()

    if (!content && !images?.length && !videos?.length && !voiceUrl) {
      return NextResponse.json(
        { error: 'Reply must have content or media' },
        { status: 400 }
      )
    }

    const reply = await prisma.reply.create({
      data: {
        content: content || '',
        authorId: payload.userId,
        postId: params.id,
        images: images || [],
        videos: videos || [],
        voiceUrl,
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
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (post && post.authorId !== payload.userId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'reply',
          message: `Someone replied to your post`,
          relatedId: params.id,
        },
      })
    }

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
