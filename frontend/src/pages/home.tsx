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
                  <div className="flex justify-center mb-0 h-10">
                    <img src="/l18.png" alt="" />
                  </div>
                </div>
                <div className="container mx-auto pl-4 pr-4 pt-0 py-8">
                  <div className="text-center mb-6 text-gray-700 font-semibold ">
                    <h1>For future interaction login or signup</h1>
                  </div>
                  <div className="flex justify-between items-center ">
                    <p className="block text-center h-100 w-100 p-40"><br /><span className="container mx-auto px-12 font-bold shadow-md text-2xl hover:">
                      <Link to='/login' className="text-gray-700 hover:text-blue-600 font-medium">
                      Login
                    </Link>
                    </span><br /><span className="font-bold shadow-md container mx-auto px-10 text-2xl">
                    <Link to="/signup" className="text-gray-700 hover:text-blue-600 font-medium">
                      Signup
                    </Link></span></p>
                    <img src="/ideas.png" alt="" className="h-100 float-right block"/>
                  </div>
                </div>
            </section>
        </div>
    </div>
    
  );
}

export default Home;