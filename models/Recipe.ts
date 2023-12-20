import mongoose,{Document,Schema,Types} from "mongoose";

export interface Recipe extends Document {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  image: string | null;
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}


const recipeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  
  instructions: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Recipe =mongoose.models.Recipe || mongoose.model<Recipe>('Recipe', recipeSchema);

export default Recipe;