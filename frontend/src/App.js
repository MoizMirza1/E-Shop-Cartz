import React from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import { LoginPage,SignupPage } from './Routes.js';


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/Login' element={<LoginPage/>}/>
      <Route path='/sign-up' element={<SignupPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
