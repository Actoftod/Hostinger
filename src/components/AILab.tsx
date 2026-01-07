import React from 'react';
import { Sparkles } from 'lucide-react';

const AILab = () => {
    return (
        <div className="glass p-8 rounded-3xl text-center border border-white/10 max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-[#ccff00] mx-auto mb-4" />
            <h2 className="font-oswald font-black text-3xl text-white uppercase italic mb-2">Neural Lab</h2>
            <p className="text-zinc-400">Experimental features and beta models are currently locked for maintenance.</p>
        </div>
    );
};
export default AILab;