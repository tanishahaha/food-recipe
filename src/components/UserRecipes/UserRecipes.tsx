import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserRecipesProps {
  userId: string;
}

const UserRecipes: React.FC<UserRecipesProps> = ({ userId }) => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editRecipe, setEditRecipe] = useState<any | null>(null);
  const [updatedRecipeData, setUpdatedRecipeData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    image: '',
  });
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        if (!userId) return;

        const response = await axios.get(`/api/userrecipes?userId=${userId}`);
        setRecipes(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user recipes:', error);
        setError('Failed to fetch recipes');
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [userId]);

  const handleEdit = (recipe: any) => {
    setEditRecipe(recipe);
    setUpdatedRecipeData({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image: recipe.image,
    });
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/update?id=${editRecipe._id}`, updatedRecipeData);
    const updatedRecipe = response.data.data;

    // Update the recipe in the state
    setRecipes(recipes.map(recipe => recipe._id === updatedRecipe._id ? updatedRecipe : recipe));
    setShowEditForm(false);
      // fetchUserRecipes();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const handleDelete = async (recipeId: string) => {
    try {
      await axios.delete(`/api/delete?id=${recipeId}`);

      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) return <p>Loading user recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Your Recipes</h1>
      <p>{userId}</p>
      {recipes.length === 0 ? (
        <p>No recipes added.</p>
      ) : (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-item">
              <h2>{recipe.title}</h2>
              <img src={recipe.image} alt={recipe.title} width={200} height={200} />
              <p>{recipe.description}</p>
              <p>Ingredients: {recipe.ingredients}</p>
              <p>Instructions: {recipe.instructions}</p>
              <button onClick={() => handleEdit(recipe)}>Edit</button>
              <button onClick={() => handleDelete(recipe._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
      {showEditForm && (
        <div className="edit-form">
          <h3>Edit Recipe</h3>
          <input
            type="text"
            value={updatedRecipeData.title}
            onChange={e => setUpdatedRecipeData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Recipe Title"
          />
          <textarea
            value={updatedRecipeData.description}
            onChange={e => setUpdatedRecipeData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Recipe Description"
          ></textarea>
          <input
            type="text"
            value={updatedRecipeData.ingredients}
            onChange={e => setUpdatedRecipeData(prev => ({ ...prev, ingredients: e.target.value }))}
            placeholder="Ingredients (comma separated)"
          />
          <textarea
            value={updatedRecipeData.instructions}
            onChange={e => setUpdatedRecipeData(prev => ({ ...prev, instructions: e.target.value }))}
            placeholder="Instructions"
          ></textarea>
          <input
            type="file"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setUpdatedRecipeData(prev => ({ ...prev, image: reader.result as string }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <button onClick={handleUpdate}>Update Recipe</button>
          <button onClick={() => setShowEditForm(false)}>Cancel</button>
        </div>
      )}

    </div>
  );
};

export default UserRecipes;
