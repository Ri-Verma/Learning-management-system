import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/login';
import Signup from './pages/signup';
import './App.css';
import Home from './pages/home';
import UserStudent from './pages/user_Student';
import UserInstructor from './pages/user_instructor';
import TakeQuiz from './pages/TakeQuiz';
import { useAuth } from './hooks/useAuth';
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Home Route Component
const HomeRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.userType === 'student') {
      return <Navigate to="/user/student" />;
    } else if (user?.userType === 'instructor') {
      return <Navigate to="/user/instructor" />;
    }
  }

  return <Home />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/user/student" 
                element={
                  <ProtectedRoute>
                    <UserStudent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/instructor" 
                element={
                  <ProtectedRoute>
                    <UserInstructor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quiz/:quizId" 
                element={
                  <ProtectedRoute>
                    <TakeQuiz />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
