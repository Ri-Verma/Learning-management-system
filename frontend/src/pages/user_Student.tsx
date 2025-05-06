import StudentDashboard from "../components/StudentDashboard";
import React from "react";

const UserStudent: React.FC = () => {
  return (
    <div>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <StudentDashboard />
      </main>
    </div>
  );
};

export default UserStudent;
