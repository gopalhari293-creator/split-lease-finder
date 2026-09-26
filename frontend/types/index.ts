export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  phone?: string;
  isEmailVisible?: boolean;
  isPhoneVisible?: boolean;
}

export interface Lifestyle {
  cleanliness: number;
  sleepSchedule: string;
  workSchedule: string;
  smoking: string;
  drinking: string;
  pets: string;
  guests: string;
  socialLevel: number;
  noiseTolerance: number;
  cookingHabits: string;
  foodPreferences: string[];
  sharingPreferences: string[];
  personality: string[];
  roomPreference: string;
  parkingNeeded: boolean;
  furnishedPreference: string;
  genderPreference: string;
}

export interface RoommateProfile {
  _id: string;
  user: User | string;
  age: number;
  gender: string;
  occupation: string;
  universityOrCompany: string;
  preferredLocations: string[];
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  leaseDuration: string;
  lifestyle: Lifestyle;
  profileCompletionScore: number;
}

export interface Apartment {
  _id: string;
  title: string;
  images: string[];
  location: string;
  address: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  furnished: boolean;
  amenities: string[];
  availableDate: string;
  leaseDuration: string;
  description: string;
  apartmentType: string;
  parking: string;
  petPolicy: string;
  isFeatured: boolean;
  isSaved?: boolean;
}

export interface CategoryScores {
  budget: number;
  lifestyle: number;
  location: number;
  schedule: number;
  preferences: number;
}

export interface MatchItem {
  id?: string;
  user: User;
  profile: RoommateProfile;
  compatibilityScore: number;
  categoryScores: CategoryScores;
  whyItWorks: string[];
  status?: string;
}

export interface CombinedMatch {
  id: string;
  matchedRoommate: {
    user: User;
    profile: RoommateProfile;
  };
  apartment: Apartment;
  combinedScore: number;
  apartmentFitScore: number;
  roommateScore: number;
  combinedBudget: number;
  rentPerPerson: number;
  isBudgetSufficient: boolean;
  whyItWorks: string[];
}

export interface Conversation {
  id: string;
  otherUser: User;
  lastMessage: string;
  lastMessageAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User | string;
  content: string;
  read: boolean;
  createdAt: string;
}
