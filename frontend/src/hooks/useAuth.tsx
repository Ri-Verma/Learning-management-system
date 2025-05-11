import { useState, useContext, createContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Updated User interface to include i_id and s_id
interface User {
  i_id?: string;  
  s_id?: string;  
  name: string;
  email: string;
  userType: 'student' | 'instructor';
  department?: string;
  semester?: number;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  userType: 'student' | 'instructor';
  department?: string;
  semester?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('user'));

  // Add effect to sync authentication state
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Validate the received data
      if (!data.name || !data.email || !data.userType) {
        throw new Error('Invalid user data received');
      }

      const userData: User = {
        ...data,
        i_id: data.userType === 'instructor' ? data.i_id : undefined,
        s_id: data.userType === 'student' ? data.s_id : undefined,
      };

      if (userData.userType === 'instructor' && !userData.i_id) {
        throw new Error('Missing instructor ID');
      }
      if (userData.userType === 'student' && !userData.s_id) {
        throw new Error('Missing student ID');
      }

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      
      // Validate received data
      if (!data.name || !data.email || !data.userType) {
        throw new Error('Invalid user data received');
      }

      setUser(data);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}