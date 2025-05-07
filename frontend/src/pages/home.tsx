import React from "react";
import { Link } from "react-router-dom";


const Home: React.FC = () => {
  return (
    <div>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
            <section className=" block bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
                <div className="container mx-auto px-4 pb-1 pt-0 py-8">
                  <div>
                    <h1 className="text-4xl font-bold text-center mb-6">Welcome to Our Online Learning Platform</h1>
                    <p className="text-lg text-gray-700 mb-2 text-center">
                        Discover a world of knowledge at your fingertips. Join us today and start your learning journey!
                    </p>
                  </div>
                </div>
                <div className="container mx-auto pl-4 pr-4 pt-0 py-8">
                  <div className="text-center mb-6 text-gray-700 font-semibold ">
                    <h1>For future interaction login or signup</h1>
                  </div>
                  <div className="flex items-center ">
                    <p className="block text-center h-100 w-100 p-0"><br />
                      <Link to='/login' className="text-gray-700">
                      <span className="container mx-auto px-12 font-bold shadow-md text-2xl hover:bg-blue-400 hover:text-white rounded-lg p-2">
                        Login
                      </span>
                    </Link>
                    
                    <Link to="/signup" className="text-gray-700 hover:text-blue-600 font-medium ">
                      <span className="container mx-auto px-12 font-bold shadow-md text-2xl hover:bg-blue-400 hover:text-white rounded-lg p-2 z-50">
                        Signup
                      </span>
                    </Link>
                    <div>
                      <p className="text-gray-700 font-semibold text-center mt-4">
                        <h2 className="text-amber-500">Instruction</h2>
                      </p>
                    </div>
                    </p>
                    <img src="/ideas.png" alt="" className="h-100 "/>
                  </div>
                </div>
            </section>
        </div>
    </div>
    
  );
}

export default Home;