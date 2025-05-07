import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Render different navigation items based on user type
  const renderNavItems = () => {
    if (!isAuthenticated) {
      return (
        <>
          <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Home</a>
          <a href="../pages/cources" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Cources</a>
          <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">About Us</a>
        </>
      );
    }

    if (user?.userType === 'student') {
      return (
        <>
          <a href="/courses/my-courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">My Courses</a>
          <a href="/assignments" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Assignments</a>
          <a href="/quizzes" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Quizzes</a>
        </>
      );
    }

    if (user?.userType === 'instructor') {
      return (
        <>
          <a href="/courses/manage" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Manage Courses</a>
          <a href="/assignments/create" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Create Assignment</a>
          <a href="/quizzes/create" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Create Quiz</a>
        </>
      );
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to={isAuthenticated ? `/user/${user?.userType}` : '/'} 
                
              >
                <img 
                  src="/lms_0.png" 
                  alt="Logo" 
                  className="h-15 w-auto" 
                />
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex space-x-8">
              {renderNavItems()}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link to={`/user/${user?.userType}`} className="text-gray-700 hover:text-blue-600 font-medium">
                      Welcome, {user?.name}
                    </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Home</a>
              
              {/* Mobile Quiz Dropdown */}
              <div>
                <button 
                  onClick={() => toggleDropdown('mobile-quiz')}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <span>Quiz</span>
                  <svg 
                    className={`ml-1 w-5 h-5 transition-transform ${activeDropdown === 'mobile-quiz' ? 'transform rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
                
                {activeDropdown === 'mobile-quiz' && (
                  <div className="pl-6 pr-2 py-2">
                    <a href="/quiz/all" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">All Quizzes</a>
                    <a href="/quiz/my-quizzes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">My Quizzes</a>
                    <a href="/quiz/create" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Create Quiz</a>
                  </div>
                )}
              </div>
              
              {/* Mobile Assignment Dropdown */}
              <div>
                <button 
                  onClick={() => toggleDropdown('mobile-assignment')}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <span>Assignment</span>
                  <svg 
                    className={`ml-1 w-5 h-5 transition-transform ${activeDropdown === 'mobile-assignment' ? 'transform rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
                
                {activeDropdown === 'mobile-assignment' && (
                  <div className="pl-6 pr-2 py-2">
                    <a href="/assignment/all" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">All Assignments</a>
                    <a href="/assignment/my-assignments" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">My Assignments</a>
                    <a href="/assignment/submit" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Submit Assignment</a>
                  </div>
                )}
              </div>
              
              {/* Mobile Courses Dropdown */}
              <div>
                <button 
                  onClick={() => toggleDropdown('mobile-courses')}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <span>Courses</span>
                  <svg 
                    className={`ml-1 w-5 h-5 transition-transform ${activeDropdown === 'mobile-courses' ? 'transform rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
                
                {activeDropdown === 'mobile-courses' && (
                  <div className="pl-6 pr-2 py-2">
                    <a href="/courses/all" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">All Courses</a>
                    <a href="/courses/my-courses" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">My Courses</a>
                    <a href="/courses/calendar" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Course Calendar</a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5 space-x-3">
                {isAuthenticated ? (
                  <>

                    <Link to={`/user/${user?.userType}`} className="block w-40 px-1 py-2 border-amber-600 text-gray-700 rounded-md shadow-sm text-base font-medium  hover:bg-indigo-500 hover:text-white">
                      Welcome, {user?.name}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50">
                      Login
                    </Link>
                    <Link to="/signup" className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
