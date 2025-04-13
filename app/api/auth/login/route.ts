import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import pool from '@/lib/db';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    const result = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password_hash);

    if (!passwordMatch) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Error during login:', error);
    return new NextResponse('Error during login', { status: 500 });
  }
}