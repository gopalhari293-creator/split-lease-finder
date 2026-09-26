import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { RoommateProfile } from '../models/RoommateProfile.js';
import { AuthRequest } from '../middleware/auth.js';
import { JWT_SECRET, COOKIE_OPTIONS } from '../config/constants.js';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone: phone || '',
    avatar,
    role: 'USER',
  });

  // Create initial roommate profile
  await RoommateProfile.create({
    user: user._id,
    profileCompletionScore: 60,
  });

  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const user = await User.findById(req.user.userId).select('-passwordHash');
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const profile = await RoommateProfile.findOne({ user: user._id });

  res.status(200).json({
    success: true,
    data: {
      user,
      profile,
    },
  });
};

export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent.',
    });
    return;
  }

  const resetToken = jwt.sign({ userId: user._id.toString(), purpose: 'reset' }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({
    success: true,
    message: 'Password reset link generated.',
    data: { resetToken },
  });
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; purpose?: string };
    if (decoded.purpose !== 'reset') {
      res.status(400).json({ success: false, message: 'Invalid reset token.' });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully. Please log in.' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
  }
};
