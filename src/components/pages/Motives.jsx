import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, AlertTriangle, Gauge, GitBranch, ChevronRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { KEY_FIGURES, EVIDENCE_FILES } from '@/lib/gameData';
import useGameState from '@/lib/useGameState';
import GameNav from '@/components/game/GameNav';
import DocumentViewer from '@/components/game/DocumentViewer';

function FigureCard({ figure, analyzedDocs, onViewDoc, unlockedFiles }) {
  const [expanded, setExpanded] = useState(false);
  const relatedAnalyzed = figure.relatedDocs.filter(id => analyzedDocs.includes(id)).length;
  const revealLevel = Math.min(Math.floor((relatedAnalyzed / figure.relatedDocs.length) * 4), 4);

  const sections = [
    { key: 'goals', label: 'GOALS', icon: Target, color: 'text-blue-800', items: figure.goals, minLevel: 0 },
    { key: 'fears', label: 'FEARS', icon: AlertTriangle, color: 'text-amber-700', items: figure.fears, minLevel: 1 },
    { key: 'pressures', label: 'PRESSURES', icon: Gauge, color: 'text-red-800', items: figure.pressures, minLevel: 2 },
    { key: 'contradictions', label: 'CONTRADICTIONS', icon: GitBranch, color: 'text-purple-800', items: figure.contradictions, minLevel: 3 },
  ];

  return (
    <div className="aged-paper border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center font-serif text-xl font-bold">
            {figure.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold">{figure.name}</h3>
            <p className="font-mono text-xs text-muted-foreground">{figure.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-typewriter text-[10px]">
            {relatedAnalyzed}/{figure.relatedDocs.length} docs analyzed
          </Badge>
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-border">
              {/* Motive reveal meter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-typewriter text-xs text-muted-foreground">INTELLIGENCE DEPTH</span>
                  <span className="font-typewriter text-xs font-bold">{revealLevel}/4</span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-sm ${i < revealLevel ? 'bg-accent' : 'bg-secondary'}`}
                    />
                  ))}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-1 italic">
                  Analyze related documents to reveal deeper motivations
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {sections.map(section => {
                  const Icon = section.icon;
                  const revealed = revealLevel >= section.minLevel;

                  return (
                    <div key={section.key}>
                      <h4 className={`font-typewriter text-xs font-bold flex items-center gap-2 mb-2 ${section.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {section.label}
                      </h4>
                      {revealed ? (
                        <ul className="space-y-1.5">
                          {section.items.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="font-mono text-xs text-foreground/80 flex items-start gap-2"
                            >
                              <span className="text-muted-foreground mt-0.5">•</span>
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 bg-secondary rounded-sm">
                          <p className="font-typewriter text-xs text-muted-foreground italic">
                            [REDACTED] — Analyze more documents about {figure.name} to reveal this section
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Related docs */}
              <div className="mt-6 pt-4 border-t border-dashed border-border">
                <h4 className="font-typewriter text-xs font-bold mb-2">RELATED EVIDENCE</h4>
                <div className="flex flex-wrap gap-2">
                  {figure.relatedDocs.map(docId => {
                    const file = EVIDENCE_FILES.find(f => f.id === docId);
                    const unlocked = unlockedFiles.includes(docId);
                    const analyzed = analyzedDocs.includes(docId);
                    if (!file) return null;
                    return (
                      <button
                        key={docId}
                        onClick={() => unlocked && onViewDoc(file)}
                        disabled={!unlocked}
                        className={`px-2 py-1 rounded-sm text-[10px] font-typewriter transition-colors ${
                          analyzed
                            ? 'bg-accent/20 text-accent border border-accent/30'
                            : unlocked
                              ? 'bg-secondary text-secondary-foreground hover:bg-muted border border-border'
                              : 'bg-muted/50 text-muted-foreground cursor-not-allowed border border-transparent'
                        }`}
                      >
                        {unlocked ? (analyzed ? '✓ ' : '') + file.title.substring(0, 25) + '...' : '[LOCKED]'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Motives() {
  const { progress, isAnalyzed, analyzeDocument, stats } = useGameState();
  const [viewingDoc, setViewingDoc] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <GameNav stats={stats} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Motive Tracker</h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">
            Every leader had goals, fears, pressures, and contradictions — uncover them by analyzing documents
          </p>
        </div>

        {/* Briefing */}
        <div className="aged-paper border-2 border-dashed border-primary/30 rounded-sm p-6 mb-8">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="font-typewriter text-sm font-bold">PSYCHOLOGICAL PROFILES</h2>
              <p className="font-mono text-xs text-muted-foreground mt-2 leading-relaxed">
                Understanding why leaders acted as they did requires examining not just their public statements,
                but their private fears, political pressures, and internal contradictions. As you analyze
                documents related to each figure, their deeper motivations will be revealed. The most important
                insight: no one was simply "good" or "evil."
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {KEY_FIGURES.map(figure => (
            <FigureCard
              key={figure.id}
              figure={figure}
              analyzedDocs={progress.analyzedDocs}
              onViewDoc={setViewingDoc}
              unlockedFiles={progress.unlockedFiles}
            />
          ))}
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
