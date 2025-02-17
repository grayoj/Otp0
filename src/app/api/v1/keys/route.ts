import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@otp0/lib/prisma';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json(
      { status: 'error', message: 'Unauthorized' },
      { status: 401 },
    );
  }

  const userRecord = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!userRecord) {
    return NextResponse.json({
      status: 'success',
      data: [],
      meta: { total: 0 },
    });
  }

  const projects = await prisma.project.findMany({
    where: { userId: userRecord.id },
    include: { apiKeys: true },
  });

  const projectsData = projects.map((project) => {
    const liveKey =
      project.apiKeys.find((key) => key.type === 'live')?.key || null;
    const testKey =
      project.apiKeys.find((key) => key.type === 'test')?.key || null;

    return {
      id: project.id,
      name: project.name,
      liveKey,
      testKey,
      createdAt: project.createdAt.toISOString(),
    };
  });

  return NextResponse.json({
    status: 'success',
    data: projectsData,
    meta: { total: projectsData.length },
  });
}
