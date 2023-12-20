import { NextApiRequest, NextApiResponse } from "next";
import multer from 'multer';
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import Recipe, { Recipe as RecipeType } from "../../../models/Recipe";
import cloudinary from 'cloudinary';

connectDB();

// Configure Cloudinary (Ensure to set these values securely, preferably using environment variables)
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  upload.single('image')(req, res, async (error: any) => {
    if (error) {
      console.error(error);
      return res.status(400).json({ success: false, msg: 'Image upload failed' });
    }

    try {
      const { title, description, ingredients, instructions, createdBy } = req.body;

      // Upload image to Cloudinary
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.buffer, {
        folder: 'uploads',
      });

      const newRecipeData: Partial<RecipeType> = {
        title,
        description,
        ingredients,
        instructions,
        image: uploadResult.secure_url, // Use the Cloudinary URL as the image URL
        createdBy: new mongoose.Types.ObjectId(createdBy),
      };

      const newRecipe = new Recipe(newRecipeData);
      await newRecipe.save();

      return res.status(201).json({ success: true, data: newRecipe, msg: 'Recipe added successfully' });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
  });
};

export default handler;
