import React, { useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';
import QuizList from './QuizList';

interface Material {
  id: string;
  title: string;
  filePath: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  materials: Material[];
  quizzes: Quiz[];
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/courses/student/${user?.id}`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchStudentData();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-2 text-gray-600">
            View your courses and quizzes.
          </p>
        </div>

        {/* Courses Section */}
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">{course.name}</h3>
                <p className="text-gray-600 mt-1">{course.description}</p>
                <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>
              </div>

              {/* Course Materials */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Course Materials</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.materials.map((material) => (
                    <div key={material.id} className="p-4 border rounded-lg bg-gray-50">
                      <h5 className="font-medium">{material.title}</h5>
                      <a 
                        href={material.filePath}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Material
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Quizzes */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Available Quizzes</h4>
                <QuizList 
                  quizzes={course.quizzes} 
                  courseId={course.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;