import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { RoommateProfile } from '../models/RoommateProfile.js';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.params.id || req.user?.userId;

  if (!userId) {
    res.status(400).json({ success: false, message: 'User ID is required.' });
    return;
  }

  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  let profile = await RoommateProfile.findOne({ user: userId });
  if (!profile && userId === req.user?.userId) {
    profile = await RoommateProfile.create({ user: userId });
  }

  res.status(200).json({
    success: true,
    data: {
      user,
      profile,
    },
  });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const {
    name,
    avatar,
    bio,
    phone,
    isEmailVisible,
    isPhoneVisible,
    age,
    gender,
    occupation,
    universityOrCompany,
    preferredLocations,
    budgetMin,
    budgetMax,
    moveInDate,
    leaseDuration,
    lifestyle,
  } = req.body;

  // Update user basic details if provided
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  if (name !== undefined) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (bio !== undefined) user.bio = bio;
  if (phone !== undefined) user.phone = phone;
  if (isEmailVisible !== undefined) user.isEmailVisible = isEmailVisible;
  if (isPhoneVisible !== undefined) user.isPhoneVisible = isPhoneVisible;
  await user.save();

  // Find or create profile
  let profile = await RoommateProfile.findOne({ user: userId });
  if (!profile) {
    profile = new RoommateProfile({ user: userId });
  }

  if (age !== undefined) profile.age = age;
  if (gender !== undefined) profile.gender = gender;
  if (occupation !== undefined) profile.occupation = occupation;
  if (universityOrCompany !== undefined) profile.universityOrCompany = universityOrCompany;
  if (preferredLocations !== undefined) profile.preferredLocations = preferredLocations;
  if (budgetMin !== undefined) profile.budgetMin = budgetMin;
  if (budgetMax !== undefined) profile.budgetMax = budgetMax;
  if (moveInDate !== undefined) profile.moveInDate = new Date(moveInDate);
  if (leaseDuration !== undefined) profile.leaseDuration = leaseDuration;

  if (lifestyle) {
    profile.lifestyle = {
      ...profile.lifestyle,
      ...lifestyle,
    };
  }

  // Calculate completion percentage score
  let filledFields = 0;
  let totalFields = 10;
  if (user.bio) filledFields++;
  if (profile.age) filledFields++;
  if (profile.occupation) filledFields++;
  if (profile.preferredLocations && profile.preferredLocations.length > 0) filledFields++;
  if (profile.budgetMax) filledFields++;
  if (profile.lifestyle.cleanliness) filledFields++;
  if (profile.lifestyle.sleepSchedule) filledFields++;
  if (profile.lifestyle.workSchedule) filledFields++;
  if (profile.lifestyle.smoking) filledFields++;
  if (profile.lifestyle.pets) filledFields++;

  profile.profileCompletionScore = Math.min(100, Math.round((filledFields / totalFields) * 100));

  await profile.save();

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        isEmailVisible: user.isEmailVisible,
        isPhoneVisible: user.isPhoneVisible,
      },
      profile,
    },
  });
};
