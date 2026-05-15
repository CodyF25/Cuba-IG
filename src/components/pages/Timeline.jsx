import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Shuffle, RotateCcw, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TIMELINE_EVENTS } from '@/lib/gameData';
import useGameState from '@/lib/useGameState';
import GameNav from '@/components/game/GameNav';

export default function Timeline() {
  const { progress, placeTimelineEvent, stats } = useGameState();
  const [shuffledEvents, setShuffledEvents] = useState(() =>
    [...TIMELINE_EVENTS].sort(() => Math.random() - 0.5)
  );
  const [placedEvents, setPlacedEvents] = useState([]);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const unplacedEvents = shuffledEvents.filter(e => !placedEvents.find(p => p.id === e.id));

  const handlePlace = (event) => {
    // Check if it should go at the end of current placements
    const correctOrder = TIMELINE_EVENTS.map(e => e.id);
    const currentIds = placedEvents.map(p => p.id);
    const nextCorrectIndex = currentIds.length;

    // Find this event's correct position
    const eventCorrectIndex = correctOrder.indexOf(event.id);

    // Simple check: is this the next chronological event?
    if (eventCorrectIndex === nextCorrectIndex) {
      setPlacedEvents(prev => [...prev, event]);
      placeTimelineEvent(event.id);
      setFeedback({ type: 'success', message: `Correct! ${event.title}`, eventId: event.id });
      setTimeout(() => setFeedback(null), 2000);
    } else {
      setFeedback({
        type: 'error',
        message: `Not quite — this event doesn't come next. Think about what happened before ${event.title}.`,
        eventId: event.id,
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const resetTimeline = () => {
    setPlacedEvents([]);
    setShuffledEvents([...TIMELINE_EVENTS].sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  const isComplete = placedEvents.length === TIMELINE_EVENTS.length;

  return (
    <div className="min-h-screen bg-background">
      <GameNav stats={stats} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">Timeline Reconstruction</h1>
            <p className="font-mono text-sm text-muted-foreground mt-1">
              Place events in chronological order — rebuild the timeline of the Cuban crisis
            </p>
          </div>
          <Button variant="outline" onClick={resetTimeline} className="font-typewriter text-xs">
            <RotateCcw className="w-3 h-3 mr-2" />
            RESET
          </Button>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-3 rounded-sm border font-typewriter text-sm ${
                feedback.type === 'success'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-destructive/10 border-destructive text-destructive'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Placed timeline */}
          <div>
            <h2 className="font-typewriter text-sm font-bold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              RECONSTRUCTED TIMELINE ({placedEvents.length}/{TIMELINE_EVENTS.length})
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-1">
                {placedEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative pl-10"
                  >
                    {/* Dot */}
                    <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-accent border-2 border-background" />

                    <div className="aged-paper p-3 rounded-sm border border-border">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-accent font-bold">{event.date}</span>
                        <CheckCircle className="w-3 h-3 text-accent" />
                      </div>
                      <h3 className="font-typewriter text-xs font-bold mt-1">{event.title}</h3>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {!isComplete && (
                  <div className="relative pl-10">
                    <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-muted border-2 border-background animate-pulse" />
                    <div className="p-3 border border-dashed border-muted rounded-sm">
                      <p className="font-typewriter text-xs text-muted-foreground">
                        What happened next? Select from the events on the right →
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-accent/10 border border-accent rounded-sm text-center"
              >
                <CheckCircle className="w-8 h-8 text-accent mx-auto mb-2" />
                <h3 className="font-typewriter text-sm font-bold text-accent">TIMELINE COMPLETE</h3>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  You've reconstructed the full chronology of the Cuban Cold War crisis.
                  But remember — new evidence may force you to revise your understanding.
                </p>
              </motion.div>
            )}
          </div>

          {/* Unplaced events */}
          <div>
            <h2 className="font-typewriter text-sm font-bold mb-4 flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              UNPLACED EVENTS ({unplacedEvents.length} remaining)
            </h2>

            <div className="space-y-2">
              {unplacedEvents.map(event => (
                <motion.button
                  key={event.id}
                  layout
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handlePlace(event)}
                  className={`w-full text-left p-3 rounded-sm border transition-colors ${
                    feedback?.eventId === event.id && feedback.type === 'error'
                      ? 'border-destructive bg-destructive/5'
                      : 'border-border bg-card hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <h3 className="font-typewriter text-xs font-bold">{event.title}</h3>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}

              {unplacedEvents.length === 0 && !isComplete && (
                <p className="font-mono text-xs text-muted-foreground text-center py-4">
                  All events have been placed!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
