import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]:e.target.value });
  };

  const signupHandler = async(e) => {
    e.preventDefault();
    console.log(input);
    try {
       setLoading(true);
       const res = await axios.post("http://localhost:8000/api/v1/user/login", input, {
         withCredentials: true
       })
       if(res.data.success){
         dispatch(setAuthUser(res?.data?.user));
         localStorage.setItem("token", res?.data?.token);
         toast.success(res?.data.message);
         navigate('/');
         setInput({
            email: "",
            password: ""
         })
       }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">Signup to watch video-content from ReTube</p>
        </div>
        <div>
          <Label htmlFor="email" className="font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label htmlFor="password" className="font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        {
          loading ? (
            <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please wait
            </Button>
          ) : (
            <Button type="submit" className="cursor-pointer">Login</Button>
          )   
        }
 
        <span className="text-center">Doesn't have an account? <Link to='/signup' className="text-blue-600">SignUp</Link></span>
      </form>
    </div>
  );
};

export default Login;
