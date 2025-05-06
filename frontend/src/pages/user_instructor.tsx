import InstructorDashboard from "../components/InstructorDashboard";
import React from "react";

const UserInstructor: React.FC = () => {
  return (
    <div>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <InstructorDashboard />
        <h1>Hello Sir</h1>
      </main>
    </div>
  );
};

export default UserInstructor;
