import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, RefreshCw, Trophy, Square, CheckSquare } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Question } from '../db/db';

export const ModuleExamPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = useLiveQuery(() => db.modules.get(moduleId || ''));
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[] | null>(null);

  React.useEffect(() => {
    if (module && module.examQuestions && !shuffledQuestions) {
      setShuffledQuestions([...module.examQuestions].sort(() => Math.random() - 0.5).slice(0, 10));
    }
  }, [module, shuffledQuestions]);

  if (module === undefined) {
    return (
      <div className="container" style={{ paddingBottom: '8rem', paddingTop: '4rem', textAlign: 'center' }}>
        <p>Loading module data...</p>
      </div>
    );
  }

  if (!module) return null;

  if (!module.examQuestions || module.examQuestions.length === 0 || !shuffledQuestions) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
        <h2>No Exam Available for this Module</h2>
        <Link to={`/module/${moduleId}`} className="btn-primary" style={{ marginTop: '2rem' }}>
          Back to Module
        </Link>
      </div>
    );
  }

  const questions = shuffledQuestions;
  const q = questions[currentQuestionIndex];

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
      // Multiple answers: check if sets match
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
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartExam = () => {
    if (module?.examQuestions) {
      setShuffledQuestions([...module.examQuestions].sort(() => Math.random() - 0.5).slice(0, 10));
    }
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setScore(0);
    setSelectedAnswers([]);
    setIsAnswered(false);
  };

  const getReviewText = (question: Question) => {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.map(i => question.options[i]).join(', ');
    }
    return question.options[question.correctAnswer as number];
  };

  if (showResult) {
    const passed = score >= questions.length * 0.7;

    return (
      <div className="container" style={{ maxWidth: '800px', paddingBottom: '8rem' }}>
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-card"
           style={{ padding: '4rem', textAlign: 'center' }}
        >
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div className="gradient-bg" style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={40} color="white" />
            </div>
          </div>
          
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{module.title} Results</h2>
          <p style={{ fontSize: '1.5rem', color: passed ? 'var(--primary)' : 'var(--secondary)', fontWeight: 700, marginBottom: '2rem' }}>
            {passed ? 'MASTERY ACHIEVED!' : 'NEEDS REVIEW'}
          </p>
          
          <div style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem' }}>
            {score} / {questions.length}
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
            You mastered {Math.round((score / questions.length) * 100)}% of this module's objectives.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button onClick={restartExam} className="glass-card" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
              <RefreshCw size={20} /> Retake
            </button>
            <Link to={`/module/${module.id}`} className="btn-primary" style={{ padding: '1rem 2rem' }}>
              Back to Roadmap
            </Link>
          </div>
        </motion.div>

        <div style={{ marginTop: '4rem' }}>
           <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Objective Review</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {questions.map((q, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>{idx + 1}. {q.text}</p>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>Correct Answer(s): {getReviewText(q)}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{q.explanation}</p>
                  {q.referenceUrl && (
                    <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)' }}>
                      {q.referenceSnippet && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.5rem', paddingLeft: '0.5rem', borderLeft: '2px solid #10b981' }}>"{q.referenceSnippet}"</p>
                      )}
                      <Link to={q.referenceUrl} target="_blank" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Read in Study Guide →</Link>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', paddingBottom: '8rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to={`/module/${module.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Roadmap
          </Link>
          <h1 style={{ fontSize: '2.5rem' }}>{module.title} Module Exam</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {q.type === 'multiple' ? 'Select all that apply' : q.type === 'boolean' ? 'True or False' : 'Select one answer'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{currentQuestionIndex + 1}</span>
          <span style={{ color: 'var(--text-muted)' }}> / {questions.length}</span>
        </div>
      </header>

      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '4rem', overflow: 'hidden' }}>
        <motion.div 
          animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          style={{ height: '100%' }}
          className="gradient-bg"
        />
      </div>

      <motion.div 
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card"
        style={{ padding: '3rem' }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2.5rem', lineHeight: '1.4' }}>{q.text}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {q.options.map((option, idx) => {
            const isSelected = selectedAnswers.includes(idx);
            const isCorrectAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(idx) : q.correctAnswer === idx;
            
            let status = 'none';
            if (isAnswered) {
              if (isCorrectAnswer) status = 'correct';
              else if (isSelected) status = 'wrong';
            }

            let borderColor = 'var(--glass-border)';
            let bgColor = 'transparent';
            if (status === 'correct') {
               borderColor = 'var(--primary)';
               bgColor = 'rgba(99, 102, 241, 0.1)';
            } else if (status === 'wrong') {
               borderColor = 'var(--secondary)';
               bgColor = 'rgba(236, 72, 153, 0.1)';
            } else if (isSelected && !isAnswered) {
               borderColor = 'var(--primary)';
               bgColor = 'rgba(255, 255, 255, 0.05)';
            }

            return (
              <button
                key={idx}
                onClick={() => handleToggleAnswer(idx)}
                style={{ 
                  padding: '1.5rem', 
                  textAlign: 'left', 
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  cursor: isAnswered ? 'default' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {q.type === 'multiple' && (
                    isSelected ? <CheckSquare size={20} color="var(--primary)" /> : <Square size={20} color="var(--text-muted)" />
                  )}
                  <span style={{ fontSize: '1.1rem', fontWeight: isSelected ? 700 : 500 }}>{option}</span>
                </div>
                {status === 'correct' && <CheckCircle2 size={24} color="var(--primary)" />}
                {status === 'wrong' && <XCircle size={24} color="var(--secondary)" />}
              </button>
            );
          })}
        </div>

        {!isAnswered && q.type === 'multiple' && (
          <button 
            disabled={selectedAnswers.length === 0}
            onClick={() => validateAnswer(selectedAnswers)}
            className="btn-primary"
            style={{ marginTop: '2rem', width: '100%', justifyContent: 'center', opacity: selectedAnswers.length === 0 ? 0.5 : 1 }}
          >
            Submit Answer
          </button>
        )}

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid var(--primary)' }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: q.referenceUrl ? '1rem' : 0 }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>EXPLANATION:</span> {q.explanation}
              </p>
              
              {q.referenceUrl && (
                <div style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>Reference:</p>
                  {q.referenceSnippet && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontStyle: 'italic', marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid #10b981' }}>
                      "{q.referenceSnippet}"
                    </p>
                  )}
                  <Link to={q.referenceUrl} target="_blank" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'underline' }}>
                    Open Study Guide Reference →
                  </Link>
                </div>
              )}

              <button 
                onClick={nextQuestion} 
                className="btn-primary" 
                style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }}
              >
                {currentQuestionIndex + 1 === questions.length ? 'Show Results' : 'Next Question'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
