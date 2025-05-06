import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/login';
import Signup from './pages/signup';
import './App.css';
import Home from './pages/home';
import UserStudent from './pages/user_Student';
import UserInstructor from './pages/user_instructor';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user/student" element={<UserStudent />} />
            <Route path="/user/instructor" element={<UserInstructor />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
