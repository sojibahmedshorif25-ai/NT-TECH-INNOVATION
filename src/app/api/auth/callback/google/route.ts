import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import { User, UserRole } from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateRaw = searchParams.get('state');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  if (error || !code) {
    console.error('Google OAuth Error returned:', error);
    return NextResponse.redirect(`${appUrl}/login?error=oauth_denied`);
  }

  let preferredRole: UserRole = 'CANDIDATE';
  try {
    if (stateRaw) {
      const parsed = JSON.parse(stateRaw);
      if (parsed.role === 'RECRUITER' || parsed.role === 'CANDIDATE') {
        preferredRole = parsed.role;
      }
    }
  } catch {
    // Ignore state parse errors
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Failed to exchange Google OAuth code:', errText);
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated Google User Profile
    const userProfileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userProfileResponse.ok) {
      return NextResponse.redirect(`${appUrl}/login?error=failed_fetching_userinfo`);
    }

    const googleUser = await userProfileResponse.json();
    const { email, name } = googleUser;

    if (!email) {
      return NextResponse.redirect(`${appUrl}/login?error=email_not_provided`);
    }

    // 3. Connect to MongoDB Atlas and retrieve or create user
    await connectToDatabase();

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Generate a secure random password hash for OAuth account
      const randomPassword = crypto.randomBytes(24).toString('hex');
      const passwordHash = await hashPassword(randomPassword);

      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        passwordHash,
        role: preferredRole,
        title: preferredRole === 'RECRUITER' ? 'Technical Recruiter' : 'Full Stack Developer',
        bio: 'Authenticated securely via Google OAuth 2.0',
        skills: ['TypeScript', 'React', 'Node.js'],
      });
    }

    // 4. Sign JWT session token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 5. Set session cookie and redirect to platform
    const targetUrl = user.role === 'RECRUITER' ? `${appUrl}/pipeline` : `${appUrl}/`;
    const response = NextResponse.redirect(targetUrl);

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Google OAuth Callback exception:', err);
    return NextResponse.redirect(`${appUrl}/login?error=oauth_server_exception`);
  }
}
