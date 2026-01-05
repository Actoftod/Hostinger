import React from 'react';
import { Team, League } from '../types';
import { Sliders, Shirt } from 'lucide-react';

interface PhotoEditorProps {
  image: string;
  teams: Team[];
  selectedTeam: Team | null;
  onTeamSelect: (t: Team) => void;
  number: string;
  onNumberChange: (n: string) => void;
  removeBackground: boolean;
  onToggleBackground: () => void;
  onSwap: () => void;
  isProcessing: boolean;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ image, teams, selectedTeam, onTeamSelect, number, onNumberChange, onSwap, isProcessing }) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 p-6">
      <div className="flex-1 aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 relative">
        <img src={image} className="w-full h-full object-cover" alt="Preview" />
      </div>
      <div className="w-full md:w-96 space-y-8">
        <div>
            <h3 className="font-oswald font-black text-2xl uppercase italic mb-4">Select Kit</h3>
            <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {teams.map(team => (
                    <button key={team.id} onClick={() => onTeamSelect(team)} className={`aspect-square rounded-xl p-2 border transition-all ${selectedTeam?.id === team.id ? 'border-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                        <img src={team.logo} className="w-full h-full object-contain" alt={team.name} />
                    </button>
                ))}
            </div>
        </div>
        <div>
             <h3 className="font-oswald font-black text-2xl uppercase italic mb-4">Jersey Number</h3>
             <input type="text" value={number} onChange={(e) => onNumberChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-oswald text-2xl font-black text-white outline-none focus:border-[#ccff00] transition-all" maxLength={2} />
        </div>
        <button onClick={onSwap} disabled={!selectedTeam || isProcessing} className="w-full py-4 bg-[#ccff00] text-black font-oswald font-black text-xl uppercase italic rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? 'Synthesizing...' : 'Generate Fit'}
        </button>
      </div>
    </div>
  );
};

export default PhotoEditor;