// pages/api/userRecipes.ts

import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import Recipe from '../../../models/Recipe'; // Adjust the path based on your project structure

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { userId } = req.query;

  try {
    const recipes = await Recipe.find({ createdBy: userId }).lean(); // Assuming 'createdBy' is the field in the Recipe model
    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
}
