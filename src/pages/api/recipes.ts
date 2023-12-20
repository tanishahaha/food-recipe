import { NextApiRequest, NextApiResponse } from "next";
import multer from 'multer';
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import Recipe, { Recipe as RecipeType } from "../../../models/Recipe";
import fs from 'fs';
import path from 'path';

connectDB();

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

let imageCount = 1;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
} else {
  const existingImages = fs.readdirSync(UPLOAD_DIR);
  imageCount = existingImages.length + 1;
}

export const config ={
  api:{
    externalResolver:true,
    bodyParser:false,
  }
}

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

      const imageName = `${imageCount}.png`;
      const imagePath = path.join(UPLOAD_DIR, imageName);

      fs.writeFileSync(imagePath, req.file?.buffer);

      const newRecipeData: Partial<RecipeType> = {
        title,
        description,
        ingredients,
        instructions,
        image: `/uploads/${imageName}`, // Relative URL of the image
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
