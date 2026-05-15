import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Lightbulb, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassifiedStamp from './ClassifiedStamp';
import { EVIDENCE_FILES } from '@/lib/gameData';

export default function DocumentViewer({ file, isAnalyzed, onAnalyze, onClose, onViewRelated, unlockedFiles }) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = () => {
    setShowAnalysis(true);
    onAnalyze(file.id);
  };

  const relatedFiles = file.connections
    .map(id => EVIDENCE_FILES.find(f => f.id === id))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="aged-paper w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-sm border-2 border-border shadow-2xl relative"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <ClassifiedStamp classification={file.classification} animate />
              <h2 className="font-typewriter text-lg font-bold mt-3">{file.title}</h2>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                Date: {file.date} | Source: {file.source}
              </p>
              <span className="inline-block mt-2 text-xs font-typewriter px-2 py-0.5 bg-secondary rounded-sm">
                Perspective: {file.perspective}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Document content */}
        <div className="p-6 relative">
          <div className="font-mono text-sm leading-relaxed whitespace-pre-line text-foreground/90">
            {file.content}
 
