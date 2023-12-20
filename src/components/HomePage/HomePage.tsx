import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RecipeForm, RecipeList,UserRecipes } from '../componentIndex';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null); 

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
          setUserId(response.data.user._id);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Hi {user.name}</h1>
          <p>Email: {user.email}</p>

          <h1>add recipe</h1>
          <RecipeForm userId={userId} />

          <RecipeList />


          {/* <h1>Your Recipes</h1> */}
          {userId && <UserRecipes userId={userId} />}

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
