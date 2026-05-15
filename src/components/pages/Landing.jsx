import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';

const TYPED_LINES = [
  "PRIORITY: HIGHEST",
  "SUBJECT: CUBAN OPERATIONS — FULL ARCHIVE",
  "CLASSIFICATION: TOP SECRET // UMBRA",
  "",
  "You have been granted access to classified materials",
  "concerning Cold War operations in Cuba, 1952-1965.",
  "",
  "Your mission: investigate the archive.",
  "Connect the evidence. Uncover the truth.",
  "",
  "What really happened — and why — is buried",
  "in these files. No one will hand you the answers.",
  "",
  "START YOUR INVESTIGATION ▸",
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (currentLine < TYPED_LINES.length) {
      const delay = TYPED_LINES[currentLine] === "" ? 300 : 60 + TYPED_LINES[currentLine].length * 15;
      const timer = setTimeout(() => setCurrentLine(prev => prev + 1), delay);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowButton(true), 500);
    }
  }, [currentLine]);

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      {/* Scanline effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header stamp */}
        <motion.div
          initial={{ scale: 3, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 0.8, rotate: -6 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="inline-block border-2 border-red-600 px-4 py-2">
            <span className="font-typewriter text-red-600 text-lg tracking-[0.3em]">TOP SECRET</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="font-serif text-4xl md:text-5xl font-bold text-amber-50 mb-2 leading-tight"
        >
          The Cold War Files
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="font-typewriter text-amber-200/70 text-xl tracking-widest mb-10"
        >
          CUBA
        </motion.p>

        {/* Terminal-style briefing */}
        <div className="bg-stone-900/80 border border-stone-700 rounded-sm p-6 font-mono text-sm text-amber-100/80 min-h-[320px]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-700">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-amber-500 text-xs tracking-widest">CLASSIFIED BRIEFING</span>
          </div>

          <div className="space-y-1">
            {TYPED_LINES.slice(0, currentLine).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${line === "" ? "h-3" : ""} ${
                  i === 0 ? "text-red-400" :
                  i === 2 ? "text-yellow-500" :
                  line.includes("▸") ? "text-amber-300 font-bold" : ""
                }`}
              >
                {line}
              </motion.p>
            ))}
            {currentLine < TYPED_LINES.length && (
              <span className="inline-block w-2 h-4 bg-amber-300" style={{ animation: 'blink 1s infinite' }} />
            )}
          </div>
        </div>

        {/* Enter button */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center"
            >
              <Button
                onClick={() => navigate('/archive')}
                size="lg"
                className="bg-primary hover:bg-primary/80 font-typewriter tracking-widest text-primary-foreground px-8 py-6 text-base"
              >
                <FileText className="w-5 h-5 mr-3" />
                OPEN THE ARCHIVE
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
