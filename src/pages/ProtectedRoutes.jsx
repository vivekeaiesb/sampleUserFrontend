import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import jwt_decode from "jwt-decode";


const useAuth =()=>{
    if(localStorage.getItem('token') !== "null" && jwt_decode(localStorage.getItem('token')).exp > Date.now() / 1000){
      return true;
    }
    else{
      return false;
    }
  }


const ProtectedRoutes = () => {
 const auth = useAuth()
  return auth === true ? <Outlet/> : <Navigate to={"/login"}/>
}

export default ProtectedRoutes
