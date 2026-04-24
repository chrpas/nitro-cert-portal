import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCcw, ArrowRight, Trophy, AlertCircle } from 'lucide-react';
import { examQuestions } from '../data/exam';
import { Link } from 'react-router-dom';

export const ExamPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = examQuestions[currentStep];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < examQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetExam = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = Math.round((score / examQuestions.length) * 100);
    return (
      <div className="container" style={{ maxWidth: '900px', paddingBottom: '8rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ padding: '4rem', textAlign: 'center', marginBottom: '4rem' }}
        >
          <Trophy size={64} color="var(--primary)" style={{ marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Exam Complete!</h1>
          <div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
            Your Score: <span className="gradient-text" style={{ fontWeight: 800, fontSize: '4rem' }}>{percentage}%</span>
          </div>
          <p style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
            {percentage >= 80 
              ? "Outstanding! You're ready for the official Nitro Certification." 
              : "Good effort. Review the answer key below to sharpen your knowledge."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={resetExam} className="glass-card" style={{ padding: '1rem 2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCcw size={18} /> Retake Exam
            </button>
            <Link to="/" className="btn-primary" style={{ padding: '1rem 2rem' }}>
              Back to Portal
            </Link>
          </div>
        </motion.div>

        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Answer Key & Explanations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {examQuestions.map((q, idx) => (
            <div key={q.id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.2rem', maxWidth: '80%' }}>{idx + 1}. {q.text}</h4>
                <div style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                  CORRECT
                </div>
              </div>
              <p style={{ color: 'var(--text)', marginBottom: '1.5rem', fontWeight: 600 }}>
                Answer: <span style={{ color: '#10b981' }}>{q.options[q.correctAnswer]}</span>
              </p>
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  <strong style={{ color: 'var(--text)' }}>Explanation:</strong> {q.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>QUESTION {currentStep + 1} OF {examQuestions.length}</span>
        <div style={{ width: '200px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${((currentStep + 1) / examQuestions.length) * 100}%`, height: '100%' }} className="gradient-bg" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>{currentQuestion.text}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQuestion.options.map((option, index) => {
              let borderColor = 'var(--border)';
              let bgColor = 'rgba(255, 255, 255, 0.03)';
              
              if (isAnswered) {
                if (index === currentQuestion.correctAnswer) {
                  borderColor = '#10b981';
                  bgColor = 'rgba(16, 185, 129, 0.1)';
                } else if (index === selectedAnswer) {
                  borderColor = '#ef4444';
                  bgColor = 'rgba(239, 68, 68, 0.1)';
                }
              } else if (selectedAnswer === index) {
                borderColor = 'var(--primary)';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    textAlign: 'left',
                    fontSize: '1.1rem',
                    width: '100%',
                    color: 'white',
                    border: `1px solid ${borderColor}`,
                    background: bgColor,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {option}
                  {isAnswered && index === currentQuestion.correctAnswer && <CheckCircle2 color="#10b981" size={20} />}
                  {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && <XCircle color="#ef4444" size={20} />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '3rem' }}
              >
                <div style={{ padding: '2rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.05)', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>
                    <AlertCircle size={18} /> EXPLANATION
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>{currentQuestion.explanation}</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={nextQuestion} className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
                    {currentStep === examQuestions.length - 1 ? 'See Results' : 'Next Question'} <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
