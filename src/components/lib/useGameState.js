import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_PROGRESS, EVIDENCE_FILES, BOARD_CONNECTIONS } from './gameData';

const STORAGE_KEY = 'cold_war_files_progress';

export default function useGameState() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const isUnlocked = useCallback((fileId) => {
    return progress.unlockedFiles.includes(fileId);
  }, [progress.unlockedFiles]);

  const isAnalyzed = useCallback((fileId) => {
    return progress.analyzedDocs.includes(fileId);
  }, [progress.analyzedDocs]);

  const analyzeDocument = useCallback((fileId) => {
    setProgress(prev => {
      if (prev.analyzedDocs.includes(fileId)) return prev;
      const file = EVIDENCE_FILES.find(f => f.id === fileId);
      const newUnlocks = file?.unlocks?.filter(u => !prev.unlockedFiles.includes(u)) || [];
      return {
        ...prev,
        analyzedDocs: [...prev.analyzedDocs, fileId],
        unlockedFiles: [...prev.unlockedFiles, ...newUnlocks],
      };
    });
  }, []);

  const makeConnection = useCallback((fromId, toId) => {
    const connKey = [fromId, toId].sort().join('::');
    const valid = BOARD_CONNECTIONS.find(c =>
      (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)
    );
    if (!valid) return { success: false, message: "These documents don't have a direct historical connection." };

    setProgress(prev => {
      if (prev.madeConnections.includes(connKey)) return prev;
      return { ...prev, madeConnections: [...prev.madeConnections, connKey] };
    });
    return { success: true, connection: valid };
  }, []);

  const hasConnection = useCallback((fromId, toId) => {
    const connKey = [fromId, toId].sort().join('::');
    return progress.madeConnections.includes(connKey);
  }, [progress.madeConnections]);

  const placeTimelineEvent = useCallback((eventId) => {
    setProgress(prev => {
      if (prev.timelinePlaced.includes(eventId)) return prev;
      return { ...prev, timelinePlaced: [...prev.timelinePlaced, eventId] };
    });
  }, []);

  const resetGame = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const stats = {
    totalFiles: EVIDENCE_FILES.length,
    unlockedFiles: progress.unlockedFiles.length,
    analyzedDocs: progress.analyzedDocs.length,
    connections: progress.madeConnections.length,
    totalConnections: BOARD_CONNECTIONS.length,
  };

  return {
    progress,
    setProgress,
    isUnlocked,
    isAnalyzed,
    analyzeDocument,
    makeConnection,
    hasConnection,
    placeTimelineEvent,
    resetGame,
    stats,
  };
}
