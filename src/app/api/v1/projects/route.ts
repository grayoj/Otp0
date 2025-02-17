import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { randomBytes } from 'crypto';
import { prisma } from '@otp0/lib/prisma';

function generateApiKey(env: 'live' | 'test' = 'live'): string {
  const prefix = env === 'live' ? 'sk_live_' : 'sk_test_';
  const randomPart = randomBytes(24).toString('base64url');
  return `${prefix}${randomPart}`;
}

export async function POST(req: any) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 },
      );
    }

    let userRecord = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!userRecord) {
      userRecord = await prisma.user.create({ data: { clerkId: userId } });
    }

    const project = await prisma.project.create({
      data: {
        name,
        userId: userRecord.id,
      },
    });

    await prisma.aPIKey.createMany({
      data: [
        {
          key: generateApiKey('live'),
          type: 'live',
          projectId: project.id,
        },
        {
          key: generateApiKey('test'),
          type: 'test',
          projectId: project.id,
        },
      ],
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET(req: any) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const userRecord = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!userRecord) {
      return NextResponse.json({ projects: [], totalPages: 0 });
    }

    const totalProjects = await prisma.project.count({
      where: { userId: userRecord.id },
    });
    const projects = await prisma.project.findMany({
      where: { userId: userRecord.id },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      include: {
        apiKeys: {
          select: {
            key: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({
      projects,
      totalPages: Math.ceil(totalProjects / limit),
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: any) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 },
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.userId !== userRecord.id) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 403 },
      );
    }

    await prisma.aPIKey.deleteMany({ where: { projectId } });

    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({
      message: 'Project and associated API keys deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
