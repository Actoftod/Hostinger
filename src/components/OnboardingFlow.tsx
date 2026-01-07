import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingFlowProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="font-oswald font-black text-4xl text-white uppercase italic mb-6">Initialize Profile</h2>
            <button onClick={() => onComplete({ role: 'Pro Designer' })} className="px-8 py-4 bg-[#ccff00] text-black font-oswald font-black uppercase italic rounded-xl">
                Complete Setup
            </button>
        </div>
    );
};
export default OnboardingFlow;