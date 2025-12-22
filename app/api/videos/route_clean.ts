/**
 * POST /api/videos
 * Video generation API (coming in Phase 3)
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Video API coming in Phase 3' },
    { status: 501 }
  );
}
