import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { RoommateProfile } from '../models/RoommateProfile.js';
import { Apartment } from '../models/Apartment.js';
import { Match } from '../models/Match.js';
import { MatchingService } from '../services/matchingService.js';

export const getMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.userId;
  if (!currentUserId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const { status, type } = req.query;

  const currentUserProfile = await RoommateProfile.findOne({ user: currentUserId });
  const otherProfiles = await RoommateProfile.find({ user: { $ne: currentUserId } })
    .populate('user', 'name email avatar bio phone role')
    .exec();

  const matches = otherProfiles.map((p) => {
    let score = 85;
    let breakdown = { budget: 85, lifestyle: 85, location: 85, schedule: 85, preferences: 85 };
    let reasons: string[] = [];

    if (currentUserProfile) {
      const result = MatchingService.calculateRoommateCompatibility(currentUserProfile, p);
      score = result.overallScore;
      breakdown = result.categoryScores;
      reasons = result.whyItWorks;
    }

    return {
      id: `${currentUserId}-${p.user._id}`,
      user: p.user,
      profile: p,
      compatibilityScore: score,
      categoryScores: breakdown,
      whyItWorks: reasons,
      status: 'SUGGESTED',
    };
  });

  matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  res.status(200).json({
    success: true,
    data: matches,
  });
};

export const getCombinedMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.userId;

  const currentUserProfile = await RoommateProfile.findOne({ user: currentUserId });
  const otherProfiles = await RoommateProfile.find({ user: { $ne: currentUserId } })
    .populate('user', 'name email avatar bio role')
    .limit(10);

  const apartments = await Apartment.find().limit(10);

  const combinedMatches: any[] = [];

  if (currentUserProfile && otherProfiles.length > 0 && apartments.length > 0) {
    for (const roommate of otherProfiles) {
      for (const apt of apartments) {
        const combined = MatchingService.calculateCombinedMatch([currentUserProfile, roommate], apt);

        if (combined.combinedScore >= 75) {
          combinedMatches.push({
            id: `combined-${roommate.user._id}-${apt._id}`,
            primaryUser: currentUserId,
            matchedRoommate: {
              user: roommate.user,
              profile: roommate,
            },
            apartment: apt,
            combinedScore: combined.combinedScore,
            apartmentFitScore: combined.apartmentFitScore,
            roommateScore: combined.roommateScore,
            combinedBudget: combined.combinedBudget,
            rentPerPerson: combined.rentPerPerson,
            isBudgetSufficient: combined.isBudgetSufficient,
            whyItWorks: combined.whyItWorks,
          });
        }
      }
    }
  }

  combinedMatches.sort((a, b) => b.combinedScore - a.combinedScore);

  res.status(200).json({
    success: true,
    data: combinedMatches.slice(0, 15),
  });
};

export const updateMatchStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { matchedUserId, status } = req.body;
  const currentUserId = req.user?.userId;

  let match = await Match.findOne({ user: currentUserId, matchedUser: matchedUserId });
  if (!match) {
    match = new Match({
      user: currentUserId,
      matchedUser: matchedUserId,
      compatibilityScore: 90,
      status,
    });
  } else {
    match.status = status;
  }

  await match.save();

  res.status(200).json({
    success: true,
    data: match,
  });
};
