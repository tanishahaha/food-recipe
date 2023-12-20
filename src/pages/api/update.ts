import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/connectDB';
import Recipe from '../../../models/Recipe';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case 'PUT':
      try {
        // Ensure the id is valid
        if (!id) {
          return res.status(400).json({ success: false, message: 'Invalid recipe ID' });
        }

        // Find the recipe by its ID and update it
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, body, { new: true });

        if (!updatedRecipe) {
          return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        res.status(200).json({ success: true, data: updatedRecipe });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
