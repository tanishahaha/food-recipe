import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RecipeList } from '../componentIndex';
// import { handleRecipeChange } from '../RecipeList/RecipeList';

const RecipeForm: React.FC<{ userId: string | null }> = ({ userId }) => {
  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     try {
  //       <RecipeList/>
  //     } catch (error) {
  //       console.error('Error fetching recipes:', error);
  //     }
  //   };
  //   fetchRecipes();
  // }, []);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('createdBy', userId || '');
    if (image) {
      formData.append('image', image);
    }

    try {
      console.log(formData);
      const response = await axios.post('/api/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      if (response.data.success) {
        setError('');
        setTitle('');
        setDescription('');
        setIngredients('');
        setInstructions('');
        setImage(null);
        // <RecipeList/>
        // Handle success scenario
      } else {
        setError(response.data.msg || 'Unknown error');
      }

    } catch (error) {
      setError( 'Network error');
    }
  };

  

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Ingredients (comma-separated)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
        <textarea placeholder="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} required /> 
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} required />
        <button type="submit">Add Recipe</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default RecipeForm;



