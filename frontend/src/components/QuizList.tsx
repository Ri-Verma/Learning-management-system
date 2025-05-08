import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  status?: 'pending' | 'completed' | 'missed';
}

interface QuizListProps {
  quizzes: Quiz[];
  courseId: string;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, courseId }) => {
  const navigate = useNavigate();

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          onClick={() => handleQuizClick(quiz.id)}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-gray-600 text-sm mb-2">{quiz.description}</p>
          )}
          {quiz.status && (
            <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(quiz.status)}`}>
              {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizList;