import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCcw, ArrowRight, Trophy, AlertCircle, Square, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, Question } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const ExamPage: React.FC = () => {
  const allModules = useLiveQuery(() => db.modules.toArray());
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[] | null>(null);

  React.useEffect(() => {
    if (allModules && !shuffledQuestions && allModules.length > 0) {
      const allQs = allModules.flatMap(m => m.examQuestions || []);
      const picked = [...allQs].sort(() => Math.random() - 0.5).slice(0, 100);
      setShuffledQuestions(picked);
    }
  }, [allModules, shuffledQuestions]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!shuffledQuestions || shuffledQuestions.length === 0) {
    return (
      <div className="container" style={{ paddingBottom: '8rem', paddingTop: '4rem', textAlign: 'center' }}>
        <p>Loading certification exam pool...</p>
      </div>
    );
  }

  const examQuestions = shuffledQuestions;
  const q = examQuestions[currentStep];

  const handleToggleAnswer = (index: number) => {
    if (isAnswered) return;

    if (q.type === 'multiple') {
      setSelectedAnswers(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setSelectedAnswers([index]);
      const isCorrect = index === q.correctAnswer;
      validateAnswer([index], isCorrect);
    }
  };

  const validateAnswer = (choices: number[], forceIsCorrect?: boolean) => {
    setIsAnswered(true);
    let correct = false;
    
    if (forceIsCorrect !== undefined) {
      correct = forceIsCorrect;
    } else if (Array.isArray(q.correctAnswer)) {
      const correctSet = new Set(q.correctAnswer);
      const chosenSet = new Set(choices);
      correct = correctSet.size === chosenSet.size && [...correctSet].every(val => chosenSet.has(val));
    } else {
      correct = choices[0] === q.correctAnswer;
    }

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < examQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswers([]);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetExam = () => {
    if (allModules) {
      const allQs = allModules.flatMap(m => m.examQuestions || []);
      const picked = [...allQs].sort(() => Math.random() - 0.5).slice(0, 100);
      setShuffledQuestions(picked);
    }
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const getReviewText = (question: Question) => {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.map(i => question.options[i]).join(', ');
    }
    return question.options[question.correctAnswer as number];
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
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Certification Results</h1>
          <div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
            Overall Score: <span className="gradient-text" style={{ fontWeight: 800, fontSize: '4rem' }}>{percentage}%</span>
          </div>
          <p style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
            {percentage >= 80 
              ? "Outstanding! You've officially mastered the Nitro5 fundamentals." 
              : "A solid effort. Review the technical explanations below to refine your expertise."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={resetExam} className="glass-card" style={{ padding: '1rem 2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCcw size={18} /> Retake Certification
            </button>
            <Link to="/" className="btn-primary" style={{ padding: '1rem 2rem' }}>
              Return to Portal
            </Link>
          </div>
        </motion.div>

        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Knowledge Deep-Dive</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {examQuestions.map((q, idx) => (
            <div key={q.id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.2rem', maxWidth: '80%' }}>{idx + 1}. {q.text}</h4>
                <div style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                  VALIDATED
                </div>
              </div>
              <p style={{ color: 'var(--text)', marginBottom: '1.5rem', fontWeight: 600 }}>
                Mastery Key: <span style={{ color: '#10b981' }}>{getReviewText(q)}</span>
              </p>
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  <strong style={{ color: 'var(--text)' }}>Technical Rationale:</strong> {q.explanation}
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
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>OBJECTIVE {currentStep + 1} OF {examQuestions.length}</span>
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
          <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>{q.text}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {q.options.map((option, index) => {
              const isSelected = selectedAnswers.includes(index);
              const isCorrectAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(index) : q.correctAnswer === index;
              
              let status = 'none';
              if (isAnswered) {
                if (isCorrectAnswer) status = 'correct';
                else if (isSelected) status = 'wrong';
              }

              let borderColor = 'var(--border)';
              let bgColor = 'rgba(255, 255, 255, 0.03)';
              
              if (status === 'correct') {
                borderColor = '#10b981';
                bgColor = 'rgba(16, 185, 129, 0.1)';
              } else if (status === 'wrong') {
                borderColor = '#ef4444';
                bgColor = 'rgba(239, 68, 68, 0.1)';
              } else if (isSelected && !isAnswered) {
                borderColor = 'var(--primary)';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleToggleAnswer(index)}
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
                    alignItems: 'center',
                    cursor: isAnswered ? 'default' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {q.type === 'multiple' && (
                      isSelected ? <CheckSquare size={20} color="var(--primary)" /> : <Square size={20} color="var(--text-muted)" />
                    )}
                    {option}
                  </div>
                  {status === 'correct' && <CheckCircle2 color="#10b981" size={20} />}
                  {status === 'wrong' && <XCircle color="#ef4444" size={20} />}
                </button>
              );
            })}
          </div>

          {!isAnswered && q.type === 'multiple' && (
            <button 
              disabled={selectedAnswers.length === 0}
              onClick={() => validateAnswer(selectedAnswers)}
              className="btn-primary"
              style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }}
            >
              Verify Objective
            </button>
          )}

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '3rem' }}
              >
                <div style={{ padding: '2rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.05)', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>
                    <AlertCircle size={18} /> TECHNICAL RATIONALE
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>{q.explanation}</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={nextQuestion} className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
                    {currentStep === examQuestions.length - 1 ? 'See Results' : 'Next Objective'} <ArrowRight size={20} />
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
