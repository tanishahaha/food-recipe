import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/connectDB';
import Recipe from '../../../models/Recipe';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'DELETE':
      try {
        // Ensure the id is valid
        if (!id) {
          return res.status(400).json({ success: false, message: 'Invalid recipe ID' });
        }

        // Delete the recipe by its ID
        await Recipe.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
