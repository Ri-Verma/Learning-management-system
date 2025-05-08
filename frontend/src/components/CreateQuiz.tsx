import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CreateQuizProps {
  courseId: string;
  onQuizCreated?: () => void;
}

const CreateQuiz: React.FC<CreateQuizProps> = ({ courseId, onQuizCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      const optionIndex = value.index;
      const optionValue = value.value;
      newQuestions[index].options[optionIndex] = optionValue;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          courseId,
          questions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      setTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
      if (onQuizCreated) {
        onQuizCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Quiz</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-8 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter question"
                required
              />
            </div>

            <div className="space-y-3">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={question.correctAnswer === oIndex}
                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                    required
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(qIndex, 'options', {
                      index: oIndex,
                      value: e.target.value
                    })}
                    className="flex-1 px-4 py-2 border rounded-md"
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Add Question
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 text-white rounded-md ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-600">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateQuiz;