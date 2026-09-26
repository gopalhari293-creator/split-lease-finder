import { IRoommateProfile } from '../models/RoommateProfile.js';
import { IApartment } from '../models/Apartment.js';

export interface ICompatibilityResult {
  overallScore: number; // 0 - 100
  categoryScores: {
    budget: number;
    lifestyle: number;
    location: number;
    schedule: number;
    preferences: number;
  };
  whyItWorks: string[];
}

export interface ICombinedMatchResult {
  combinedScore: number;
  apartmentFitScore: number;
  roommateScore: number;
  combinedBudget: number;
  rentPerPerson: number;
  isBudgetSufficient: boolean;
  whyItWorks: string[];
}

export class MatchingService {
  /**
   * Calculates roommate-to-roommate compatibility
   */
  public static calculateRoommateCompatibility(
    p1: IRoommateProfile,
    p2: IRoommateProfile
  ): ICompatibilityResult {
    const whyItWorks: string[] = [];

    // 1. Budget Compatibility (25%)
    let budgetScore = 0;
    const overlapMin = Math.max(p1.budgetMin, p2.budgetMin);
    const overlapMax = Math.min(p1.budgetMax, p2.budgetMax);

    if (overlapMax >= overlapMin) {
      budgetScore = 100;
      whyItWorks.push(`Compatible budget range ($${overlapMin}–$${overlapMax})`);
    } else {
      const gap = overlapMin - overlapMax;
      budgetScore = Math.max(0, 100 - Math.round(gap / 10));
    }

    // 2. Location & Move-in Date (20%)
    let locationScore = 60;
    const commonLocations = p1.preferredLocations.filter((loc) =>
      p2.preferredLocations.some((l2) => l2.toLowerCase() === loc.toLowerCase())
    );

    if (commonLocations.length > 0) {
      locationScore = 100;
      whyItWorks.push(`Shared location preference: ${commonLocations[0]}`);
    } else if (p1.preferredLocations.length === 0 || p2.preferredLocations.length === 0) {
      locationScore = 80;
    }

    // Move-in date proximity
    const d1 = new Date(p1.moveInDate).getTime();
    const d2 = new Date(p2.moveInDate).getTime();
    const diffDays = Math.abs(d1 - d2) / (1000 * 3600 * 24);
    let scheduleScore = 100;

    if (diffDays <= 30) {
      whyItWorks.push(`Similar move-in timeline (within ${Math.round(diffDays)} days)`);
    } else {
      scheduleScore = Math.max(40, 100 - Math.round((diffDays - 30) * 1.5));
    }

    // 3. Lifestyle Compatibility (25%)
    const cleanDelta = Math.abs(p1.lifestyle.cleanliness - p2.lifestyle.cleanliness);
    const cleanScore = Math.max(0, 100 - cleanDelta * 20);
    if (cleanDelta <= 1) whyItWorks.push('Matching cleanliness standards');

    const socialDelta = Math.abs(p1.lifestyle.socialLevel - p2.lifestyle.socialLevel);
    const socialScore = Math.max(0, 100 - socialDelta * 15);

    const noiseDelta = Math.abs(p1.lifestyle.noiseTolerance - p2.lifestyle.noiseTolerance);
    const noiseScore = Math.max(0, 100 - noiseDelta * 15);

    const sleepMatch = p1.lifestyle.sleepSchedule === p2.lifestyle.sleepSchedule;
    const sleepScore = sleepMatch ? 100 : 75;
    if (sleepMatch) whyItWorks.push(`Both prefer ${p1.lifestyle.sleepSchedule.toLowerCase()} schedule`);

    const lifestyleScore = Math.round(
      cleanScore * 0.35 + socialScore * 0.25 + noiseScore * 0.2 + sleepScore * 0.2
    );

    // 4. Preferences & Habits (20%)
    let prefScore = 100;

    // Smoking
    if (
      (p1.lifestyle.smoking === 'Non-smoker' && p2.lifestyle.smoking === 'Smoker') ||
      (p2.lifestyle.smoking === 'Non-smoker' && p1.lifestyle.smoking === 'Smoker')
    ) {
      prefScore -= 35;
    } else {
      whyItWorks.push('Compatible smoking preferences');
    }

    // Pets
    if (
      (p1.lifestyle.pets === 'No pets' && p2.lifestyle.pets.includes('Has')) ||
      (p2.lifestyle.pets === 'No pets' && p1.lifestyle.pets.includes('Has'))
    ) {
      prefScore -= 25;
    } else {
      whyItWorks.push('Pet policy agreement');
    }

    // Drinking & Guests
    if (p1.lifestyle.guests === p2.lifestyle.guests) {
      whyItWorks.push(`Both comfortable with guests (${p1.lifestyle.guests.toLowerCase()})`);
    }

    prefScore = Math.max(20, prefScore);

    // Category scores
    const categoryScores = {
      budget: Math.round(budgetScore),
      lifestyle: Math.round(lifestyleScore),
      location: Math.round(locationScore),
      schedule: Math.round(scheduleScore),
      preferences: Math.round(prefScore),
    };

    // Overall weighted score
    const overallScore = Math.round(
      categoryScores.budget * 0.25 +
        categoryScores.lifestyle * 0.25 +
        categoryScores.location * 0.2 +
        categoryScores.schedule * 0.15 +
        categoryScores.preferences * 0.15
    );

    return {
      overallScore: Math.min(99, Math.max(40, overallScore)),
      categoryScores,
      whyItWorks: whyItWorks.slice(0, 5),
    };
  }

  /**
   * Calculates combined roommate group + apartment compatibility
   */
  public static calculateCombinedMatch(
    profiles: IRoommateProfile[],
    apartment: IApartment
  ): ICombinedMatchResult {
    const whyItWorks: string[] = [];

    // Calculate sum of budget maxes
    const totalMaxBudget = profiles.reduce((acc, p) => acc + p.budgetMax, 0);
    const rentPerPerson = Math.round(apartment.monthlyRent / profiles.length);
    const isBudgetSufficient = totalMaxBudget >= apartment.monthlyRent;

    let budgetFit = isBudgetSufficient ? 100 : Math.max(30, Math.round((totalMaxBudget / apartment.monthlyRent) * 100));
    if (isBudgetSufficient) {
      whyItWorks.push(`Combined max budget ($${totalMaxBudget}) covers monthly rent ($${apartment.monthlyRent})`);
    }

    // Location match
    let locationFit = 70;
    const locationMatches = profiles.filter((p) =>
      p.preferredLocations.some((loc) => apartment.location.toLowerCase().includes(loc.toLowerCase()))
    );
    if (locationMatches.length > 0) {
      locationFit = 100;
      whyItWorks.push(`Apartment is located in preferred area (${apartment.location})`);
    }

    // Capacity fit (bedrooms vs roommates)
    let capacityFit = 100;
    if (apartment.bedrooms < profiles.length) {
      capacityFit = 75; // Shared bedrooms needed
    } else {
      whyItWorks.push(`Spacious ${apartment.bedrooms} bedroom layout for ${profiles.length} roommates`);
    }

    // Pet policy check
    const anyHasPet = profiles.some((p) => p.lifestyle.pets.includes('Has'));
    if (anyHasPet && apartment.petPolicy === 'No pets') {
      whyItWorks.push('Notice: Apartment has a no-pets policy');
    } else {
      whyItWorks.push(`Pet policy aligns (${apartment.petPolicy})`);
    }

    const apartmentFitScore = Math.round(budgetFit * 0.45 + locationFit * 0.35 + capacityFit * 0.2);

    // Calculate pairwise roommate score if multiple roommates
    let roommateScore = 90;
    if (profiles.length >= 2) {
      const pairing = MatchingService.calculateRoommateCompatibility(profiles[0], profiles[1]);
      roommateScore = pairing.overallScore;
    }

    const combinedScore = Math.round(apartmentFitScore * 0.5 + roommateScore * 0.5);

    return {
      combinedScore,
      apartmentFitScore,
      roommateScore,
      combinedBudget: totalMaxBudget,
      rentPerPerson,
      isBudgetSufficient,
      whyItWorks,
    };
  }
}
