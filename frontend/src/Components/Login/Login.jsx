import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import image from '../../Assets/Images/Brandlogo.png'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { server } from "../../server"
import axios from "axios";
import { toast } from "react-toastify";



const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // email input

  const [password, setPassword] = useState(""); // password input

  const [visible, setVisible] = useState(false); // eye icon visible or not

  const [isFocused, setisFocused] = useState(false); // eye icon is visible when focused or blur

  const focushandler = () => {
    setisFocused(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${server}/user/login-user`, { email, password }, { withCredentials: true }).then((res)=>{
      toast.success("Login Successfull")        
      })
      const data = response.data;
  
      toast.success("Login Successful");
      toast.success("Welcome to E-Shop");
  
      // Assuming navigate is a function that redirects to a specific route
      navigate("/");
  
      console.log(data);
    
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during login");
      console.log(error);
      navigate("/");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex justify-center  ">
        <img src={image} className="h-20 w-30 mt-[-30px]" alt="My-brand-logo"></img>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="flex justify-center mb-3 text-base text-center font-extralight ">
          Login your google account
        </h2>
        <h2 className="mt-[-5px] text-center text-xl font-light text-grey-800 font-Roboto">
          Sign in
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text--700 mb-[-15px]"
                htmlFor="email"
              >
                Email Address
              </label>
            </div>

            {/* email */}
            <div className="mt-1">
              <input
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password  */}
            <div>
              <label
                className="block text-sm font-medium text--700 mb-[-15px]"
                htmlFor="password"
              >
                Password
              </label>
            </div>
            <div className="mt-1 relative">
              <input
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                type={visible ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                autoComplete="current-password"
                required
                value={password}
                onFocus={focushandler} // focus and show eye icon
                onChange={(e) => setPassword(e.target.value)}
              />
              {isFocused && (
                <>
                  {visible ? (
                    <AiOutlineEyeInvisible
                      onClick={() => setVisible(false)}
                      className="absolute right-2 top-3.5 cursor-pointer w-5 h-5 text-gray-500 hover:text-blue-500"
                    />
                  ) : (
                    <AiOutlineEye
                      onClick={() => setVisible(true)}
                      className="absolute right-2 top-3.5 cursor-pointer w-5 h-5 text-gray-500 hover:text-blue-500"
                    />
                  )}
                </>
              )}
            </div>
            <div className="flex justify-between item-center">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <input
                    className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    type="checkbox"
                    name="remember me"
                    id="remember me"
                  />
                  <lable
                    htmlFor="remember me"
                    className=" block text-blue-600 px-2 underline underline-offset-1 text-sm font-normal cursor-default hover:text-cyan-500"
                  >
                    remember me?
                  </lable>
                </div>
              </div>
              <div className="text-sm flex flex-end">
                <a
                  href=".forgot-password"
                  className="font-medium text-blue-600 flex center text-sm font-bolder  "
                >
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div className="justify-between flex-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm font-regular w-full"
                type="submit"
              >
                Sign in
              </button>
            </div>
            <div className="flex justify-center">
            <h4 className="font-regular">Not have an account?</h4>
              <Link to = '/sign-up' className="text-blue-600 pl-2 underline underline-offset-1">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
