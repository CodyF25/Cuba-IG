import { motion } from 'framer-motion';

export default function ClassifiedStamp({ classification, animate = false }) {
  const colors = {
    'TOP SECRET': 'border-red-800 text-red-800',
    'TOP SECRET // UMBRA': 'border-red-900 text-red-900',
    'TOP SECRET // EYES ONLY': 'border-red-900 text-red-900',
    'TOP SECRET // SENSITIVE': 'border-red-800 text-red-800',
    'TOP SECRET // NOFORN': 'border-red-900 text-red-900',
    'SECRET': 'border-red-700 text-red-700',
    'SECRET // NOFORN': 'border-red-700 text-red-700',
    'CONFIDENTIAL': 'border-amber-800 text-amber-800',
    'DECLASSIFIED': 'border-green-800 text-green-800',
    'UNCLASSIFIED': 'border-stone-600 text-stone-600',
  };

  const colorClass = colors[classification] || colors['UNCLASSIFIED'];

  return (
    <motion.div
      initial={animate ? { scale: 3, opacity: 0, rotate: -15 } : false}
      animate={animate ? { scale: 1, opacity: 0.85, rotate: -12 } : false}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`inline-block border-2 ${colorClass} px-3 py-1 font-typewriter text-xs uppercase tracking-widest transform -rotate-12 opacity-85`}
    >
      {classification}
    </motion.div>
  );
}
