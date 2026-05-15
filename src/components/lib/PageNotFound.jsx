import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-block border-2 border-red-600 px-4 py-2 mb-6 transform -rotate-3">
          <span className="font-typewriter text-red-600 text-sm tracking-[0.3em]">ACCESS DENIED</span>
        </div>
        <h1 className="font-typewriter text-6xl text-amber-100/30 mb-4">404</h1>
        <h2 className="font-serif text-xl text-amber-100 mb-2">File Not Found</h2>
        <p className="font-mono text-sm text-amber-100/50 mb-8">
          The document at "{location.pathname}" has been redacted from this archive.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="font-typewriter text-sm text-amber-200 border border-amber-200/30 px-6 py-2 hover:bg-amber-200/10 transition-colors"
        >
          RETURN TO BRIEFING
        </button>
      </div>
    </div>
  );
}
