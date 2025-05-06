import StudentDashboard from "../components/StudentDashboard";
import Navbar from "../components/Navbar";
import React from "react";

const UserStudent: React.FC = () => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <StudentDashboard />
      </main>
    </div>
  );
};

export default UserStudent;
