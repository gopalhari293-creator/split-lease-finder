import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { SavedApartment } from '../models/SavedApartment.js';
import { Apartment } from '../models/Apartment.js';

export const getSavedApartments = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const savedItems = await SavedApartment.find({ user: userId })
    .populate('apartment')
    .sort({ createdAt: -1 })
    .exec();

  const apartments = savedItems
    .filter((item) => item.apartment !== null)
    .map((item) => ({
      ...(item.apartment as any).toObject(),
      isSaved: true,
      savedAt: item.createdAt,
    }));

  res.status(200).json({
    success: true,
    data: apartments,
  });
};

export const saveApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { apartmentId } = req.params;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const apartmentExists = await Apartment.findById(apartmentId);
  if (!apartmentExists) {
    res.status(404).json({ success: false, message: 'Apartment not found.' });
    return;
  }

  const existing = await SavedApartment.findOne({ user: userId, apartment: apartmentId });
  if (!existing) {
    await SavedApartment.create({ user: userId, apartment: apartmentId });
  }

  res.status(201).json({
    success: true,
    message: 'Apartment saved successfully.',
  });
};

export const removeSavedApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { apartmentId } = req.params;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  await SavedApartment.deleteOne({ user: userId, apartment: apartmentId });

  res.status(200).json({
    success: true,
    message: 'Apartment removed from saved list.',
  });
};
