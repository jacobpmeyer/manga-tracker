import { Request, Response } from 'express';
import Manga from '../models/Manga';
import * as malService from '../services/malService';

// Get all manga for a user
export const getUserManga = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const manga = await Manga.find({ userId }).sort({ addedAt: -1 });
    res.json(manga);
  } catch (error) {
    console.error('Error fetching user manga:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add manga to user collection
export const addManga = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { malId, status, ownership } = req.body;

    // Check if manga already exists for this user
    const existingManga = await Manga.findOne({ userId, malId });
    if (existingManga) {
      return res.status(400).json({ error: 'Manga already in your collection' });
    }

    // Fetch manga details from MAL
    const mangaDetails = await malService.getMangaById(malId);

    // Create new manga entry
    const manga = new Manga({
      userId,
      malId,
      title: mangaDetails.title,
      description: mangaDetails.description,
      coverImage: mangaDetails.coverImage,
      status: status || 'To Be Read',
      ownership: ownership || 'Owned',
      statusHistory: [
        { status: status || 'To Be Read', timestamp: new Date() }
      ]
    });

    await manga.save();
    res.status(201).json(manga);
  } catch (error) {
    console.error('Error adding manga:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update manga status
export const updateMangaStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { mangaId } = req.params;
    const { status } = req.body;

    const manga = await Manga.findOne({ _id: mangaId, userId });
    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    // Update status and add to history
    manga.status = status;
    manga.statusHistory.push({ status, timestamp: new Date() });

    await manga.save();
    res.json(manga);
  } catch (error) {
    console.error('Error updating manga status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update manga ownership
export const updateMangaOwnership = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { mangaId } = req.params;
    const { ownership } = req.body;

    const manga = await Manga.findOneAndUpdate(
      { _id: mangaId, userId },
      { ownership },
      { new: true }
    );

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    res.json(manga);
  } catch (error) {
    console.error('Error updating manga ownership:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete manga from collection
export const deleteManga = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { mangaId } = req.params;

    const manga = await Manga.findOneAndDelete({ _id: mangaId, userId });
    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    res.json({ message: 'Manga removed from collection' });
  } catch (error) {
    console.error('Error deleting manga:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search MAL for manga
export const searchManga = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await malService.searchMangaByTitle(query);
    res.json(results);
  } catch (error) {
    console.error('Error searching manga:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get manga by MAL ID
export const getMangaByMalId = async (req: Request, res: Response) => {
  try {
    const { malId } = req.params;

    if (!malId) {
      return res.status(400).json({ error: 'MAL ID is required' });
    }

    const mangaDetails = await malService.getMangaById(parseInt(malId));
    res.json(mangaDetails);
  } catch (error) {
    console.error('Error fetching manga by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
