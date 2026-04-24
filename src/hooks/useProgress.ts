import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nitro_cert_progress';

export interface ProgressState {
  completedItems: string[]; // List of "moduleID:itemIndex"
  completedModules: string[]; // List of module IDs
}

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { completedItems: [], completedModules: [] };
    } catch {
      return { completedItems: [], completedModules: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const toggleItem = (moduleId: string, itemIndex: number) => {
    const itemId = `${moduleId}:${itemIndex}`;
    setProgress(prev => {
      const isCompleted = prev.completedItems.includes(itemId);
      const newItems = isCompleted
        ? prev.completedItems.filter(id => id !== itemId)
        : [...prev.completedItems, itemId];
      
      return { ...prev, completedItems: newItems };
    });
  };

  const isItemCompleted = (moduleId: string, itemIndex: number) => {
    return progress.completedItems.includes(`${moduleId}:${itemIndex}`);
  };

  const getModuleProgress = (moduleId: string, totalItems: number) => {
    const completedCount = progress.completedItems.filter(id => id.startsWith(`${moduleId}:`)).length;
    return Math.round((completedCount / totalItems) * 100);
  };

  const getTotalProgress = (totalQuestions: number) => {
    if (totalQuestions === 0) return 0;
    return Math.round((progress.completedItems.length / totalQuestions) * 100);
  };

  return { 
    progress, 
    toggleItem, 
    isItemCompleted, 
    getModuleProgress,
    getTotalProgress 
  };
};
