import { NextApiRequest, NextApiResponse } from "next";
import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import Recipe, { Recipe as RecipeType } from "../../../models/Recipe";

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.STORAGE_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.STORAGE_API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.STORAGE_API_SECRET // Replace with your Cloudinary API secret
});

const UPLOAD_DIR = path.join(process.cwd(), 'tmp'); // Adjust directory for temporary files

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`); // Generate unique filename
  }
});

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

      const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: 'image',
        // Optional: Add transformations or other upload options here
      });

      const imageUrl = uploadedImage.secure_url;

      fs.unlinkSync(req.file.path); // Delete the temporary file

      const newRecipeData: Partial<RecipeType> = {
        title,
        description,
        ingredients,
        instructions,
        image: imageUrl, // Store the Cloudinary image URL
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
export const config ={
  api:{
    externalResolver:true,
    bodyParser:false,
  }
}
export default handler;

