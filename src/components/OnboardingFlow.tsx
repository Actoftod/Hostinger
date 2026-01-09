import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Zap, Award } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    role: 'Pro Designer',
    leaguePreference: 'Elite',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'
  });

  const roles = [
    { value: 'Athlete', icon: User, desc: 'Professional athlete creating personal brand' },
    { value: 'Pro Designer', icon: Zap, desc: 'Creative professional making premium swaps' },
    { value: 'Scout', icon: Award, desc: 'Talent scout discovering rising stars' }
  ];

  const leagues = [
    { value: 'Elite', desc: 'Multi-sport professional' },
    { value: 'NFL', desc: 'American Football focus' },
    { value: 'NBA', desc: 'Basketball specialist' },
    { value: 'EA FC', desc: 'Soccer/Football expert' }
  ];

  const avatars = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200'
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete({
      role: data.role as 'Athlete' | 'Pro Designer' | 'Scout',
      leaguePreference: data.leaguePreference,
      bio: data.bio || 'Neural link established.',
      avatar: data.avatar,
      stats: {
        precision: Math.floor(Math.random() * 20) + 80,
        sync: Math.floor(Math.random() * 20) + 80,
        speed: Math.floor(Math.random() * 20) + 75
      },
      ovr: Math.floor(Math.random() * 15) + 80
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-oswald italic font-black transition-all ${step >= i ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-zinc-700'}`}>
                  {i}
                </div>
                {i < 4 && <div className={`flex-1 h-1 mx-2 transition-all ${step > i ? 'bg-[#ccff00]' : 'bg-white/5'}`} />}
              </div>
            ))}
          </div>
          <p className="font-oswald italic text-xs text-zinc-500 uppercase font-black tracking-widest text-center">
            STEP {step} OF 4
          </p>
        </div>

        {/* Content */}
        <div className="glass rounded-3xl border border-white/10 p-6 sm:p-8 md:p-12 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="font-oswald italic font-black text-3xl sm:text-4xl md:text-5xl uppercase mb-3">SELECT_ROLE</h2>
                <p className="font-oswald italic text-sm text-zinc-500 mb-8 uppercase font-bold">Choose your identity on the platform</p>

                <div className="flex-1 space-y-4">
                  {roles.map(role => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        onClick={() => setData({ ...data, role: role.value })}
                        className={`w-full p-6 rounded-2xl border transition-all flex items-start gap-4 ${
                          data.role === role.value
                            ? 'bg-[#ccff00]/10 border-[#ccff00]'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.role === role.value ? 'bg-[#ccff00] text-black' : 'bg-white/10 text-zinc-500'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-oswald italic font-black text-xl uppercase mb-1">{role.value}</p>
                          <p className="font-oswald italic text-xs text-zinc-500 uppercase font-bold">{role.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="font-oswald italic font-black text-3xl sm:text-4xl md:text-5xl uppercase mb-3">LEAGUE_PREFERENCE</h2>
                <p className="font-oswald italic text-sm text-zinc-500 mb-8 uppercase font-bold">Select your primary sport focus</p>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leagues.map(league => (
                    <button
                      key={league.value}
                      onClick={() => setData({ ...data, leaguePreference: league.value })}
                      className={`p-6 rounded-2xl border transition-all ${
                        data.leaguePreference === league.value
                          ? 'bg-[#ccff00]/10 border-[#ccff00]'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <p className="font-oswald italic font-black text-2xl uppercase mb-2">{league.value}</p>
                      <p className="font-oswald italic text-xs text-zinc-500 uppercase font-bold">{league.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="font-oswald italic font-black text-3xl sm:text-4xl md:text-5xl uppercase mb-3">CHOOSE_AVATAR</h2>
                <p className="font-oswald italic text-sm text-zinc-500 mb-8 uppercase font-bold">Select your profile picture</p>

                <div className="flex-1 grid grid-cols-3 gap-4">
                  {avatars.map((avatar, idx) => (
                    <button
                      key={idx}
                      onClick={() => setData({ ...data, avatar })}
                      className={`aspect-square rounded-2xl border-2 overflow-hidden transition-all ${
                        data.avatar === avatar
                          ? 'border-[#ccff00] scale-95'
                          : 'border-white/10 hover:border-white/30 grayscale hover:grayscale-0'
                      }`}
                    >
                      <img src={avatar} className="w-full h-full object-cover" alt={`Avatar ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="font-oswald italic font-black text-3xl sm:text-4xl md:text-5xl uppercase mb-3">PERSONAL_BIO</h2>
                <p className="font-oswald italic text-sm text-zinc-500 mb-8 uppercase font-bold">Tell us about yourself (optional)</p>

                <div className="flex-1 flex flex-col">
                  <textarea
                    value={data.bio}
                    onChange={e => setData({ ...data, bio: e.target.value })}
                    placeholder="DESCRIBE YOUR VISION, GOALS, OR EXPERTISE..."
                    maxLength={200}
                    className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all resize-none font-bold"
                  />
                  <p className="mt-4 font-oswald italic text-xs text-zinc-600 uppercase font-bold text-right">
                    {data.bio.length}/200 CHARACTERS
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white font-oswald italic font-black text-lg rounded-xl hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                BACK
              </button>
            )}
            <button
              onClick={step === 4 ? handleComplete : handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#ccff00] text-black font-oswald italic font-black text-lg sm:text-xl rounded-xl hover:bg-[#b8e600] active:scale-[0.98] transition-all"
            >
              {step === 4 ? 'COMPLETE_SETUP' : 'CONTINUE'}
              {step < 4 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
