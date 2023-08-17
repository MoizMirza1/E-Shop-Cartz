import React from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import { LoginPage,SignupPage,ActivationPage } from './Routes.js';
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import { server } from './server';
import axios from 'axios';



const App = () => {
  useEffect( () =>{
    axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res) => {
      console.log(res.data)
    }).catch((err) =>{
      console.log("Local host: 3000 (error)" , err)
      // toast.error("Local host :3000 (error)", err);
    })
  }, [])


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/Login' element={<LoginPage/>}/>
      <Route path='/sign-up' element={<SignupPage/>}/>
      <Route path='/activation/:activation_token' element={<ActivationPage/>}/>

    </Routes>
    {/* <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/> */}
    </BrowserRouter>
  )
}

export default App;
