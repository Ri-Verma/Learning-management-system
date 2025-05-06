{/* Temp file needed modification before using it in the main file. */}


import React from 'react';
import { Link } from 'react-router-dom';

const Courses: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        <ul className="space-y-4">
          <li className="border-b pb-2">
            <Link to="/course/1" className="text-blue-500 hover:underline">
              Course 1
            </Link>
          </li>
          <li className="border-b pb-2">
            <Link to="/course/2" className="text-blue-500 hover:underline">
              Course 2
            </Link>
          </li>
          <li className="border-b pb-2">
            <Link to="/course/3" className="text-blue-500 hover:underline">
              Course 3
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Courses;