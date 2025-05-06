import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import UserStudent from "./user_Student";
import UserInstructor from "./user_instructor";

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{
    email: string;
    password: string;
  }>();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);


      /// Test code

        const user = JSON.parse(localStorage.getItem("user") || "{}");


        if (data. === "student") {
        navigate("/StudentDashboard"); // Redirect to student dashboard

        }
      // navigate("/"); 
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
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
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && (
                  <span className="text-xs text-red-500">{errors.password.message}</span>
                )}
              </div>
              {error && (
                <div className="mt-4">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Login
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