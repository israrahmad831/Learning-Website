import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, AlertCircle, CheckCircle, ChevronRight, ChevronLeft, Award } from 'lucide-react';

const Quiz = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
  
        const response = await fetch(`http://localhost:5001/api/quizzes/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const foundQuiz = await response.json();
        setQuiz(foundQuiz);
        setTimeRemaining(foundQuiz.timeLimit * 60);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchQuizDetails();
  }, [id]);

  useEffect(() => {
    let timer;
    if (quizStarted && !quizSubmitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz(); // Auto-submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => {
      if (timer) clearInterval(timer); // Proper cleanup
    };
  }, [quizStarted, quizSubmitted, timeRemaining]);
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };
  const handleSelectOption = (questionId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId // Persist selection per question
    }));
  };
  

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleSubmitQuiz(); // Auto-submit on the last question
    }
  };
  

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
  
    const endTime = Date.now();
    const timeSpent = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
  
    let correctAnswers = 0;
    let totalPoints = 0;
    let score = 0;
  
    const answers = quiz.questions.map(question => {
      const selectedOptionId = selectedOptions[question.id] || '';
      const isCorrect = question.options.find(opt => opt.id === selectedOptionId)?.isCorrect || false;
  
      if (isCorrect) {
        correctAnswers++;
        score += question.points;
      }
  
      totalPoints += question.points;
      
      return {
        questionId: question.id,
        selectedOptionId,
        isCorrect
      };
    });
  
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= quiz.passingScore;
  
    if (passed) {
      const certificateData = {
        studentId: user?._id, // Ensure correct user ID field
        studentName: user?.name || "Student",
        courseId: quiz.courseId,
        courseName: quiz.courseName,
        date: new Date().toISOString(),
        percentage: percentage,
      };
  
      console.log("Sending certificate data:", certificateData); // Debugging
  
      try {
        const response = await fetch("http://localhost:5001/api/certificates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Ensure token is included
          },
          body: JSON.stringify(certificateData),
        });
        
        const responseData = await response.json();
        console.log("Response from server:", responseData); // Debugging
  
        if (!response.ok) {
          throw new Error(responseData.message || "Failed to save certificate");
        }
      } catch (error) {
        console.error("Error saving certificate:", error);
      }
    }
  
    setQuizResult({
      score,
      totalPoints,
      percentage,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      passed,
      answers,
      timeSpent,
    });
  
    setQuizSubmitted(true);
};
  
  
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getCurrentQuestion = () => {
    return quiz?.questions[currentQuestionIndex] || null;
  };

  const isQuestionAnswered = (questionId) => {
    return !!selectedOptions[questionId];
  };

  const getAnsweredQuestionsCount = () => {
    return quiz ? Object.keys(selectedOptions).length : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!quiz) {
    
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h2>
        <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-600 mb-6">{quiz.description}</p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="font-semibold mb-2">Quiz Details</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-32 text-gray-600">Course:</span>
              <span>{quiz.courseName}</span>
            </li>
            {quiz.lessonTitle && (
              <li className="flex items-center">
                <span className="w-32 text-gray-600">Lesson:</span>
                <span>{quiz.lessonTitle}</span>
              </li>
            )}
            <li className="flex items-center">
              <span className="w-32 text-gray-600">Questions:</span>
              <span>{quiz.questions.length}</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 text-gray-600">Time Limit:</span>
              <span>{quiz.timeLimit} minutes</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 text-gray-600">Passing Score:</span>
              <span>{quiz.passingScore}%</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Once you start the quiz, the timer will begin. You cannot pause the quiz once started.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleStartQuiz}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
            quizResult?.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          } mb-4`}>
            {quizResult?.passed ? (
              <Award className="h-8 w-8" />
            ) : (
              <AlertCircle className="h-8 w-8" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {quizResult?.passed ? 'Congratulations!' : 'Quiz Completed'}
          </h1>
          <p className="text-gray-600">
            {quizResult?.passed 
              ? 'You have successfully passed the quiz.' 
              : 'You did not meet the passing score. Consider reviewing the material and trying again.'}
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-md mb-6">
          <h2 className="font-semibold mb-4 text-center">Your Results</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-md text-center">
              <p className="text-gray-500 text-sm mb-1">Score</p>
              <p className="text-2xl font-bold">{quizResult?.score}/{quizResult?.totalPoints}</p>
            </div>
            <div className="bg-white p-4 rounded-md text-center">
              <p className="text-gray-500 text-sm mb-1">Percentage</p>
              <p className="text-2xl font-bold">{quizResult?.percentage}%</p>
            </div>
            <div className="bg-white p-4 rounded-md text-center">
              <p className="text-gray-500 text-sm mb-1">Correct Answers</p>
              <p className="text-2xl font-bold">{quizResult?.correctAnswers}/{quizResult?.totalQuestions}</p>
            </div>
            <div className="bg-white p-4 rounded-md text-center">
              <p className="text-gray-500 text-sm mb-1">Time Spent</p>
              <p className="text-2xl font-bold">{Math.floor(quizResult?.timeSpent || 0 / 60)}:{(quizResult?.timeSpent || 0) % 60 < 10 ? '0' : ''}{(quizResult?.timeSpent || 0) % 60}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md text-center">
            <p className="text-gray-500 text-sm mb-1">Result</p>
            <p className={`text-xl font-bold ${quizResult?.passed ? 'text-green-600' : 'text-red-600'}`}>
              {quizResult?.passed ? 'PASSED' : 'FAILED'}
            </p>
          </div>
        </div>
        
        <div className="space-y-6 mb-6">
          <h2 className="font-semibold">Question Review</h2>
          {quiz.questions.map((question, index) => {
            const selectedOption = question.options.find(opt => opt.id === selectedOptions[question.id]);
            const isCorrect = selectedOption?.isCorrect || false;
            
            return (
              <div key={question.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <span className="font-medium">Question {index + 1}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="mb-3">{question.question}</p>
                  <div className="space-y-2 mb-4">
                    {question.options.map(option => (
                      <div 
                        key={option.id}
                        className={`p-3 rounded-md flex items-start ${
                          option.id === selectedOptions[question.id] && option.isCorrect
                            ? 'bg-green-100 border border-green-300'
                            : option.id === selectedOptions[question.id] && !option.isCorrect
                            ? 'bg-red-100 border border-red-300'
                            : option.isCorrect
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="mr-3 mt-0.5">
                          {option.id === selectedOptions[question.id] && option.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : option.id === selectedOptions[question.id] && !option.isCorrect ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : option.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-gray-300"></div>
                          )}
                        </div>
                        <div>
                          <p className={`${
                            option.isCorrect ? 'font-medium' : ''
                          }`}>
                            {option.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-md">
                    <h4 className="font-medium mb-1">Explanation</h4>
                    <p className="text-sm">{question.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex space-x-4">
          <Link
            to={`/courses/${quiz.courseId}`}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors text-center"
          >
            Back to Course
          </Link>
          {quiz.lessonId && (
            <Link
              to={`/dashboard/lesson/${quiz.lessonId}`}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors text-center"
            >
              Back to Lesson
            </Link>
          )}
  
        </div>
        {quizResult?.passed && (
  <div className="text-center mt-6">
    <h2 className="text-xl font-semibold text-green-600">🎉 Congratulations! 🎉</h2>
    <p className="text-gray-600">You have successfully completed the course.</p>

    {/* View Certificate Button */}
    <button 
      onClick={() => setShowCertificate(true)} 
      className="bg-indigo-600 text-white px-6 py-3 mt-4 rounded-md hover:bg-indigo-700 transition"
    >
      View Certificate 📜
    </button>

    {/* Certificate Div (Only visible when button is clicked) */}
    {showCertificate && (
      <div 
        id="certificate" 
        className="bg-white shadow-xl border border-gray-300 p-6 rounded-lg max-w-2xl mx-auto mt-6 text-center"
      >
        <h1 className="text-3xl font-bold text-indigo-700">Certificate of Completion</h1>
        <p className="text-lg text-gray-700 mt-2">
          This is to certify that
          <span className="block text-2xl font-semibold mt-1">{user?.name || "Student"}</span>
          has successfully completed the course
        </p>
        <h2 className="text-xl font-bold text-indigo-600 mt-2">{quiz.courseName}</h2>
        <p className="text-gray-500 mt-1">with a passing score of {quizResult.percentage}%.</p>

        <div className="mt-6 flex justify-between px-8">
          <div>
            <p className="border-t border-gray-500 w-40 mx-auto text-gray-700">Instructor</p>
          </div>
          <div>
            <p className="border-t border-gray-500 w-40 mx-auto text-gray-700">Completion Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    )}
  </div>
)}



      </div>
    );
  }
  
  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">{quiz.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-1" />
            <span className={`font-medium ${timeRemaining < 60 ? 'text-red-600' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
            {getAnsweredQuestionsCount()}/{quiz.questions.length} Answered
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${(currentQuestionIndex + 1) / quiz.questions.length * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentQuestion.difficulty === 'easy' 
                ? 'bg-green-100 text-green-800' 
                : currentQuestion.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </span>
          </div>
        </div>
        <p className="text-lg mb-4 whitespace-pre-line">{currentQuestion.question}</p>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelectOption(currentQuestion.id, option.id)}
              className={`w-full p-4 rounded-md text-left flex items-start ${
                selectedOptions[currentQuestion.id] === option.id
                  ? 'bg-indigo-100 border border-indigo-300'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3 mt-0.5">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                  selectedOptions[currentQuestion.id] === option.id
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-300'
                }`}>
                  {selectedOptions[currentQuestion.id] === option.id && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <span>{option.text}</span>
            </button>
          ))}
        </div>
        
        {showExplanation && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md mb-6">
            <h3 className="font-medium mb-1">Explanation</h3>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded-md ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Previous</span>
            </button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    
      {/* Question Navigation */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium mb-3">Question Navigation</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-10 w-full rounded-md flex items-center justify-center font-medium ${
                index === currentQuestionIndex
                  ? 'bg-indigo-600 text-white'
                  : isQuestionAnswered(quiz.questions[index].id)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;