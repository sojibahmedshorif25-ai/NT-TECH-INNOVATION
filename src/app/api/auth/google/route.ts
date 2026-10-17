import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: 'Google Client ID is not configured.' },
      { status: 500 }
    );
  }

  const roleParam = req.nextUrl.searchParams.get('role') || 'CANDIDATE';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: JSON.stringify({ role: roleParam }),
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}
