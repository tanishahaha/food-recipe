// pages/api/recipes.ts

import connectDB from "@/utils/connectDB";
import Recipe from "../../../models/Recipe";

connectDB();

export default async function handler(req:any, res:any) {
  if (req.method === 'GET') {
    try {
      const recipes = await Recipe.find({});
      return res.status(200).json({ success: true, data: recipes });
    } catch (error) {
      return res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
  }
  return res.status(405).end();
}
