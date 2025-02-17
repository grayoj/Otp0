import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { prisma } from '@otp0/lib/prisma';

function generateOTP(
  length: number,
  format: 'numeric' | 'alphanumeric' = 'numeric',
): string {
  if (format === 'numeric') {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += randomInt(0, 10).toString();
    }
    return otp;
  } else {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += chars.charAt(randomInt(0, chars.length));
    }
    return otp;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { length, expiresIn, format, expirationUnit } = body;

    if (![4, 6, 8, 10].includes(length)) {
      return NextResponse.json(
        { error: 'Invalid OTP length' },
        { status: 400 },
      );
    }
    if (!expiresIn || typeof expiresIn !== 'number') {
      return NextResponse.json(
        { error: 'Expiration time is required' },
        { status: 400 },
      );
    }

    const unit = expirationUnit || 'minutes';
    const now = new Date();
    const expiresAt =
      unit === 'seconds'
        ? new Date(now.getTime() + expiresIn * 1000)
        : new Date(now.getTime() + expiresIn * 60000);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'API key required in Authorization header' },
        { status: 401 },
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');

    const apiKeyRecord = await prisma.aPIKey.findUnique({
      where: { key: apiKey },
    });

    if (
      !apiKeyRecord ||
      (apiKeyRecord.type !== 'live' && apiKeyRecord.type !== 'test')
    ) {
      return NextResponse.json(
        { error: 'Invalid API key or project not found' },
        { status: 404 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: apiKeyRecord.projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const otpCode = generateOTP(length, format);

    const otpRecord = await prisma.oTP.create({
      data: {
        code: otpCode,
        length,
        expiresAt,
        verified: false,
        projectId: project.id,
      },
    });

    return NextResponse.json({ otp: otpRecord });
  } catch (error) {
    console.error('Error creating OTP:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
