import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET messages with a specific user
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const recipientId = searchParams.get('recipientId')

    if (!recipientId) {
      return NextResponse.json(
        { error: 'recipientId required' },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: payload.userId,
            recipientId,
          },
          {
            senderId: recipientId,
            recipientId: payload.userId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST send message
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { content, recipientId, imageUrl, videoUrl, voiceUrl } = await request.json()

    if (!content && !imageUrl && !videoUrl && !voiceUrl) {
      return NextResponse.json(
        { error: 'Message must have content or media' },
        { status: 400 }
      )
    }

    if (!recipientId) {
      return NextResponse.json(
        { error: 'recipientId required' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content: content || '',
        senderId: payload.userId,
        recipientId,
        imageUrl,
        videoUrl,
        voiceUrl,
      },
      include: {
        sender: {
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
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'message',
        message: `New message from ${payload.username}`,
        relatedId: message.id,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
