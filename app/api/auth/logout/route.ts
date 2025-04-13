import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // For Next.js 13+, we don't need to clear cookies manually as they are handled by the auth middleware
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 })
  }
}