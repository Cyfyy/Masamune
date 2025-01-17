import { connect } from '@/utils/config/dbConfig';
import User from '@/utils/models/auth';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await connect();

        const { name, email, password } = await req.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const ifUserExists = await User.findOne({ $or: [{ email }, { name }] });
        if (ifUserExists) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const savedUser = await new User({
            name,
            email,
            password: hashedPassword
        }).save();

        console.log('User created successfully:', savedUser.email);

        return NextResponse.json({
            message: 'User created successfully',
            success: true,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error in register route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

