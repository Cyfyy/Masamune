import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/utils/models/auth';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    await connectToDatabase();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'JWT_SECRET is not defined.' }, { status: 500 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 });
    }

    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      return NextResponse.json({ error: 'Invalid token payload.' }, { status: 400 });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    
    await user.save();
    console.log('Password updated for user:', user.email);

    return NextResponse.json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}

