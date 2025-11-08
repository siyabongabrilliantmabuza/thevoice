import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

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

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Check if already interested
    const existingInterest = await prisma.interest.findUnique({
      where: {
        userId_interestedInId: {
          userId: payload.userId,
          interestedInId: userId,
        },
      },
    })

    if (existingInterest) {
      // Remove interest
      await prisma.interest.delete({
        where: {
          userId_interestedInId: {
            userId: payload.userId,
            interestedInId: userId,
          },
        },
      })

      return NextResponse.json({ interested: false })
    } else {
      // Add interest
      await prisma.interest.create({
        data: {
          userId: payload.userId,
          interestedInId: userId,
        },
      })

      return NextResponse.json({ interested: true })
    }
  } catch (error) {
    console.error('Interest toggle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
