import React from "react";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  return (
    <div>
        <header>
            <Navbar/>
        </header>
        
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to the Home Page!</h1>
        </div>
    </div>
    
  );
}

export default Home;