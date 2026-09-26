import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Apartment } from '../models/Apartment.js';
import { RoommateProfile } from '../models/RoommateProfile.js';
import { SavedApartment } from '../models/SavedApartment.js';
import { MatchingService } from '../services/matchingService.js';

export const getApartments = async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    location,
    minRent,
    maxRent,
    bedrooms,
    bathrooms,
    furnished,
    petPolicy,
    apartmentType,
    page = '1',
    limit = '12',
    sortBy = 'newest',
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 12;
  const skip = (pageNum - 1) * limitNum;

  const filter: any = {};

  if (location) {
    filter.$or = [
      { location: { $regex: new RegExp(location as string, 'i') } },
      { address: { $regex: new RegExp(location as string, 'i') } },
      { title: { $regex: new RegExp(location as string, 'i') } },
    ];
  }

  if (minRent || maxRent) {
    filter.monthlyRent = {};
    if (minRent) filter.monthlyRent.$gte = parseInt(minRent as string, 10);
    if (maxRent) filter.monthlyRent.$lte = parseInt(maxRent as string, 10);
  }

  if (bedrooms && bedrooms !== 'Any') {
    filter.bedrooms = parseInt(bedrooms as string, 10);
  }

  if (bathrooms && bathrooms !== 'Any') {
    filter.bathrooms = parseInt(bathrooms as string, 10);
  }

  if (furnished !== undefined && furnished !== '') {
    filter.furnished = furnished === 'true';
  }

  if (petPolicy && petPolicy !== 'Any') {
    filter.petPolicy = petPolicy;
  }

  if (apartmentType && apartmentType !== 'All') {
    filter.apartmentType = apartmentType;
  }

  let sortOption: any = { createdAt: -1 };
  if (sortBy === 'rent_low') sortOption = { monthlyRent: 1 };
  if (sortBy === 'rent_high') sortOption = { monthlyRent: -1 };
  if (sortBy === 'sqft') sortOption = { sqft: -1 };

  const total = await Apartment.countDocuments(filter);
  const apartments = await Apartment.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .exec();

  // If user is authenticated, check saved status
  let savedIds: string[] = [];
  if (req.user?.userId) {
    const saved = await SavedApartment.find({ user: req.user.userId }).select('apartment');
    savedIds = saved.map((s) => s.apartment.toString());
  }

  const enrichedApartments = apartments.map((apt) => ({
    ...apt.toObject(),
    isSaved: savedIds.includes(apt._id.toString()),
  }));

  res.status(200).json({
    success: true,
    data: {
      apartments: enrichedApartments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
};

export const getApartmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const apartment = await Apartment.findById(id);
  if (!apartment) {
    res.status(404).json({ success: false, message: 'Apartment not found.' });
    return;
  }

  let isSaved = false;
  let userProfile: any = null;
  let combinedMatchInfo: any = null;

  if (req.user?.userId) {
    const saved = await SavedApartment.findOne({ user: req.user.userId, apartment: id });
    isSaved = !!saved;

    userProfile = await RoommateProfile.findOne({ user: req.user.userId });
  }

  // Find top compatible roommates for this apartment
  const otherProfiles = await RoommateProfile.find(
    req.user?.userId ? { user: { $ne: req.user.userId } } : {}
  )
    .populate('user', 'name email avatar bio role')
    .limit(5);

  const compatibleRoommates = otherProfiles.map((p) => {
    let combinedRes = null;
    if (userProfile) {
      combinedRes = MatchingService.calculateCombinedMatch([userProfile, p], apartment);
    }
    return {
      profile: p,
      user: p.user,
      combinedMatch: combinedRes,
    };
  });

  // Similar apartments in same area
  const similarApartments = await Apartment.find({
    _id: { $ne: id },
    location: apartment.location,
  })
    .limit(3)
    .exec();

  res.status(200).json({
    success: true,
    data: {
      apartment: {
        ...apartment.toObject(),
        isSaved,
      },
      compatibleRoommates,
      similarApartments,
    },
  });
};

export const createApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const apartment = await Apartment.create({
    ...req.body,
    createdBy: req.user?.userId,
  });

  res.status(201).json({
    success: true,
    data: apartment,
  });
};

export const updateApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const apartment = await Apartment.findByIdAndUpdate(id, req.body, { new: true });
  if (!apartment) {
    res.status(404).json({ success: false, message: 'Apartment not found.' });
    return;
  }

  res.status(200).json({
    success: true,
    data: apartment,
  });
};

export const deleteApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const apartment = await Apartment.findByIdAndDelete(id);
  if (!apartment) {
    res.status(404).json({ success: false, message: 'Apartment not found.' });
    return;
  }

  // Clean up saved apartment links
  await SavedApartment.deleteMany({ apartment: id });

  res.status(200).json({
    success: true,
    message: 'Apartment deleted successfully.',
  });
};
