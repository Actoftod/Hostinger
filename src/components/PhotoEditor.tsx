import React from 'react';
import { Team } from '../types';
import { Shirt, Zap } from 'lucide-react';

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

const PhotoEditor: React.FC<PhotoEditorProps> = ({
  image,
  teams,
  selectedTeam,
  onTeamSelect,
  number,
  onNumberChange,
  onSwap,
  isProcessing
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 p-4 sm:p-6">
      {/* Image Preview - Responsive */}
      <div className="w-full lg:flex-1 aspect-[3/4] max-h-[60vh] lg:max-h-none bg-zinc-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 relative">
        <img src={image} className="w-full h-full object-cover" alt="Preview" />

        {/* Mobile overlay info */}
        {selectedTeam && (
          <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3 border border-white/20 backdrop-blur-xl lg:hidden">
            <div className="flex items-center gap-3">
              <img src={selectedTeam.logo} className="w-8 h-8 object-contain" alt={selectedTeam.name} />
              <div className="flex-1">
                <p className="font-oswald font-black text-sm uppercase">{selectedTeam.name}</p>
                <p className="font-oswald italic text-xs text-[#ccff00] uppercase font-bold">#{number}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Panel - Optimized for mobile */}
      <div className="w-full lg:w-96 xl:w-[420px] space-y-6 md:space-y-8">
        {/* Select Team */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-5 h-5 text-[#ccff00]" />
            <h3 className="font-oswald font-black text-xl sm:text-2xl uppercase italic">SELECT_KIT</h3>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 sm:gap-3 max-h-[200px] sm:max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => onTeamSelect(team)}
                className={`aspect-square rounded-lg sm:rounded-xl p-1.5 sm:p-2 border transition-all active:scale-95 ${
                  selectedTeam?.id === team.id
                    ? 'border-[#ccff00] bg-[#ccff00]/10 scale-95'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <img
                  src={team.logo}
                  className="w-full h-full object-contain"
                  alt={team.name}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Jersey Number */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#ccff00]" />
            <h3 className="font-oswald font-black text-xl sm:text-2xl uppercase italic">JERSEY_NUMBER</h3>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={number}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 2);
              onNumberChange(val);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 font-oswald text-2xl sm:text-3xl font-black text-white text-center outline-none focus:border-[#ccff00] transition-all"
            maxLength={2}
            placeholder="00"
          />
          <p className="mt-2 font-oswald italic text-xs text-zinc-600 uppercase font-bold text-center">
            ENTER 1-99
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={onSwap}
          disabled={!selectedTeam || isProcessing || !number}
          className="w-full py-4 sm:py-5 bg-[#ccff00] text-black font-oswald font-black text-xl sm:text-2xl uppercase italic rounded-xl sm:rounded-2xl hover:bg-[#b8e600] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ccff00] disabled:active:scale-100 shadow-lg"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              SYNTHESIZING...
            </span>
          ) : (
            'GENERATE_FIT'
          )}
        </button>

        {/* Info Card */}
        <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/5">
          <p className="font-oswald italic text-xs sm:text-sm text-zinc-500 uppercase font-bold leading-relaxed">
            AI-powered jersey swap technology. Select your team, customize your number, and watch the magic happen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
