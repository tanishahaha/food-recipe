import React,{useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

const Login:React.FC=()=>{

  const [email,setEmail]=useState<string>('');
  const [password,setPassword]=useState<string>('');
  const [error,setError]=useState<string>('');
  const router = useRouter();

  const onSubmitButton=async()=>{

    try{
      const response=await axios.post(`/api/login`,{email,password});

      if(response.data.success){
        Cookies.set('token',response.data.token,{expires: 5});
        setError('');
        router.push("/");

      }else{
        setError(response.data.msg || 'an error occured');
      }

    }catch(error:any){
      console.log('login failed',error.response?.data?.msg);
      setError('login failed '+error.response?.data?.msg)
    }
  }
  return(
    <div>
      <div>
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="button" onClick={onSubmitButton}>Login</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  )
}
export default Login;