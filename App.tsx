import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppStep, SwapState, UserProfile, SavedSwap, Achievement } from './types';
import { TEAMS, LEAGUES } from './constants';
import { GeminiService } from './services/geminiService';
import PlayerCard from './components/PlayerCard';
import PhotoEditor from './components/PhotoEditor';
import OnboardingFlow from './components/OnboardingFlow';
import ProfileView from './components/ProfileView';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ChevronRight, Download, Scan, LogIn, UserPlus, 
  CheckCircle2, RefreshCw, Mail, KeyRound 
} from 'lucide-react';

const STORAGE_ACCOUNTS_KEY = 'js_pro_accounts_v2';
const SESSION_KEY = 'js_pro_session_v2';

const KineticWord = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.span 
    className={`inline-block origin-left ${className}`}
    whileHover={{ skewX: -12, scale: 1.05, x: 10, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
  >
    {children}
  </motion.span>
);

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_link',
    title: 'Neural Link Established',
    description: 'Successfully initialized a profile on JerseySwap.io',
    icon: 'Zap',
    unlockedAt: new Date().toLocaleDateString(),
    rarity: 'Common'
  }
];

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [step, setStep] = useState<AppStep>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'select'>('select');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const [regData, setRegData] = useState({ name: '', email: '', handle: '', password: '' });
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  const [state, setState] = useState<SwapState>({
    image: null,
    league: null,
    team: null,
    number: '23',
    removeBackground: false
  });

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<any>(null);
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparingPlate, setIsPreparingPlate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const geminiService = useRef(new GeminiService());

  useEffect(() => {
    const savedProfiles = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (savedProfiles) {
      try {
        const parsed = JSON.parse(savedProfiles);
        setProfiles(parsed);
        const sessionId = localStorage.getItem(SESSION_KEY);
        if (sessionId) {
          const found = parsed.find((p: UserProfile) => p.id === sessionId);
          if (found) {
            setActiveProfile(found);
            setStep('landing');
          }
        }
      } catch (e) {
        console.error("Identity database corrupted.");
      }
    }
  }, []);

  const syncToStorage = useCallback((updatedProfiles: UserProfile[], currentActive?: UserProfile | null) => {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updatedProfiles));
    if (currentActive) {
      localStorage.setItem(SESSION_KEY, currentActive.id);
    }
  }, []);

  const handleUpdateProfile = (updated: UserProfile) => {
    const updatedProfiles = profiles.map(p => p.id === updated.id ? updated : p);
    setProfiles(updatedProfiles);
    setActiveProfile(updated);
    syncToStorage(updatedProfiles, updated);
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 2000);
    }, 800);
  };

  const handleOnboardingComplete = (onboardingData: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: regData.name,
      email: regData.email,
      password: regData.password,
      handle: regData.handle.startsWith('@') ? regData.handle : `@${regData.handle}`,
      role: onboardingData.role || 'Pro Designer',
      leaguePreference: onboardingData.leaguePreference || 'Elite',
      bio: onboardingData.bio || 'Neural link established.',
      avatar: onboardingData.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      stats: onboardingData.stats || { precision: 85, sync: 90, speed: 75 },
      ovr: onboardingData.ovr || 85,
      vault: [],
      achievements: INITIAL_ACHIEVEMENTS
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setActiveProfile(newProfile);
    syncToStorage(updatedProfiles, newProfile);
    setStep('landing');
  };

  const handleSignIn = () => {
    const input = authIdentifier.trim().toLowerCase();
    const found = profiles.find(p => 
      (p.handle.toLowerCase() === input || p.handle.toLowerCase() === `@${input}` || p.email.toLowerCase() === input) && 
      p.password === authPassword
    );

    if (found) {
      setActiveProfile(found);
      localStorage.setItem(SESSION_KEY, found.id);
      setStep('landing');
    } else {
      alert("Neural credentials rejected.");
    }
  };

  const reset = useCallback(() => {
    setStep('landing');
    setState({ image: null, league: null, team: null, number: '23', removeBackground: false });
    setResultImage(null);
    setPlayerData(null);
    setShowPlayerCard(false);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        setIsPreparingPlate(true);
        try {
          const preparedPlate = await geminiService.current.prepareAthletePlate(rawBase64);
          setState(prev => ({ ...prev, image: preparedPlate }));
          setStep('league-select');
        } catch (err) {
          setState(prev => ({ ...prev, image: rawBase64 }));
          setStep('league-select');
        } finally {
          setIsPreparingPlate(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwap = async () => {
    if (!state.image || !state.team || !activeProfile) return;
    setIsLoading(true);
    setStep('processing');
    try {
      const [result, stats] = await Promise.all([
        geminiService.current.performJerseySwap(state.image, state.team.name, state.number, state.removeBackground),
        geminiService.current.generatePlayerStats(state.team.name)
      ]);

      setResultImage(result);
      setPlayerData(stats);

      let updatedUser = { ...activeProfile };
      if (activeProfile.vault.length === 0) {
        const firstSwapAch: Achievement = {
          id: 'first_swap',
          title: 'First Draft',
          description: 'Successfully generated your first jersey swap',
          icon: 'Trophy',
          unlockedAt: new Date().toLocaleDateString(),
          rarity: 'Rare'
        };
        updatedUser.achievements = [...updatedUser.achievements, firstSwapAch];
      }

      const newSwap: SavedSwap = {
        id: Date.now().toString(),
        team: state.team.name,
        league: state.league?.name || 'Pro',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.'),
        image: result,
        season: 'S2'
      };

      updatedUser.vault = [newSwap, ...updatedUser.vault].slice(0, 20);
      const updatedProfiles = profiles.map(p => p.id === activeProfile.id ? updatedUser : p);
      setProfiles(updatedProfiles);
      setActiveProfile(updatedUser);
      syncToStorage(updatedProfiles, updatedUser);

      setStep('result');
    } catch (error) {
      alert("Synthesis failure.");
      setStep('customize');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'auth' || (!activeProfile && step !== 'onboarding')) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <div className="max-w-lg w-full relative p-1 group">
          <div className="relative z-10 glass p-8 md:p-12 rounded-[3rem] border border-white/5 bg-black/80 backdrop-blur-3xl">
            <div className="text-center mb-10 flex flex-col items-center">
              <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="w-20 h-20 bg-[#ccff00] rounded-3xl flex items-center justify-center shadow-2xl mb-8" >
                <Zap className="w-10 h-10 text-black fill-current" />
              </motion.div>
              <h1 className="font-oswald italic font-black text-4xl md:text-5xl uppercase tracking-ultra text-white leading-none">
                JERSEY<span className="text-[#ccff00]">SWAP</span>.IO
              </h1>
            </div>

            <AnimatePresence mode="wait">
              {authMode === 'select' && (
                <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-3 mb-6">
                    {profiles.map(p => (
                      <button key={p.id} onClick={() => { setActiveProfile(p); localStorage.setItem(SESSION_KEY, p.id); setStep('landing'); }} className="w-full p-4 glass rounded-[1.5rem] border border-white/5 flex items-center gap-4 hover:border-[#ccff00]/50 transition-all group" >
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
                          <img src={p.avatar || ''} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={p.name} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-oswald italic font-black text-lg text-white uppercase">{p.name}</p>
                          <p className="font-oswald italic font-bold text-[10px] text-[#ccff00] tracking-widest">{p.handle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setAuthMode('signin')} className="p-4 glass rounded-2xl border border-white/10 flex flex-col items-center gap-2 hover:border-[#ccff00] transition-all">
                      <LogIn className="w-5 h-5 text-zinc-500" />
                      <span className="font-oswald italic text-xs text-zinc-500 uppercase font-bold">LOGIN</span>
                    </button>
                    <button onClick={() => setAuthMode('signup')} className="p-4 glass rounded-2xl border border-white/10 flex flex-col items-center gap-2 hover:border-[#ccff00] transition-all">
                      <UserPlus className="w-5 h-5 text-zinc-500" />
                      <span className="font-oswald italic text-xs text-zinc-500 uppercase font-bold">SIGN_UP</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {authMode === 'signin' && (
                <motion.div key="signin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                      <input type="text" placeholder="EMAIL_OR_HANDLE" value={authIdentifier} onChange={e => setAuthIdentifier(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 font-oswald italic font-bold text-white outline-none focus:border-[#ccff00] transition-all" />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                      <input type="password" placeholder="PASSWORD" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 font-oswald italic font-bold text-white outline-none focus:border-[#ccff00] transition-all" />
                    </div>
                  </div>
                  <button onClick={handleSignIn} className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-2xl rounded-2xl shadow-xl uppercase">COMMIT_SIGN_IN</button>
                  <button onClick={() => setAuthMode('select')} className="w-full py-2 text-zinc-600 font-oswald italic text-[10px] uppercase font-black hover:text-white transition-colors tracking-widest">CANCEL</button>
                </motion.div>
              )}

              {authMode === 'signup' && (
                <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                  <input type="text" placeholder="FULL_NAME" value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value.toUpperCase() })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all uppercase font-bold" />
                  <input type="email" placeholder="EMAIL" value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all font-bold" />
                  <input type="text" placeholder="@HANDLE" value={regData.handle} onChange={e => setRegData({ ...regData, handle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all font-bold" />
                  <input type="password" placeholder="PASSWORD" value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all font-bold" />
                  <button onClick={() => { if (!regData.name || !regData.email || !regData.handle) return alert('Incomplete ID'); setStep('onboarding'); }} className="w-full py-5 bg-white text-black font-oswald italic font-black text-2xl rounded-2xl shadow-xl mt-4 uppercase">INIT_ONBOARDING</button>
                  <button onClick={() => setAuthMode('select')} className="w-full py-2 text-zinc-600 font-oswald italic text-[10px] uppercase font-black hover:text-white transition-colors tracking-widest">CANCEL</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-[#ccff00] selection:text-black">
      <header className="fixed top-0 inset-x-0 z-[100] bg-black/50 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 py-2 flex items-center justify-between">
        <div onClick={reset} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-6 h-6 bg-[#ccff00] rounded flex items-center justify-center group-hover:rotate-12 transition-all">
            <Zap className="w-3.5 h-3.5 text-black fill-current" />
          </div>
          <span className="font-oswald italic font-black text-base tracking-tighter uppercase text-white">JERSEY<span className="text-[#ccff00]">SWAP</span>.IO</span>
        </div>
      </header>

      <AnimatePresence>
        {(isSyncing || showSyncSuccess) && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-20 z-[150] px-6 py-3 glass rounded-full border border-[#ccff00]/20 flex items-center gap-4 shadow-2xl backdrop-blur-3xl" >
            {isSyncing ? (
              <><RefreshCw className="w-4 h-4 text-[#ccff00] animate-spin" /><span className="font-oswald italic font-black text-xs tracking-widest text-white uppercase">NEURAL_SYNC...</span></>
            ) : (
              <><CheckCircle2 className="w-4 h-4 text-[#ccff00]" /><span className="font-oswald italic font-black text-xs tracking-widest text-[#ccff00] uppercase">VAULT_COMMITTED</span></>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl pt-20 relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {isPreparingPlate && (
            <motion.div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center">
              <Scan className="w-14 h-14 text-[#ccff00] animate-pulse" />
              <h2 className="font-oswald italic font-black text-4xl text-[#ccff00] mt-10 uppercase tracking-ultra">ANALYZING_PLATE</h2>
            </motion.div>
          )}

          {step === 'landing' && (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
              <h1 className="font-oswald italic font-black text-[5rem] md:text-[10rem] leading-[0.8] uppercase tracking-ultra text-center mb-8">
                <KineticWord>CREATE</KineticWord><br /><KineticWord className="text-[#ccff00]">LEGACY.</KineticWord>
              </h1>
              <div className="flex gap-4">
                <button onClick={() => setStep('upload')} className="px-12 py-5 btn-stadium font-oswald italic font-black text-2xl rounded">START_DRAFT</button>
                <button onClick={() => setStep('profile')} className="px-12 py-5 glass border border-white/10 text-white font-oswald italic font-black text-2xl rounded">OPEN_VAULT</button>
              </div>
            </div>
          )}

          {step === 'upload' && (
            <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-12">
              <div onClick={() => fileInputRef.current?.click()} className="w-full max-w-lg aspect-square glass rounded-[4rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-8 hover:border-[#ccff00]/40 transition-all group cursor-pointer" >
                <Zap className="w-16 h-16 text-zinc-800 group-hover:text-[#ccff00]" />
                <span className="font-oswald italic font-black text-5xl uppercase text-white group-hover:text-[#ccff00]">SOURCE_PLATE</span>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </section>
          )}

          {step === 'league-select' && (
            <section className="flex-1 flex flex-col items-center justify-center py-12">
              <h2 className="font-oswald italic font-black text-6xl uppercase mb-12">THE_ARENA</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl px-6">
                {LEAGUES.map(l => (
                  <button key={l.id} onClick={() => { setState(p => ({ ...p, league: l })); setStep('customize'); }} className="aspect-[4/3] glass rounded-[2rem] border border-white/5 hover:border-[#ccff00]/60 transition-all group flex flex-col items-center justify-center p-6 gap-4" >
                    <img src={l.logo} className="h-20 object-contain opacity-20 group-hover:opacity-100 transition-all" alt={l.name} />
                    <span className="font-oswald italic text-xs tracking-widest text-zinc-500 group-hover:text-white uppercase font-black">{l.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'customize' && state.image && (
            <PhotoEditor 
              image={state.image} 
              teams={TEAMS.filter(t => t.leagueId === state.league?.id)} 
              selectedTeam={state.team} 
              onTeamSelect={(t) => setState(p => ({ ...p, team: t }))} 
              number={state.number} 
              onNumberChange={(n) => setState(p => ({ ...p, number: n }))} 
              removeBackground={state.removeBackground} 
              onToggleBackground={() => setState(p => ({ ...p, removeBackground: !p.removeBackground }))} 
              onSwap={handleSwap} 
              isProcessing={isLoading} 
            />
          )}

          {step === 'processing' && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black">
              <h2 className="font-oswald italic font-black text-[8rem] uppercase tracking-ultra text-[#ccff00] animate-pulse">SYNTHESIZING</h2>
            </div>
          )}

          {step === 'result' && resultImage && (
            <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-6 max-w-6xl mx-auto py-12">
              <div className="w-full lg:w-[45%]">
                <div className="aspect-[3/4] glass rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl relative group">
                  <img src={resultImage} className="w-full h-full object-cover" alt="Result" />
                  <button onClick={() => { const link = document.createElement('a'); link.href = resultImage; link.download = 'jersey-swap.png'; link.click(); }} className="absolute bottom-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ccff00] hover:text-black" >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left space-y-6">
                <h3 className="font-oswald italic font-black text-7xl leading-none uppercase tracking-ultra">NEW_ERA<br /><span className="text-[#ccff00]">{state.team?.name.split(' ').pop()}</span></h3>
                <div className="flex flex-col gap-4">
                  <button onClick={() => setShowPlayerCard(true)} className="py-5 bg-white text-black font-oswald italic font-black text-2xl rounded-2xl hover:bg-[#ccff00] transition-all uppercase">VIEW_CARD</button>
                  <button onClick={reset} className="py-5 glass text-white border border-white/10 font-oswald italic font-black text-2xl rounded-2xl hover:bg-white/5 transition-all uppercase">REMIX</button>
                </div>
              </div>
            </section>
          )}

          {step === 'onboarding' && <OnboardingFlow key="onboarding" onComplete={handleOnboardingComplete} />}
          
          {step === 'profile' && activeProfile && (
            <ProfileView 
              profile={activeProfile} 
              onUpdate={handleUpdateProfile} 
              onBack={() => setStep('landing')} 
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 inset-x-0 z-[100] bg-black/50 backdrop-blur-2xl border-t border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex gap-8">
          <button onClick={() => setStep('profile')} className="font-oswald italic font-black text-[10px] tracking-widest text-zinc-500 hover:text-white uppercase">VAULT</button>
          <button onClick={() => { setActiveProfile(null); localStorage.removeItem(SESSION_KEY); setStep('auth'); }} className="font-oswald italic font-black text-[10px] tracking-widest text-zinc-500 hover:text-red-500 uppercase">SIGN_OUT</button>
        </div>
        <span className="font-oswald italic font-black text-[9px] text-zinc-700">© 2026 JERSEYSWAP.IO</span>
      </footer>

      {showPlayerCard && resultImage && playerData && activeProfile && (
        <PlayerCard 
          image={resultImage} 
          name={activeProfile.name} 
          team={state.team?.name || ''} 
          number={state.number} 
          background={playerData.background} 
          highlights={playerData.highlights} 
          stats={playerData.stats} 
          onClose={() => setShowPlayerCard(false)} 
          onViewProfile={() => { setShowPlayerCard(false); setStep('profile'); }} 
        />
      )}
    </div>
  );
};

export default App;