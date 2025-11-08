import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    const payload = token ? verifyToken(token) : null

    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'username required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        coverImage: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            interests: true,
            interestedBy: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if current user is interested in this user
    let isInterested = false
    if (payload) {
      const interest = await prisma.interest.findUnique({
        where: {
          userId_interestedInId: {
            userId: payload.userId,
            interestedInId: user.id,
          },
        },
      })
      isInterested = !!interest
    }

    return NextResponse.json({
      ...user,
      isInterested,
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
