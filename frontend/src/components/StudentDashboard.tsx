import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showEnrollCourse, setShowEnrollCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    if (!user?.s_id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/courses/student/${user.s_id}`);
      if (!response.ok) throw new Error('Failed to fetch enrolled courses');

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user?.s_id]);

  const handleEnrollCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseId = formData.get('courseId')?.toString();

    if (!courseId || !user?.s_id) {
      setError('Missing course ID or user');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/courses/student/${user.s_id}/enroll/${courseId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Enrollment failed');
      }

      setShowEnrollCourse(false);
      fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enrollment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-2 text-gray-600">
            Manage your enrolled courses and access quizzes.
          </p>
        </div>

        {/* Course Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Your Courses</h3>
            <button
              onClick={() => setShowEnrollCourse(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Enroll New Course
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading courses...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {course.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {course.description}
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      Category: {course.category}
                    </div>
                    <button
                      className="w-full py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Attend Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enroll Modal */}
        {showEnrollCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Enroll in a Course</h3>
                <button
                  onClick={() => setShowEnrollCourse(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEnrollCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course ID
                  </label>
                  <input
                    type="text"
                    name="courseId"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEnrollCourse(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Enroll
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
