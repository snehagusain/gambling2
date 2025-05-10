import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // No caching for health checks

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
} 