import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/utils/models/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ message: `Password reset email sent to ${email}` });
  } catch (error) {
    console.error('Error during password reset request:', error);
    return NextResponse.json({ error: 'Failed to send password reset email' }, { status: 500 });
  }
}

