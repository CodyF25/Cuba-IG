import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Eye, ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EVIDENCE_FILES } from '@/lib/gameData';
import useGameState from '@/lib/useGameState';
import GameNav from '@/components/game/GameNav';
import DocumentViewer from '@/components/game/DocumentViewer';

const PROPAGANDA_PAIRS = [
  {
    id: "pair_posters",
    title: "The Battle of Posters: Who is the Aggressor?",
    description: "Both the US and USSR used remarkably similar imagery — hands, shadows, flags — but told opposite stories.",
    us: "prop_us_poster_red_cuba",
    soviet: "prop_soviet_poster_hands",
    cuban: "prop_cuban_literacy",
    analysisQuestions: [
      "Both posters use 'hands' as a metaphor. Why do opposing sides use similar visual techniques?",
      "Who is the 'aggressor' in each poster? How does visual framing create different villains from the same events?",
      "The Cuban poster focuses on literacy, not conflict. Why might Cuba tell a different story about itself?",
    ],
  },
  {
    id: "pair_news",
    title: "The Same Crisis, Different Newspapers",
    description: "Compare how American and Soviet media described the exact same events during the crisis.",
    us: "doc_kennedy_address",
    soviet: "doc_pravda_blockade",
    cuban: "doc_castro_khrushchev_cable",
    analysisQuestions: [
      "Kennedy called it a 'quarantine.' Pravda called it 'piracy.' How does naming an action change how we judge it?",
      "Kennedy called Cuba 'that imprisoned island.' Pravda called Cuba a 'sovereign nation.' Whose framing is more accurate?",
      "Castro's cable reveals fear of invasion. How does his perspective differ from both the US and Soviet narratives?",
    ],
  },
  {
    id: "pair_speeches",
    title: "The UN Stage: Competing Truths",
    description: "When the crisis reached the United Nations, both sides accused the other of the same crimes.",
    us: "doc_monroe_doctrine",
    soviet: "doc_soviet_un_response",
    cuban: "doc_castro_speech_history",
    analysisQuestions: [
      "The Monroe Doctrine claims the Western Hemisphere for the US. The Soviet response calls this 'hypocrisy.' Who has the stronger argument?",
      "Both sides accuse the other of 'aggression.' When everyone is an aggressor in someone else's story, how do we find truth?",
      "Castro's early speeches promised democracy. How does revolutionary rhetoric compare to superpower propaganda?",
    ],
  },
];

function PropagandaComparison({ pair, files, isAnalyzed, onView }) {
  const [expanded, setExpanded] = useState(false);
  const usFile = files.find(f => f.id === pair.us);
  const sovietFile = files.find(f => f.id === pair.soviet);
  const cubanFile = files.find(f => f.id === pair.cuban);

  return (
    <div className="aged-paper border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div>
          <h3 className="font-typewriter text-sm font-bold">{pair.title}</h3>
          <p className="font-mono text-xs text-muted-foreground mt-1">{pair.description}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-border">
              {/* Side by side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { file: usFile, label: "US PERSPECTIVE", color: "border-blue-800" },
                  { file: sovietFile, label: "SOVIET PERSPECTIVE", color: "border-red-800" },
                  { file: cubanFile, label: "CUBAN PERSPECTIVE", color: "border-green-800" },
                ].map(({ file, label, color }) => file && (
                  <div key={file.id} className={`border-t-2 ${color} p-3 bg-card rounded-sm`}>
                    <p className="font-typewriter text-[10px] tracking-widest text-muted-foreground mb-2">{label}</p>
                    <h4 className="font-typewriter text-xs font-bold mb-2">{file.title}</h4>
                    <p className="font-mono text-[11px] text-muted-foreground leading-relaxed line-clamp-6">
                      {file.content.substring(0, 250)}...
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(file)}
                      className="mt-2 font-typewriter text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Read Full Document
                    </Button>
                  </div>
                ))}
              </div>

              {/* Analysis questions */}
              <div className="bg-secondary/50 rounded-sm p-4">
                <h4 className="font-typewriter text-xs font-bold mb-3 flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  COMPARATIVE ANALYSIS
                </h4>
                <div className="space-y-3">
                  {pair.analysisQuestions.map((q, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="font-typewriter text-xs text-primary font-bold shrink-0">{i + 1}.</span>
                      <p className="font-mono text-xs text-muted-foreground italic leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PropagandaLab() {
  const { progress, isAnalyzed, analyzeDocument, stats } = useGameState();
  const [viewingDoc, setViewingDoc] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <GameNav stats={stats} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Propaganda Analysis Lab</h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">
            Compare how the US, USSR, and Cuba told completely different stories about the same events
          </p>
        </div>

        {/* Intro card */}
        <div className="aged-paper border-2 border-dashed border-primary/30 rounded-sm p-6 mb-8">
          <div className="flex items-start gap-3">
            <Newspaper className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="font-typewriter text-sm font-bold">INVESTIGATOR'S BRIEFING</h2>
              <p className="font-mono text-xs text-muted-foreground mt-2 leading-relaxed">
                During the Cold War, every nation told its own version of events. The same crisis
                was described as "defensive necessity" by one side and "aggressive provocation" by another.
                Your task: identify the bias, fear tactics, exaggeration, and political messaging in each source.
                Remember — propaganda isn't just lies. The most effective propaganda contains truth,
                carefully selected and framed.
              </p>
            </div>
          </div>
        </div>

        {/* Propaganda pairs */}
        <div className="space-y-4">
          {PROPAGANDA_PAIRS.map(pair => (
            <PropagandaComparison
              key={pair.id}
              pair={pair}
              files={EVIDENCE_FILES}
              isAnalyzed={isAnalyzed}
              onView={setViewingDoc}
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
