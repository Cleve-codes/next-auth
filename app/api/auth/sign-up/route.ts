import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { createErrorResponse } from '@/lib/error';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Raw request body:', body);
    
    const { email, password } = body;
    console.log('Parsed email:', email);
    console.log('Password length:', password?.length);

    if (!email || !password) {
      console.log('Missing fields:', { email, password });
      return createErrorResponse('Missing email or password', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Invalid email format', 400);
    }

    // Validate password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return createErrorResponse('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character', 400);
    }

    // First create the table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    // Now check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    console.log('User exists check:', existingUser.rows.length > 0);
    
    if (existingUser.rows.length > 0) {
      return createErrorResponse('User already exists. Please try logging in instead.', 409);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const userId = uuidv4();

    try {
      // Insert the user
      const insertResult = await pool.query(
        'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
        [userId, email, hashedPassword]
      );
      console.log('Insert result:', insertResult.rows);

      return NextResponse.json({ 
        message: 'User registered successfully',
        userId: userId
      });
    } catch (dbError: any) {
      console.error('Database error details:', {
        error: dbError,
        code: dbError?.code,
        message: dbError?.message
      });
      
      if (dbError?.code === '23505') { // Unique constraint violation
        return createErrorResponse('Email already registered', 409);
      }
      return createErrorResponse('Database error during registration', 500);
    }
  } catch (error: any) {
    console.error('Top level error during registration:', {
      error: error,
      message: error?.message,
      stack: error?.stack
    });
    return createErrorResponse('Error during registration', 500);
  }
}