import crypto from 'crypto';
import { User } from '../models/User.js';
import { hashPassword, comparePassword, signToken } from '../lib/auth.js';
import { RegisterSchema, LoginSchema } from '../lib/validations.js';

export async function register(req, res) {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, password, role, title, bio, skills } = parseResult.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'CANDIDATE',
      title: title || '',
      bio: bio || '',
      skills: skills || [],
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
      },
      token,
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

export async function login(req, res) {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
      },
      token,
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        bio: user.bio,
        skills: user.skills,
      },
    });
  } catch (err) {
    console.error('GetMe Error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving session.' });
  }
}

export function logout(req, res) {
  res.clearCookie('token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
}

export function googleRedirect(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/api/auth/callback/google';
  const role = req.query.role || 'CANDIDATE';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: JSON.stringify({ role }),
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

export async function googleCallback(req, res) {
  const { code, error, state } = req.query;
  const redirectUri = 'http://localhost:3000/api/auth/callback/google';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  if (error || !code) {
    return res.redirect(`${clientUrl}/login?error=oauth_denied`);
  }

  let preferredRole = 'CANDIDATE';
  try {
    if (state) {
      const parsed = JSON.parse(state);
      if (parsed.role) preferredRole = parsed.role;
    }
  } catch {
    // Ignore
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
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

    if (!tokenRes.ok) {
      return res.redirect(`${clientUrl}/login?error=token_exchange_failed`);
    }

    const tokenData = await tokenRes.json();
    const userProfileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userProfileRes.json();
    const { email, name } = googleUser;

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
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

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const targetUrl = user.role === 'RECRUITER' ? `${clientUrl}/pipeline` : `${clientUrl}/`;
    return res.redirect(targetUrl);
  } catch (err) {
    console.error('Google Callback Error:', err);
    return res.redirect(`${clientUrl}/login?error=server_error`);
  }
}
