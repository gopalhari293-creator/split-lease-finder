import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { RoommateProfile } from '../models/RoommateProfile.js';
import { Apartment } from '../models/Apartment.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Match } from '../models/Match.js';
import { SavedApartment } from '../models/SavedApartment.js';
import { connectDB } from '../config/db.js';

export const seedDatabase = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('[Seed] Database already populated. Skipping auto-seed.');
    return;
  }

  console.log('[Seed] Seeding database with realistic SplitLease dataset (INR)...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Users
  const usersData = [
    {
      name: 'Alex Rivera',
      email: 'alex@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Senior Frontend Engineer at TechCorp. Love bouldering, specialty coffee, and clean minimalist living.',
      phone: '+91 98765 43210',
      isEmailVisible: true,
      isPhoneVisible: false,
    },
    {
      name: 'Sarah Chen',
      email: 'sarah@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      bio: 'UX Designer & plant enthusiast. Work hybrid 3 days/week. Quiet during weeknights.',
      phone: '+91 98765 43211',
      isEmailVisible: true,
      isPhoneVisible: true,
    },
    {
      name: 'Marcus Vance',
      email: 'marcus@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Finance Analyst. Early riser, avid runner. Looking for a respectful roommate in Downtown/East Austin.',
      phone: '+91 98765 43212',
    },
    {
      name: 'Elena Rostova',
      email: 'elena@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Graduate researcher in Neuroscience at UT Austin. Quiet, clean, and loves baking weekend treats.',
    },
    {
      name: 'David Kim',
      email: 'david@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Product Manager. Weekend hiker, loves cooking Italian food and hosting occasional dinner parties.',
    },
    {
      name: 'Maya Patel',
      email: 'maya@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      bio: 'Architectural designer. Very tidy, loves interior decor and yoga.',
    },
    {
      name: 'Jordan Taylor',
      email: 'jordan@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      bio: 'Data Scientist. Friendly, non-smoker, has a trained 3yo Golden Retriever.',
    },
    {
      name: 'Chloe Bennett',
      email: 'chloe@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      bio: 'Digital Marketer & food blogger. Loves exploring new restaurants and keeping a cozy home.',
    },
    {
      name: 'Liam O’Connor',
      email: 'liam@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      bio: 'Software Developer. Into indie music, cycling, and brewing kombucha.',
    },
    {
      name: 'Sophia Martinez',
      email: 'sophia@splitlease.com',
      passwordHash,
      role: 'USER' as const,
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
      bio: 'Graphic Designer. Quiet during work hours, enjoys weekend board game nights.',
    },
    {
      name: 'System Admin',
      email: 'admin@splitlease.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN' as const,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      bio: 'SplitLease Platform Administrator.',
    },
  ];

  const createdUsers = await User.insertMany(usersData);
  const alexUser = createdUsers[0];
  const sarahUser = createdUsers[1];
  const marcusUser = createdUsers[2];
  const elenaUser = createdUsers[3];
  const davidUser = createdUsers[4];

  // 2. Roommate Profiles
  const profilesData = [
    {
      user: alexUser._id,
      age: 27,
      gender: 'Male',
      occupation: 'Frontend Engineer',
      universityOrCompany: 'TechCorp',
      preferredLocations: ['Downtown Austin', 'East Austin', 'Rainey Street'],
      budgetMin: 12000,
      budgetMax: 22000,
      moveInDate: new Date('2026-10-15'),
      leaseDuration: '12 months',
      lifestyle: {
        cleanliness: 5,
        sleepSchedule: 'Early bird',
        workSchedule: 'Hybrid',
        smoking: 'Non-smoker',
        drinking: 'Socially',
        pets: 'Pet friendly',
        guests: 'Weekends only',
        socialLevel: 4,
        noiseTolerance: 3,
        cookingHabits: 'Cook often',
        foodPreferences: ['Vegetarian friendly', 'Healthy'],
        sharingPreferences: ['Kitchen items', 'Streaming services'],
        personality: ['Introverted-extrovert', 'Clean', 'Organized', 'Techie'],
        roomPreference: 'Private room',
        parkingNeeded: true,
        furnishedPreference: 'Flexible',
        genderPreference: 'Any',
      },
      profileCompletionScore: 95,
    },
    {
      user: sarahUser._id,
      age: 26,
      gender: 'Female',
      occupation: 'UX Designer',
      universityOrCompany: 'Creative Co.',
      preferredLocations: ['East Austin', 'Mueller', 'Hyde Park'],
      budgetMin: 10000,
      budgetMax: 20000,
      moveInDate: new Date('2026-10-01'),
      leaseDuration: '12 months',
      lifestyle: {
        cleanliness: 4,
        sleepSchedule: 'Early bird',
        workSchedule: 'Hybrid',
        smoking: 'Non-smoker',
        drinking: 'Socially',
        pets: 'Has cat',
        guests: 'Weekends only',
        socialLevel: 3,
        noiseTolerance: 4,
        cookingHabits: 'Cook often',
        foodPreferences: ['Organic', 'Gluten-free friendly'],
        sharingPreferences: ['Cookware', 'Plants'],
        personality: ['Artistic', 'Calm', 'Mindful'],
        roomPreference: 'Private room',
        parkingNeeded: false,
        furnishedPreference: 'Unfurnished',
        genderPreference: 'Female only',
      },
      profileCompletionScore: 92,
    },
    {
      user: marcusUser._id,
      age: 28,
      gender: 'Male',
      occupation: 'Finance Analyst',
      universityOrCompany: 'Deloitte',
      preferredLocations: ['Downtown Austin', 'South Congress', 'Zilker'],
      budgetMin: 15000,
      budgetMax: 25000,
      moveInDate: new Date('2026-11-01'),
      leaseDuration: '12 months',
      lifestyle: {
        cleanliness: 5,
        sleepSchedule: 'Early bird',
        workSchedule: 'In-office',
        smoking: 'Non-smoker',
        drinking: 'Socially',
        pets: 'No pets',
        guests: 'Rarely',
        socialLevel: 3,
        noiseTolerance: 2,
        cookingHabits: 'Meal prep',
        foodPreferences: ['High protein'],
        sharingPreferences: ['Cleaning supplies'],
        personality: ['Disciplined', 'Athletic', 'Quiet'],
        roomPreference: 'Private room',
        parkingNeeded: true,
        furnishedPreference: 'Furnished',
        genderPreference: 'Any',
      },
      profileCompletionScore: 90,
    },
    {
      user: elenaUser._id,
      age: 24,
      gender: 'Female',
      occupation: 'Graduate Student',
      universityOrCompany: 'UT Austin',
      preferredLocations: ['Hyde Park', 'North Campus', 'Central Austin'],
      budgetMin: 8000,
      budgetMax: 15000,
      moveInDate: new Date('2026-10-01'),
      leaseDuration: '12 months',
      lifestyle: {
        cleanliness: 4,
        sleepSchedule: 'Early bird',
        workSchedule: 'Student',
        smoking: 'Non-smoker',
        drinking: 'Non-drinker',
        pets: 'Pet friendly',
        guests: 'Rarely',
        socialLevel: 2,
        noiseTolerance: 2,
        cookingHabits: 'Cook often',
        foodPreferences: ['Baking', 'Vegetarian'],
        sharingPreferences: ['Tea & Coffee'],
        personality: ['Studious', 'Gentle', 'Reader'],
        roomPreference: 'Private room',
        parkingNeeded: false,
        furnishedPreference: 'Flexible',
        genderPreference: 'Female only',
      },
      profileCompletionScore: 88,
    },
    {
      user: davidUser._id,
      age: 29,
      gender: 'Male',
      occupation: 'Product Manager',
      universityOrCompany: 'Meta',
      preferredLocations: ['Downtown Austin', 'Rainey Street', 'South Congress'],
      budgetMin: 18000,
      budgetMax: 30000,
      moveInDate: new Date('2026-10-15'),
      leaseDuration: '12 months',
      lifestyle: {
        cleanliness: 4,
        sleepSchedule: 'Flexible',
        workSchedule: 'Work from home',
        smoking: 'Non-smoker',
        drinking: 'Socially',
        pets: 'Has dog',
        guests: 'Weekends only',
        socialLevel: 4,
        noiseTolerance: 3,
        cookingHabits: 'Cook often',
        foodPreferences: ['Gourmet', 'Italian'],
        sharingPreferences: ['Espresso machine', 'Sound system'],
        personality: ['Outgoing', 'Foodie', 'Hiker'],
        roomPreference: 'Private room',
        parkingNeeded: true,
        furnishedPreference: 'Unfurnished',
        genderPreference: 'Any',
      },
      profileCompletionScore: 94,
    },
  ];

  await RoommateProfile.insertMany(profilesData);

  // 3. Apartments
  const apartmentsData = [
    {
      title: 'The Skyview Luxury Loft',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      ],
      location: 'Downtown Austin',
      address: '401 Colorado St, Austin, TX 78701',
      monthlyRent: 38000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1150,
      furnished: true,
      amenities: ['Resort Pool', 'Fitness Center', 'In-unit Laundry', 'Rooftop Lounge', 'Concierge', 'High-speed Fiber'],
      availableDate: new Date('2026-10-10'),
      leaseDuration: '12 months',
      description: 'Modern 2BR high-rise apartment with floor-to-ceiling windows overlooking Lady Bird Lake. Fully furnished with designer pieces, quartz countertops, and stainless steel appliances.',
      apartmentType: 'Apartment',
      parking: 'Included',
      petPolicy: 'Pets allowed',
      isFeatured: true,
      createdBy: alexUser._id,
    },
    {
      title: 'Eastside Artisan Flats',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      ],
      location: 'East Austin',
      address: '1201 E 6th St, Austin, TX 78702',
      monthlyRent: 32000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 980,
      furnished: false,
      amenities: ['Private Balcony', 'EV Charging', 'In-unit Laundry', 'Bike Storage', 'Dog Park'],
      availableDate: new Date('2026-10-01'),
      leaseDuration: '12 months',
      description: 'Chic 2-bedroom industrial modern flat steps away from East Austin coffee shops, art galleries, and dining. Hardwood floors and spacious open plan.',
      apartmentType: 'Condo',
      parking: 'Available',
      petPolicy: 'Dogs & cats allowed',
      isFeatured: true,
      createdBy: sarahUser._id,
    },
    {
      title: 'Rainey Street Oasis High-Rise',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ],
      location: 'Rainey Street',
      address: '70 Rainey St, Austin, TX 78701',
      monthlyRent: 48000,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1420,
      furnished: true,
      amenities: ['Infinity Pool', 'Co-working Hub', 'In-unit Washer/Dryer', 'Valet Parking', 'Wine Storage'],
      availableDate: new Date('2026-10-15'),
      leaseDuration: '12 months',
      description: 'Luxury 3-bedroom corner suite featuring panoramic skyline views, custom cabinetry, Nest smart thermostats, and private balcony.',
      apartmentType: 'Apartment',
      parking: 'Included',
      petPolicy: 'Pets allowed',
      isFeatured: true,
      createdBy: davidUser._id,
    },
    {
      title: 'Mueller Park View Residences',
      images: [
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      ],
      location: 'Mueller',
      address: '1900 Aldrich St, Austin, TX 78723',
      monthlyRent: 26000,
      bedrooms: 2,
      bathrooms: 1.5,
      sqft: 920,
      furnished: false,
      amenities: ['Courtyard Garden', 'Pool', 'Fitness Center', 'Solar Powered', 'Walkable Parks'],
      availableDate: new Date('2026-10-01'),
      leaseDuration: '12 months',
      description: 'Eco-friendly modern 2BR apartment facing Mueller Lake Park. Quiet community vibe with local farmer market nearby.',
      apartmentType: 'Apartment',
      parking: 'Included',
      petPolicy: 'Pet friendly',
      isFeatured: false,
    },
    {
      title: 'SoCo Historic Bungalow & Annex',
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      ],
      location: 'South Congress',
      address: '1604 S Congress Ave, Austin, TX 78704',
      monthlyRent: 42000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1300,
      furnished: false,
      amenities: ['Private Backyard', 'Front Porch', 'Hardwood Floors', 'Off-street Parking', 'Washer/Dryer'],
      availableDate: new Date('2026-11-01'),
      leaseDuration: '12 months',
      description: 'Charming remodeled 3BR bungalow in heart of South Congress. Fully updated kitchen with gas range and large shaded backyard.',
      apartmentType: 'House',
      parking: 'Included',
      petPolicy: 'Dogs allowed',
      isFeatured: true,
    },
    {
      title: 'Hyde Park Classic Victorian Duplex',
      images: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      ],
      location: 'Hyde Park',
      address: '4105 Avenue G, Austin, TX 78751',
      monthlyRent: 24000,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 850,
      furnished: false,
      amenities: ['High Ceilings', 'Garden Patio', 'Laundry Facility', 'Shaded Street Parking'],
      availableDate: new Date('2026-10-01'),
      leaseDuration: '12 months',
      description: 'Character-filled upper duplex unit with high ceilings, built-in bookshelves, and tranquil tree-lined surroundings near UT shuttle.',
      apartmentType: 'Condo',
      parking: 'Street',
      petPolicy: 'Cats only',
      isFeatured: false,
    },
  ];

  const createdApartments = await Apartment.insertMany(apartmentsData);

  // 4. Conversations & Messages
  const conv = await Conversation.create({
    participants: [alexUser._id, sarahUser._id],
    lastMessage: 'Hey Sarah! I saw your profile and we have a 92% match score. Interested in looking at 2BRs in East Austin together?',
    lastMessageAt: new Date(),
  });

  await Message.insertMany([
    {
      conversation: conv._id,
      sender: alexUser._id,
      content: 'Hey Sarah! I saw your profile and we have a 92% match score. Interested in looking at 2BRs in East Austin together?',
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      conversation: conv._id,
      sender: sarahUser._id,
      content: 'Hi Alex! Yes absolutely, Eastside Artisan Flats caught my eye! Our budgets align really well.',
      createdAt: new Date(Date.now() - 1800000),
    },
  ]);

  // 5. Saved Apartments
  await SavedApartment.create({
    user: alexUser._id,
    apartment: createdApartments[0]._id,
  });

  await SavedApartment.create({
    user: alexUser._id,
    apartment: createdApartments[1]._id,
  });

  console.log('[Seed] Database seeded successfully with users, profiles, apartments, matches, and chats (INR).');
};

if (process.argv[1]?.endsWith('seed.ts')) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}
