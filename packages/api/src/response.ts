import { NextResponse } from 'next/server';
import { AppError } from './errors';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ data } as ApiResponse<T>, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ data } as ApiResponse<T>, { status: 201 });
}

export function paginated<T>(
  data: T[],
  meta: { page: number; pageSize: number; total: number }
) {
  return NextResponse.json({
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.pageSize),
    },
  } as ApiResponse<T[]>, { status: 200 });
}

export function error(err: AppError) {
  return NextResponse.json({
    error: {
      code: err.code,
      message: err.message,
      details: err.details,
    },
  } as ApiResponse, { status: err.statusCode });
}

export function badRequest(message = 'Bad request') {
  return NextResponse.json({
    error: { code: 'BAD_REQUEST', message },
  } as ApiResponse, { status: 400 });
}

export function unauthorized(message = 'Authentication required') {
  return NextResponse.json({
    error: { code: 'UNAUTHORIZED', message },
  } as ApiResponse, { status: 401 });
}

export function forbidden(message = 'Access denied') {
  return NextResponse.json({
    error: { code: 'FORBIDDEN', message },
  } as ApiResponse, { status: 403 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({
    error: { code: 'NOT_FOUND', message },
  } as ApiResponse, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({
    error: { code: 'CONFLICT', message },
  } as ApiResponse, { status: 409 });
}
