import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Filter, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EVIDENCE_FILES, EVIDENCE_CATEGORIES } from '@/lib/gameData';
import useGameState from '@/lib/useGameState';
import GameNav from '@/components/game/GameNav';
import DocumentCard from '@/components/game/DocumentCard';
import DocumentViewer from '@/components/game/DocumentViewer';

export default function Archive() {
  const { progress, isUnlocked, isAnalyzed, analyzeDocument, stats } = useGameState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredFiles = EVIDENCE_FILES.filter(file => {
    const matchesCategory = activeCategory === 'all' || file.category === activeCategory;
    const matchesSearch = !search ||
      file.title.toLowerCase().includes(search.toLowerCase()) ||
      file.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unlockedFiltered = filteredFiles.filter(f => isUnlocked(f.id));
  const lockedFiltered = filteredFiles.filter(f => !isUnlocked(f.id));

  return (
    <div className="min-h-screen bg-background">
      <GameNav stats={stats} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Classified Archive</h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">
            {stats.unlockedFiles} of {stats.totalFiles} files accessible — analyze documents to unlock more
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="pl-10 font-mono text-sm bg-card border-border"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-sm font-typewriter text-xs transition-colors ${
              activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            <FolderOpen className="w-3 h-3 inline mr-1" />
            ALL FILES
          </button>
          {Object.entries(EVIDENCE_CATEGORIES).map(([key, cat]) => {
            const count = EVIDENCE_FILES.filter(f => f.category === key && isUnlocked(f.id)).length;
            const total = EVIDENCE_FILES.filter(f => f.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1.5 rounded-sm font-typewriter text-xs transition-colors flex items-center gap-1.5 ${
                  activeCategory === key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {cat.label}
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-mono">
                  {count}/{total}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Files grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {unlockedFiltered.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DocumentCard
                  file={file}
                  isUnlocked={true}
                  isAnalyzed={isAnalyzed(file.id)}
                  onClick={() => setSelectedFile(file)}
                />
              </motion.div>
            ))}
            {lockedFiltered.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (unlockedFiltered.length + i) * 0.05 }}
              >
                <DocumentCard
                  file={file}
                  isUnlocked={false}
                  isAnalyzed={false}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-16">
            <p className="font-typewriter text-muted-foreground">No documents match your search.</p>
          </div>
        )}
      </div>

      {/* Document viewer overlay */}
      <AnimatePresence>
        {selectedFile && (
          <DocumentViewer
            file={selectedFile}
            isAnalyzed={isAnalyzed(selectedFile.id)}
            onAnalyze={analyzeDocument}
            onClose={() => setSelectedFile(null)}
            onViewRelated={file => setSelectedFile(file)}
            unlockedFiles={progress.unlockedFiles}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
