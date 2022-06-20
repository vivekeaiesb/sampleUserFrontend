import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import React from 'react'
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoutes from './pages/ProtectedRoutes';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<ProtectedRoutes />}>
                <Route path="/home" element={<Home />} />
          </Route>
          <Route path='/' element={<Login/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </div>
)
}

export default App
