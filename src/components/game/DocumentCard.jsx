import { motion } from 'framer-motion';
import { Lock, FileText, Eye } from 'lucide-react';
import ClassifiedStamp from './ClassifiedStamp';

export default function DocumentCard({ file, isUnlocked, isAnalyzed, onClick }) {
  if (!isUnlocked) {
    return (
      <div className="aged-paper rounded-sm border border-border p-4 opacity-50 cursor-not-allowed relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 backdrop-blur-[2px]">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-typewriter text-xs text-muted-foreground">CLASSIFIED — ACCESS DENIED</p>
        <p className="font-typewriter text-sm mt-2 blur-sm">Document requires further investigation to unlock</p>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="aged-paper rounded-sm border border-border p-4 cursor-pointer relative overflow-hidden group transition-all"
    >
      {/* Coffee stain decoration */}
      <div className="absolute -top-4 -right-4 w-20 h-20 coffee-stain rounded-full pointer-events-none" />
      
      <div className="flex items-start justify-between gap-2 mb-2">
        <ClassifiedStamp classification={file.classification} />
        {isAnalyzed && (
          <div className="flex items-center gap-1 text-accent text-xs font-typewriter">
            <Eye className="w-3 h-3" />
            REVIEWED
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 mt-3">
        <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <h3 className="font-typewriter text-sm font-bold leading-tight group-hover:text-primary transition-colors">
            {file.title}
          </h3>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            {file.date} — {file.source}
          </p>
        </div>
      </div>

      <p className="font-mono text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
        {file.content.substring(0, 120)}...
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs font-typewriter px-2 py-0.5 bg-secondary rounded-sm text-secondary-foreground">
          {file.perspective}
        </span>
      </div>
    </motion.div>
  );
}
