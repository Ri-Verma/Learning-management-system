import { useState } from 'react';

interface DropdownItem {
  label: string;
  link: string;
}

interface NavItem {
  label: string;
  link: string;
  dropdown?: DropdownItem[];
}

const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define navigation items with their dropdowns
  const navItems: NavItem[] = [
    {
      label: 'Home',
      link: '/',
    },
    {
      label: 'Quiz',
      link: '/quiz',
      dropdown: [
        { label: 'All Quizzes', link: '/quiz/all' },
        { label: 'My Quizzes', link: '/quiz/my-quizzes' },
        { label: 'Create Quiz', link: '/quiz/create' },
      ],
    },
    {
      label: 'Assignment',
      link: '/assignment',
      dropdown: [
        { label: 'All Assignments', link: '/assignment/all' },
        { label: 'My Assignments', link: '/assignment/my-assignments' },
        { label: 'Submit Assignment', link: '/assignment/submit' },
      ],
    },
    {
      label: 'Courses',
      link: '/courses',
      dropdown: [
        { label: 'All Courses', link: '/courses/all' },
        { label: 'My Courses', link: '/courses/my-courses' },
        { label: 'Course Calendar', link: '/courses/calendar' },
      ],
    },
  ];

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setActiveDropdown(null);
    }
  };

  return (
    <nav className="bg-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-xl font-bold">LMS</a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <div 
                  key={item.label} 
                  className="relative group"
                  onMouseEnter={() => item.dropdown && toggleDropdown(item.label)}
                  onMouseLeave={closeDropdowns}
                >
                  <a 
                    href={item.link} 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                  
                  {/* Dropdown menu */}
                  {item.dropdown && (
                    <div 
                      className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-200 ${
                        activeDropdown === item.label ? 'opacity-100' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                      }`}
                    >
                      <div className="py-1">
                        {item.dropdown.map((dropdownItem) => (
                          <a
                            key={dropdownItem.label}
                            href={dropdownItem.link}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                          >
                            {dropdownItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href="/login" 
              className="px-3 py-1.5 border border-white rounded-md text-sm font-medium hover:bg-white/10 transition-colors duration-200"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="px-3 py-1.5 bg-blue-500 border border-blue-500 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-slate-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <div key={item.label}>
              <div 
                className="flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700"
                onClick={() => item.dropdown && toggleDropdown(item.label)}
              >
                <a href={item.link}>{item.label}</a>
                {item.dropdown && (
                  <svg 
                    className={`ml-2 h-5 w-5 transition-transform ${activeDropdown === item.label ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Mobile dropdown */}
              {item.dropdown && activeDropdown === item.label && (
                <div className="pl-4 pr-2 py-2 bg-slate-700 rounded-md mt-1">
                  {item.dropdown.map((dropdownItem) => (
                    <a
                      key={dropdownItem.label}
                      href={dropdownItem.link}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-600"
                    >
                      {dropdownItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile auth buttons */}
        <div className="pt-4 pb-3 border-t border-slate-700">
          <div className="flex items-center justify-center space-x-3 px-5">
            <a 
              href="/login" 
              className="px-4 py-2 border border-white rounded-md text-sm font-medium hover:bg-white/10 transition-colors duration-200 w-full text-center"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="px-4 py-2 bg-blue-500 border border-blue-500 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200 w-full text-center"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
