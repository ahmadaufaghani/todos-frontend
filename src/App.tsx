import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import { Routes, Route } from 'react-router';
import { AuthProvider } from './utils/auth';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import HomePage from './pages/HomePage/HomePage';
import ProtectedRoute from './utils/ProtectedRoute';
import Register from './pages/Register/Register';

function App() {
  return (
  <AuthProvider>
    <ToastContainer/>
     <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/home' element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          }/>
          <Route path='/' element={<LandingPage/>}/>
      </Routes>
  </AuthProvider>
  ); 
}

export default App;
