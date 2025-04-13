import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return new NextResponse('Invalid token', { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/auth/login',
    '/api/auth/reset-password',
    '/api/auth/update-password',
    '/api/auth/logout',
    '/api/profile/:path*'
  ]
}