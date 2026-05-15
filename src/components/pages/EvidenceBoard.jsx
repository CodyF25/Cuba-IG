import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Plus, X, CheckCircle, AlertCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EVIDENCE_FILES, BOARD_CONNECTIONS, INVESTIGATION_QUESTIONS } from '@/lib/gameData';
import useGameState from '@/lib/useGameState';
import GameNav from '@/components/game/GameNav';
import DocumentViewer from '@/components/game/DocumentViewer';

export default function EvidenceBoard() {
  const { progress, isUnlocked, isAnalyzed, analyzeDocument, makeConnection, hasConnection, stats } = useGameState();
  const [selectedForLink, setSelectedForLink] = useState(null);
  const [connectionResult, setConnectionResult] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const unlockedFiles = EVIDENCE_FILES.filter(f => isUnlocked(f.id));

  const handleFileClick = useCallback((file) => {
    if (!selectedForLink) {
      setSelectedForLink(file);
      setConnectionResult(null);
    } else if (selectedForLink.id === file.id) {
      setSelectedForLink(null);
    } else {
      const result = makeConnection(selectedForLink.id, file.id);
      setConnectionResult({
        ...result,
        from: selectedForLink,
        to: file,
      });
      setSelectedForLink(null);
      if (result.success) {
        setTimeout(() => setConnectionResult(null), 4000);
      }
    }
  }, [selectedForLink, makeConnection]);

  const madeConnectionsList = BOARD_CONNECTIONS.filter(c => hasConnection(c.from, c.to));

  return (
    <div className="min-h-screen bg-background">
      <GameNav stats={stats} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">Evidence Board</h1>
            <p className="font-mono text-sm text-muted-foreground mt-1">
              Connect documents to uncover hidden relationships — select two files to link them
            </p>
          </div>
          {selectedForLink && (
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/20 border border-accent rounded-sm">
              <Link2 className="w-4 h-4 text-accent" />
              <span className="font-typewriter text-xs">
                Linking from: <strong>{selectedForLink.title.substring(0, 30)}...</strong>
              </span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setSelectedForLink(null)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Connection result toast */}
        <AnimatePresence>
          {connectionResult && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 p-4 rounded-sm border ${
                connectionResult.success
                  ? 'bg-accent/10 border-accent'
                  : 'bg-destructive/10 border-destructive'
              }`}
            >
              <div className="flex items-start gap-3">
                {connectionResult.success ? (
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div>
                  {connectionResult.success ? (
                    <>
                      <p className="font-typewriter text-sm font-bold">{connectionResult.connection.label}</p>
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        {connectionResult.connection.explanation}
                      </p>
                    </>
                  ) : (
                    <p className="font-typewriter text-sm">{connectionResult.message}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="ml-auto h-5 w-5 shrink-0" onClick={() => setConnectionResult(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evidence files */}
          <div className="lg:col-span-2">
            <h2 className="font-typewriter text-sm font-bold mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              SELECT DOCUMENTS TO CONNECT
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {unlockedFiles.map(file => {
                const isSelected = selectedForLink?.id === file.id;
                const connectionCount = BOARD_CONNECTIONS.filter(
                  c => (c.from === file.id || c.to === file.id) && hasConnection(c.from, c.to)
                ).length;

                return (
                  <motion.button
                    key={file.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleFileClick(file)}
                    className={`text-left p-3 rounded-sm border transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/10 shadow-md'
                        : selectedForLink
                          ? 'border-border bg-card hover:border-accent/50 hover:bg-accent/5'
                          : 'border-border bg-card hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-typewriter text-xs font-bold leading-tight">{file.title}</h3>
                      {connectionCount > 0 && (
                        <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5 shrink-0">
                          {connectionCount} links
                        </Badge>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">{file.perspective} — {file.date}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Connections & Questions */}
          <div>
            {/* Made connections */}
            <div className="mb-6">
              <h2 className="font-typewriter text-sm font-bold mb-3 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                DISCOVERED CONNECTIONS ({madeConnectionsList.length}/{BOARD_CONNECTIONS.length})
              </h2>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {madeConnectionsList.length === 0 ? (
                  <p className="font-mono text-xs text-muted-foreground italic p-3 bg-secondary rounded-sm">
                    Select two documents to discover how they connect...
                  </p>
                ) : (
                  madeConnectionsList.map((conn, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-card border border-border rounded-sm"
                    >
                      <p className="font-typewriter text-xs font-bold text-accent">{conn.label}</p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">{conn.explanation}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Investigation questions */}
            <div>
              <h2 className="font-typewriter text-sm font-bold mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                INVESTIGATION QUESTIONS
              </h2>
              <div className="space-y-2">
                {INVESTIGATION_QUESTIONS.map(q => {
                  const requiredMade = q.requiredConnections.filter(id => {
                    return BOARD_CONNECTIONS.some(c =>
                      (c.from === id || c.to === id) && hasConnection(c.from, c.to)
                    );
                  }).length;
                  const total = q.requiredConnections.length;
                  const complete = requiredMade >= total;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestion(activeQuestion?.id === q.id ? null : q)}
                      className={`w-full text-left p-3 rounded-sm border transition-colors ${
                        complete ? 'bg-accent/10 border-accent' : 'bg-card border-border hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {complete ? (
                          <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-typewriter text-xs font-bold">{q.title}</p>
                          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                            Evidence: {requiredMade}/{total} connections
                          </p>
                          {activeQuestion?.id === q.id && (
                            <p className="font-mono text-xs text-muted-foreground mt-2 italic">
                              {q.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewingDoc && (
          <DocumentViewer
            file={viewingDoc}
            isAnalyzed={isAnalyzed(viewingDoc.id)}
            onAnalyze={analyzeDocument}
            onClose={() => setViewingDoc(null)}
            onViewRelated={file => setViewingDoc(file)}
            unlockedFiles={progress.unlockedFiles}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
