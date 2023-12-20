// components/RecipeList.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/viewrecipes');
        setRecipes(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading recipes...</p>;

  return (
    <div>
      <h1>Recipes</h1>
      
      {/* Search input */}
      <input 
        type="text" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search recipes..."
      />

      <div className="recipe-list">
        {filteredRecipes.length === 0 ? (
          <p>No matching recipes found.</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-item">
              <h2>{recipe.title}</h2>
              <Image src={recipe.image} alt={recipe.title} width={200} height={200}/>
              <p>{recipe.description}</p>
              <p>Ingredients: {recipe.ingredients}</p>
              <p>Instructions: {recipe.instructions}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeList;
