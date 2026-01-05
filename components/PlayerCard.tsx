import React from 'react';
import { motion } from 'framer-motion';
import { X, Share2, Star } from 'lucide-react';

interface PlayerCardProps {
  image: string;
  name: string;
  team: string;
  number: string;
  background: string;
  highlights: string[];
  stats: Record<string, number>;
  onClose: () => void;
  onViewProfile: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ image, name, team, number, stats, onClose }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-all">
          <X className="w-5 h-5" />
        </button>
        <div className="aspect-[3/4] relative">
            <img src={image} className="w-full h-full object-cover" alt={name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-4xl font-oswald font-black uppercase italic text-white leading-none">{name}</h2>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-[#ccff00] font-oswald font-bold text-xl">#{number}</span>
                    <span className="text-zinc-400 font-oswald text-lg uppercase">{team}</span>
                </div>
            </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4 border-t border-white/5">
            {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-center">
                    <div className="text-lg font-bold text-white font-oswald">{value}</div>
                    <div className="text-xs text-zinc-500 uppercase font-oswald tracking-widest">{key}</div>
                </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;