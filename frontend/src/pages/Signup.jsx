import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]:e.target.value });
  };

  const signupHandler = async(e) => {
    e.preventDefault();
    console.log(input);
    try {
       setLoading(true);
       const res = await axios.post("https://streamapp-ufpw.onrender.com/api/v1/user/register", input, {
         headers: {
            'Content-Type':'application/json'
         },
         withCredentials: true
       })
       if(res.data.success){
         toast.success(res?.data.message);
         navigate('/login');
         setInput({
            username: "",
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
          <Label htmlFor="username" className="font-medium">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            name="username"
            value={input?.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label htmlFor="email" className="font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={input?.email}
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
            value={input?.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {
           loading ? (
             <Button>
                <Loader2 className="mr-2 w-4 h-4 animate-spin"/>
                Please wait
             </Button>
           ) : (
            <Button type="submit">Signup</Button>
           )
        }
        <span className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
      </form>
    </div>
  );
};

export default Signup;
