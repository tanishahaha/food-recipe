import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";


const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();


  const onSubmitButton = async () => {
    try {
      const response = await axios.post(
        `/api/users`,
        {
          name,
          email,
          password,
        }
      );
  
      if (response.data.success) {
        alert("Signup successful!");
        Cookies.set('token', response.data.token, { expires: 5 }); // Expires in 5 days
        setError('');
        router.push("/");
        
      } else {
        setError(response.data.msg || 'An error occurred');
      }
    } catch (error: any) {
      console.error('Signup failed:', error.response?.data?.msg || error.message);
      
      if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };
  

  return (
    <div>
      <div>
        <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="button" onClick={onSubmitButton}>Sign up</button>
        <p>Already have an account? <Link href="/login">Login</Link></p>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
