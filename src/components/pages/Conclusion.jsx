import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, Link2, Search, Clock, Users, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EVIDENCE_FILES, BOARD_CONNECTIONS, TIMELINE_EVENTS, KEY_FIGURES, INVESTIGATION_QUESTIONS } from '@/lib/gameData';
import useGameState from '@/lib/useGameState';
import GameNav from '@/components/game/GameNav';

const CONCLUSION_THEMES = [
  {
    id: "causes",
    title: "ROOT CAUSES",
    question: "What conditions created the Cuban Cold War crisis?",
    relatedIds: ["doc_batista_economy", "doc_sugar_trade", "doc_land_reform", "doc_mafia_havana", "photo_batista_palace"],
  },
  {
    id: "interventions",
    title: "INTERVENTIONS & ESCALATION",
    question: "How did each side's actions make the crisis worse?",
    relatedIds: ["doc_bay_of_pigs", "doc_mongoose_ops", "doc_us_embargo", "doc_turkey_missiles", "doc_arms_race_data"],
  },
  {
    id: "consequences",
    title: "CONSEQUENCES",
    question: "What were the immediate and long-term effects?",
    relatedIds: ["doc_secret_negotiations", "doc_cuban_life_before_after", "doc_political_prisoners", "doc_defcon_records"],
  },
  {
    id: "legacies",
    title: "MODERN LEGACIES",
    question: "How does this history still shape the world today?",
    relatedIds: ["doc_us_embargo", "doc_cuban_life_before_after", "doc_khrushchev_memoirs", "civilian_exile_miami"],
  },
];

export default function Conclusion() {
  const { progress, stats, hasConnection, resetGame } = useGameState();

  const overallPercent = Math.round(
    ((stats.unlockedFiles / stats.totalFiles) * 25 +
    (stats.analyzedDocs / stats.totalFiles) * 35 +
    (stats.connections / stats.totalConnections) * 40)
  );

  const questionsAnswered = INVESTIGATION_QUESTIONS.filter(q => {
    return q.requiredConnections.every(id => {
      return BOARD_CONNECTIONS.some(c =>
        (c.from === id || c.to === id) && hasConnection(c.from, c.to)
      );
    });
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <GameNav stats={stats} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
          </motion.div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">Cold War Conclusion Board</h1>
          <p className="font-mono text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Your completed understanding of how Cold War competition impacted Cuba and the world
          </p>
        </div>

        {/* Overall progress */}
        <div className="aged-paper border border-border rounded-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-typewriter text-sm font-bold">INVESTIGATION PROGRESS</h2>
            <span className="font-typewriter text-2xl font-bold text-primary">{overallPercent}%</span>
          </div>
          <Progress value={overallPercent} className="h-3 mb-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: 'Files Unlocked', value: `${stats.unlockedFiles}/${stats.totalFiles}` },
              { icon: Search, label: 'Documents Analyzed', value: `${stats.analyzedDocs}/${stats.totalFiles}` },
              { icon: Link2, label: 'Connections Made', value: `${stats.connections}/${stats.totalConnections}` },
              { icon: Users, label: 'Questions Answered', value: `${questionsAnswered}/${INVESTIGATION_QUESTIONS.length}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-3 bg-secondary rounded-sm">
                <Icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="font-typewriter text-lg font-bold">{value}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion themes */}
        <div className="space-y-4 mb-8">
          {CONCLUSION_THEMES.map((theme, i) => {
            const docsAnalyzed = theme.relatedIds.filter(id => progress.analyzedDocs.includes(id)).length;
            const percent = Math.round((docsAnalyzed / theme.relatedIds.length) * 100);

            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="aged-paper border border-border rounded-sm p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-typewriter text-xs tracking-widest text-primary font-bold">{theme.title}</h3>
                    <p className="font-serif text-lg font-bold mt-1">{theme.question}</p>
                  </div>
                  <span className="font-typewriter text-sm font-bold text-muted-foreground">{percent}%</span>
                </div>
                <Progress value={percent} className="h-1.5 mb-3" />

                <div className="flex flex-wrap gap-2">
                  {theme.relatedIds.map(id => {
                    const file = EVIDENCE_FILES.find(f => f.id === id);
                    const analyzed = progress.analyzedDocs.includes(id);
                    if (!file) return null;
                    return (
                      <span
                        key={id}
                        className={`px-2 py-1 rounded-sm text-[10px] font-typewriter ${
                          analyzed
                            ? 'bg-accent/20 text-accent border border-accent/30'
                            : 'bg-muted text-muted-foreground border border-transparent'
                        }`}
                      >
                        {analyzed ? '✓ ' : '○ '}{file.title.substring(0, 30)}...
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Final reflection */}
        {overallPercent >= 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="aged-paper border-2 border-primary/30 rounded-sm p-8 text-center mb-8"
          >
            <h2 className="font-serif text-xl font-bold mb-4">Investigator's Final Note</h2>
            <div className="font-mono text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto space-y-3">
              <p>
                The Cold War was not a story of good versus evil. It was a story of fear, pride, ideology,
                and the terrifying consequences of nuclear weapons in the hands of imperfect leaders.
              </p>
              <p>
                Cuba — a small island nation — became a flashpoint because of forces far beyond its control:
                colonial economics, superpower rivalry, ideological warfare, and the geography of proximity.
              </p>
              <p>
                The people who suffered most — María, Elena, Roberto, Tomás — were rarely consulted and
                almost never remembered. Their stories remind us that history is not just about leaders
                and missiles. It's about the millions of invisible lives caught in between.
              </p>
              <p className="font-typewriter text-foreground font-bold pt-4">
                You didn't answer questions. You uncovered history.
              </p>
            </div>
          </motion.div>
        )}

        {/* Reset */}
        <div className="text-center pb-10">
          <Button
            variant="outline"
            onClick={resetGame}
            className="font-typewriter text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            RESET INVESTIGATION
          </Button>
          <p className="font-mono text-[10px] text-muted-foreground mt-2">
            Start a new investigation from scratch
          </p>
        </div>
      </div>
    </div>
  );
}
