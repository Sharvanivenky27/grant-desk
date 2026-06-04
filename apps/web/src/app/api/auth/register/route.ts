import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import { registerSchema } from '@grantdesk/api';
import { success, error, conflict, badRequest } from '@grantdesk/api';

// Demo mode: skip database registration when no DATABASE_URL
const DEMO_MODE = !process.env.DATABASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Demo mode: skip database registration
    if (DEMO_MODE) {
      return success({
        id: 'demo-1',
        email: data.email,
        name: data.name,
        demoMode: true,
      }, 201);
    }

    const { prisma } = await import('@grantdesk/db');

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return conflict('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await hash(data.password, 10);

    // Get applicant role
    const applicantRole = await prisma.role.findUnique({
      where: { name: 'applicant' },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        roles: applicantRole
          ? { connect: { id: applicantRole.id } }
          : undefined,
      },
    });

    return success({
      id: user.id,
      email: user.email,
      name: user.name,
    }, 201);
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return badRequest('Invalid input');
    }
    return error(e);
  }
}
