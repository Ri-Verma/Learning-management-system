import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const formOptions = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address"
    }
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters"
    }
  }
};

const Login: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userType === 'student') {
        navigate('/user/student');
      } else if (user.userType === 'instructor') {
        navigate('/user/instructor');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await login(data.email, data.password);
      
      // Navigate based on user type
      if (userData.userType === 'student') {
        navigate('/user/student');
      } else if (userData.userType === 'instructor') {
        navigate('/user/instructor');
      }
    } catch (err) {
      setError("Invalid email or password");
      reset({ password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center min-h-screen">
        <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800">Login to your account</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <div>
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  {...register("email", formOptions.email)}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  {...register("password", formOptions.password)}
                />
                {errors.password && (
                  <span className="text-xs text-red-500">{errors.password.message}</span>
                )}
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              {error && (
                <div className="mt-4">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 text-white rounded-lg transition-colors ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-900'
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <a 
                  href="/register" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Don't have an account?
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;