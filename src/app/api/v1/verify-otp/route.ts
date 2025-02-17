import { NextResponse } from 'next/server';
import { prisma } from '@otp0/lib/prisma';

export async function POST(req: any) {
  const body = await req.json();
  const { code } = body;

  if (!code) {
    return NextResponse.json(
      { error: 'OTP code is required' },
      { status: 400 },
    );
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header' },
      { status: 401 },
    );
  }

  const apiKey = authHeader.replace('Bearer ', '');

  const apiKeyRecord = await prisma.aPIKey.findUnique({
    where: { key: apiKey },
    include: {
      project: true,
    },
  });

  if (!apiKeyRecord || !apiKeyRecord.project) {
    return NextResponse.json(
      { error: 'Project not found or invalid API key' },
      { status: 404 },
    );
  }

  const otpRecord = await prisma.oTP.findFirst({
    where: {
      code,
      projectId: apiKeyRecord.project.id,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    return NextResponse.json({ error: 'OTP not found' }, { status: 404 });
  }

  const now = new Date();
  if (now > otpRecord.expiresAt) {
    return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    message: 'OTP is valid',
    otp: otpRecord,
  });
}
