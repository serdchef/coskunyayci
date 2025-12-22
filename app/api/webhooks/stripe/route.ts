/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler (coming in Phase 3)
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { received: true, status: 'Stripe webhooks coming in Phase 3' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 500 }
    );
  }
}
