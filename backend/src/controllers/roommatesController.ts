import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { RoommateProfile, IRoommateProfile } from '../models/RoommateProfile.js';
import { MatchingService } from '../services/matchingService.js';

export const getRoommates = async (req: AuthRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.userId;
  const {
    location,
    minBudget,
    maxBudget,
    gender,
    leaseDuration,
    minScore,
    page = '1',
    limit = '10',
    sortBy = 'compatibility',
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Get current user's profile for compatibility calculations
  let currentUserProfile: IRoommateProfile | null = null;
  if (currentUserId) {
    currentUserProfile = await RoommateProfile.findOne({ user: currentUserId });
  }

  // Query filter
  const filter: any = {};
  if (currentUserId) {
    filter.user = { $ne: currentUserId };
  }

  if (gender && gender !== 'All') {
    filter.gender = gender;
  }

  if (leaseDuration && leaseDuration !== 'All') {
    filter.leaseDuration = leaseDuration;
  }

  if (location) {
    filter.preferredLocations = { $regex: new RegExp(location as string, 'i') };
  }

  if (minBudget || maxBudget) {
    filter.budgetMax = { $gte: parseInt((minBudget as string) || '0', 10) };
    if (maxBudget) {
      filter.budgetMin = { $lte: parseInt(maxBudget as string, 10) };
    }
  }

  const profiles = await RoommateProfile.find(filter)
    .populate('user', 'name email avatar bio phone isEmailVisible isPhoneVisible role')
    .exec();

  // Process profiles and compute compatibility
  const results = profiles.map((p) => {
    let compatibilityScore = 85; // default fallback
    let categoryScores = { budget: 85, lifestyle: 85, location: 85, schedule: 85, preferences: 85 };
    let whyItWorks: string[] = ['Active community member', 'Verified profile'];

    if (currentUserProfile) {
      const matchResult = MatchingService.calculateRoommateCompatibility(currentUserProfile, p);
      compatibilityScore = matchResult.overallScore;
      categoryScores = matchResult.categoryScores;
      whyItWorks = matchResult.whyItWorks;
    }

    return {
      profile: p,
      user: p.user,
      compatibilityScore,
      categoryScores,
      whyItWorks,
    };
  });

  // Filter by minScore if provided
  let filteredResults = results;
  if (minScore) {
    const minScoreNum = parseInt(minScore as string, 10);
    filteredResults = results.filter((r) => r.compatibilityScore >= minScoreNum);
  }

  // Sort results
  if (sortBy === 'compatibility') {
    filteredResults.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  } else if (sortBy === 'budget_low') {
    filteredResults.sort((a, b) => a.profile.budgetMin - b.profile.budgetMin);
  } else if (sortBy === 'budget_high') {
    filteredResults.sort((a, b) => b.profile.budgetMax - a.profile.budgetMax);
  }

  const total = filteredResults.length;
  const paginatedResults = filteredResults.slice(skip, skip + limitNum);

  res.status(200).json({
    success: true,
    data: {
      roommates: paginatedResults,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
};

export const getRoommateById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const currentUserId = req.user?.userId;

  const profile = await RoommateProfile.findById(id)
    .populate('user', 'name email avatar bio phone isEmailVisible isPhoneVisible role')
    .exec();

  if (!profile) {
    res.status(404).json({ success: false, message: 'Roommate profile not found.' });
    return;
  }

  let compatibilityScore = 88;
  let categoryScores = { budget: 90, lifestyle: 88, location: 92, schedule: 85, preferences: 85 };
  let whyItWorks: string[] = ['Verified roommate profile'];

  if (currentUserId && currentUserId !== profile.user._id.toString()) {
    const currentUserProfile = await RoommateProfile.findOne({ user: currentUserId });
    if (currentUserProfile) {
      const matchResult = MatchingService.calculateRoommateCompatibility(currentUserProfile, profile);
      compatibilityScore = matchResult.overallScore;
      categoryScores = matchResult.categoryScores;
      whyItWorks = matchResult.whyItWorks;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      profile,
      user: profile.user,
      compatibilityScore,
      categoryScores,
      whyItWorks,
    },
  });
};

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.userId;

  if (!currentUserId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const currentUserProfile = await RoommateProfile.findOne({ user: currentUserId });
  const otherProfiles = await RoommateProfile.find({ user: { $ne: currentUserId } })
    .populate('user', 'name email avatar bio phone role')
    .limit(30);

  const recommendations = otherProfiles
    .map((p) => {
      let score = 80;
      let breakdown = { budget: 80, lifestyle: 80, location: 80, schedule: 80, preferences: 80 };
      let reasons: string[] = [];

      if (currentUserProfile) {
        const res = MatchingService.calculateRoommateCompatibility(currentUserProfile, p);
        score = res.overallScore;
        breakdown = res.categoryScores;
        reasons = res.whyItWorks;
      }

      return {
        profile: p,
        user: p.user,
        compatibilityScore: score,
        categoryScores: breakdown,
        whyItWorks: reasons,
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 6);

  res.status(200).json({
    success: true,
    data: recommendations,
  });
};
