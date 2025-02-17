import { NextResponse } from 'next/server';
import { prisma } from '@otp0/lib/prisma';

export async function GET() {
  try {
    const otps = await prisma.oTP.findMany({
      select: {
        code: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otps || otps.length === 0) {
      return NextResponse.json({ message: 'No OTPs found' }, { status: 404 });
    }

    return NextResponse.json(otps);
  } catch (error) {
    console.error('Error fetching OTPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OTPs' },
      { status: 500 },
    );
  }
}
