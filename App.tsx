
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppStep, SwapState, UserProfile, SavedSwap } from './types';
import { TEAMS, LEAGUES } from './constants';
import { GeminiService } from './services/geminiService';
import PlayerCard from './components/PlayerCard';
import PhotoEditor from './components/PhotoEditor';
import AILab from './components/AILab';
import OnboardingFlow from './components/OnboardingFlow';
import ProfileView from './components/ProfileView';
import AdvancedEditor from './components/AdvancedEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LayoutGrid, Cpu, Target, Layers, ArrowRight, Lock, Activity, Edit3, ChevronRight, Download, Sparkles, Scan, LogIn, UserPlus, Users, CloudRain, Save, CheckCircle2, RefreshCw, Mail, KeyRound, Globe } from 'lucide-react';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const STORAGE_ACCOUNTS_KEY = 'js_pro_accounts_v1';
const SESSION_KEY = 'js_pro_session_v1';

const KineticWord = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.span
    className={`inline-block origin-left ${className}`}
    whileHover={{ 
      skewX: -12, 
      scale: 1.05, 
      x: 10,
      transition: { type: 'spring', stiffness: 400, damping: 15 } 
    }}
  >
    {children}
  </motion.span>
);

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [step, setStep] = useState<AppStep>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'select'>('select');
  const [showAILab, setShowAILab] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [lockerRoomValue, setLockerRoomValue] = useState(50);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  
  // Auth Inputs
  const [authIdentifier, setAuthIdentifier] = useState(''); // Handle or Email
  const [authPassword, setAuthPassword] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authHandle, setAuthHandle] = useState('');
  const [authName, setAuthName] = useState('');

  const [state, setState] = useState<SwapState>({ 
    image: null, 
    league: null, 
    team: null, 
    number: '23', 
    removeBackground: false 
  });
  
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [is4K, setIs4K] = useState(false);
  const [playerData, setPlayerData] = useState<{ background: string; highlights: string[]; stats: Record<string, number> } | null>(null);
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing4K, setIsSynthesizing4K] = useState(false);
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
        console.error("Storage corrupted:", e);
      }
    }

    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const has = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(has);
        } else {
          setHasApiKey(true);
        }
      } catch (e) {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(profiles));
    }
  }, [profiles]);

  // FIX: Added missing handleSelectKey function for API Key configuration
  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success after interaction per guidelines
      setHasApiKey(true);
    }
  };

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(profiles));
    if (activeProfile) {
      localStorage.setItem(SESSION_KEY, activeProfile.id);
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 2000);
  };

  const handleSignIn = () => {
    const input = authIdentifier.trim().toLowerCase();
    const found = profiles.find(p => 
      (p.handle.toLowerCase() === input || p.handle.toLowerCase() === `@${input}` || p.email.toLowerCase() === input) && 
      p.password === authPassword
    );

    if (found) {
      loginProfile(found);
    } else {
      alert("Neural sync denied. Verify credentials or use SSO.");
    }
  };

  const handleSSO = (provider: 'google' | 'discord') => {
    setIsSyncing(true);
    setTimeout(() => {
      // Simulate finding or creating a guest profile
      const guestHandle = `@${provider}_pioneer_${Math.floor(Math.random() * 1000)}`;
      const guestProfile: UserProfile = {
        id: `sso_${Date.now()}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Explorer`,
        email: `${provider}@sso.io`,
        handle: guestHandle,
        role: 'Pro Designer',
        leaguePreference: 'Global Elite',
        bio: `Authenticated via ${provider} neural gateway.`,
        avatar: null,
        stats: { precision: 80, sync: 80, speed: 80 },
        ovr: 80,
        vault: []
      };
      setProfiles(prev => [...prev, guestProfile]);
      loginProfile(guestProfile);
      setIsSyncing(false);
    }, 1200);
  };

  const handleStartSignUp = () => {
    if (!authEmail || !authPassword || !authHandle || !authName) {
      alert("Missing core identity markers.");
      return;
    }
    setStep('onboarding');
  };

  const loginProfile = (p: UserProfile) => {
    setActiveProfile(p);
    localStorage.setItem(SESSION_KEY, p.id);
    setStep('landing');
  };

  const logout = () => {
    setActiveProfile(null);
    localStorage.removeItem(SESSION_KEY);
    setStep('auth');
    setAuthMode('select');
  };

  const saveSwapToVault = (img: string) => {
    if (!activeProfile || !state.team) return;
    const newSwap: SavedSwap = {
      id: Date.now().toString(),
      team: state.team.name.split(': ').pop() || 'Unknown',
      league: state.league?.name || 'Pro',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.'),
      image: img,
      season: 'S2'
    };
    const updatedProfiles = profiles.map(p => {
      if (p.id === activeProfile.id) {
        return { ...p, vault: [newSwap, ...p.vault].slice(0, 20) };
      }
      return p;
    });
    setProfiles(updatedProfiles);
    setActiveProfile(updatedProfiles.find(p => p.id === activeProfile.id) || null);
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updatedProfiles));
  };

  const handleOnboardingComplete = (onboardingData: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: authName,
      email: authEmail,
      password: authPassword,
      handle: authHandle.startsWith('@') ? authHandle : `@${authHandle}`,
      role: onboardingData.role || 'Pro Designer',
      leaguePreference: onboardingData.leaguePreference || 'Elite',
      bio: onboardingData.bio || 'Neural link established.',
      avatar: onboardingData.avatar || null,
      stats: onboardingData.stats || { precision: 85, sync: 90, speed: 75 },
      ovr: onboardingData.ovr || 85,
      vault: []
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setActiveProfile(newProfile);
    localStorage.setItem(SESSION_KEY, newProfile.id);
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updatedProfiles));
    setStep('landing');
  };

  const reset = useCallback(() => {
    setStep('landing');
    setShowAILab(false);
    setState({ image: null, league: null, team: null, number: '23', removeBackground: false });
    setResultImage(null);
    setIs4K(false);
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
    if (!state.image || !state.team) return;
    setIsLoading(true);
    setStep('processing');
    try {
      const [result, stats] = await Promise.all([
        geminiService.current.performJerseySwap(state.image, state.team.name, state.number, state.removeBackground),
        geminiService.current.generatePlayerStats(state.team.name)
      ]);
      setResultImage(result);
      setPlayerData(stats);
      saveSwapToVault(result);
      setStep('result');
    } catch (error: any) {
      if (error?.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
      } else {
        alert("Neural mapping failure.");
      }
      setStep('customize');
    } finally { setIsLoading(false); }
  };

  const handle4KUpgrade = async () => {
    if (!resultImage || !state.team) return;
    setIsSynthesizing4K(true);
    try {
      const upgraded = await geminiService.current.perform4KSynthesis(resultImage, state.team.name);
      setResultImage(upgraded);
      setIs4K(true);
      saveSwapToVault(upgraded);
    } catch (err) {
      alert("4K Synthesis failed.");
    } finally {
      setIsSynthesizing4K(false);
    }
  };

  // FIX: Added missing handleDownload function to export synthesized results
  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `jerseyswap_remix_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <div className="max-md w-full glass p-8 rounded-2xl border border-white/5 text-center animate-in zoom-in-95">
          <div className="w-14 h-14 bg-[#ccff00] rounded-xl mx-auto flex items-center justify-center shadow-lg mb-6 rotate-12">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <h2 className="font-oswald italic font-black text-2xl uppercase tracking-tighter text-white mb-2">Neural Link Required</h2>
          <p className="text-zinc-600 font-inter text-xs leading-relaxed mb-6">
            JERSEYSWAP.IO requires an authenticated neural key for elite 8K kit synthesis.
          </p>
          <button onClick={handleSelectKey} className="w-full py-3.5 btn-stadium font-oswald italic font-black text-base rounded uppercase tracking-tighter">
            CONNECT_KEY_v5.4
          </button>
        </div>
      </div>
    );
  }

  // Auth Screen / Profile Selector
  if (step === 'auth' || !activeProfile && step !== 'onboarding') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ccff00]/5 blur-[200px] rounded-full animate-pulse pointer-events-none" />

        <div className="max-w-lg w-full relative p-1 group">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full" fill="none">
              <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="48" stroke="#ccff00" strokeWidth="4" className="electric-border" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="relative z-10 glass p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden bg-black/80 backdrop-blur-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/10 blur-[80px]" />
            
            <div className="text-center mb-10 flex flex-col items-center">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="w-20 h-20 bg-[#ccff00] rounded-3xl flex items-center justify-center shadow-2xl mb-8 volt-glow"
              >
                 <Zap className="w-10 h-10 text-black fill-current" />
              </motion.div>
              
              <div className="relative inline-block px-10 py-5">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <svg className="w-full h-full" fill="none">
                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="16" stroke="#ccff00" strokeWidth="3" className="electric-border" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
                <h1 className="relative z-10 font-oswald italic font-black text-4xl md:text-5xl uppercase tracking-ultra text-white leading-none">
                  JERSEY<span className="text-[#ccff00]">SWAP</span><span className="text-white">.IO</span>
                </h1>
              </div>
              <p className="text-zinc-500 font-oswald italic text-[10px] tracking-mega uppercase font-black mt-6">IDENTITY_SYNC_ENGINE_v5.4</p>
            </div>

            <AnimatePresence mode="wait">
              {authMode === 'select' && (
                <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
                  <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-3 mb-6">
                    {profiles.map(p => (
                      <button key={p.id} onClick={() => loginProfile(p)} className="w-full p-4 glass rounded-[1.5rem] border border-white/5 flex items-center gap-4 hover:border-[#ccff00]/50 hover:bg-[#ccff00]/5 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                          <img src={p.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-oswald italic font-black text-lg text-white leading-none uppercase">{p.name}</p>
                          <p className="font-oswald italic font-bold text-[10px] text-[#ccff00] tracking-widest leading-none mt-1">{p.handle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setAuthMode('signin')} className="p-4 glass rounded-2xl border border-white/10 flex flex-col items-center gap-2 hover:border-[#ccff00] transition-all group">
                       <LogIn className="w-5 h-5 text-zinc-500 group-hover:text-[#ccff00]" />
                       <span className="font-oswald italic text-[10px] text-zinc-500 uppercase font-black">LOGIN</span>
                    </button>
                    <button onClick={() => setAuthMode('signup')} className="p-4 glass rounded-2xl border border-white/10 flex flex-col items-center gap-2 hover:border-[#ccff00] transition-all group">
                       <UserPlus className="w-5 h-5 text-zinc-500 group-hover:text-[#ccff00]" />
                       <span className="font-oswald italic text-[10px] text-zinc-500 uppercase font-black">SIGN_UP</span>
                    </button>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                     <p className="font-oswald italic text-[8px] text-zinc-600 uppercase font-black tracking-widest text-center mb-1">OR_CONNECT_VIA_SSO</p>
                     <div className="flex gap-2">
                        <button onClick={() => handleSSO('google')} className="flex-1 py-3 glass border border-white/5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                           <Globe className="w-3.5 h-3.5 text-blue-400" />
                           <span className="font-oswald italic text-[9px] font-black uppercase text-zinc-400">GOOGLE</span>
                        </button>
                        <button onClick={() => handleSSO('discord')} className="flex-1 py-3 glass border border-white/5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                           <Users className="w-3.5 h-3.5 text-indigo-400" />
                           <span className="font-oswald italic text-[9px] font-black uppercase text-zinc-400">DISCORD</span>
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}

              {authMode === 'signin' && (
                <motion.div key="signin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                       <input 
                         type="text" 
                         placeholder="EMAIL_OR_HANDLE" 
                         value={authIdentifier} 
                         onChange={e => setAuthIdentifier(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 font-oswald italic font-bold text-white outline-none focus:border-[#ccff00] transition-all"
                       />
                    </div>
                    <div className="relative">
                       <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                       <input 
                         type="password" 
                         placeholder="NEURAL_PASSWORD" 
                         value={authPassword} 
                         onChange={e => setAuthPassword(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 font-oswald italic font-bold text-white outline-none focus:border-[#ccff00] transition-all"
                       />
                    </div>
                  </div>
                  <button onClick={handleSignIn} className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-2xl rounded-2xl shadow-xl active:scale-95 transition-all uppercase">COMMIT_SIGN_IN</button>
                  <button onClick={() => setAuthMode('select')} className="w-full py-2 text-zinc-600 font-oswald italic text-[10px] uppercase font-black hover:text-white transition-colors tracking-widest">CANCEL_REQUEST</button>
                </motion.div>
              )}

              {authMode === 'signup' && (
                <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <input type="text" placeholder="FULL_LEGAL_NAME" value={authName} onChange={e => setAuthName(e.target.value.toUpperCase())} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all uppercase font-bold" />
                  <input type="email" placeholder="NEURAL_EMAIL" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all font-bold" />
                  <input type="text" placeholder="@HANDLE" value={authHandle} onChange={e => setAuthHandle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all font-bold" />
                  <input type="password" placeholder="SECURE_PASSWORD" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 font-oswald italic text-white outline-none focus:border-[#ccff00] transition-all font-bold" />
                  <button onClick={handleStartSignUp} className="w-full py-5 bg-white text-black font-oswald italic font-black text-2xl rounded-2xl shadow-xl mt-4 active:scale-95 transition-all uppercase">INIT_ONBOARDING</button>
                  <button onClick={() => setAuthMode('select')} className="w-full py-2 text-zinc-600 font-oswald italic text-[10px] uppercase font-black hover:text-white transition-colors tracking-widest">CANCEL_REQUEST</button>
                </motion.div>
              )}
            </AnPresence>

            <div className="flex items-center gap-1.5 justify-center text-zinc-800 mt-10">
              <Lock className="w-3 h-3" />
              <span className="font-oswald italic text-[8px] tracking-widest uppercase font-black">NEURAL_END_TO_END_ENCRYPTED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-[#ccff00] selection:text-black">
      <header className="fixed top-0 inset-x-0 z-[100] bg-black/50 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 py-2 flex items-center justify-between">
        <div onClick={reset} className="flex items-center gap-3 cursor-pointer group" role="button">
          <div className="w-6 h-6 bg-[#ccff00] rounded flex items-center justify-center group-hover:rotate-12 transition-all">
            <Zap className="w-3.5 h-3.5 text-black fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-oswald italic font-black text-base tracking-tighter uppercase leading-none">JERSEY<span className="text-[#ccff00]">SWAP</span><span className="text-white">.IO</span></span>
            <span className="font-oswald italic font-black text-[7px] tracking-[0.25em] text-[#ccff00] uppercase opacity-80 leading-none mt-1">ENGINE_v5.4_SYNCED</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex gap-6 font-oswald italic text-[9px] tracking-[0.2em] text-zinc-500 font-black uppercase">
          <button onClick={() => { setShowAILab(!showAILab); setStep('landing'); }} className={`hover:text-[#ccff00] transition-colors flex items-center gap-1.5 ${showAILab ? 'text-[#ccff00]' : ''}`}>
            <Cpu className="w-3 h-3" /> NEURAL_LAB
          </button>
          <button onClick={() => setStep('profile')} className={`hover:text-white transition-colors flex items-center gap-1.5 ${step === 'profile' ? 'text-white' : ''}`}>
            <LayoutGrid className="w-3 h-3" /> VAULT
          </button>
          <button onClick={handleGlobalSync} className="hover:text-[#ccff00] transition-colors flex items-center gap-1.5">
             <Save className="w-3 h-3" /> SAVE_ALL
          </button>
          <button onClick={() => logout()} className="hover:text-red-500 transition-colors flex items-center gap-1.5">
             <Users className="w-3 h-3" /> SWITCH_USER
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {activeProfile && (
            <button onClick={() => setStep('profile')} className="flex items-center gap-2.5 pl-2.5 pr-0.5 py-0.5 glass rounded-full border border-white/5 hover:border-[#ccff00]/30 transition-all group">
              <div className="flex flex-col items-end leading-none">
                <span className="font-oswald italic font-black text-[8px] uppercase tracking-widest text-white">{activeProfile.name}</span>
                <span className="font-oswald italic text-[6px] text-[#ccff00] uppercase tracking-widest leading-none mt-0.5">OVR_{activeProfile.ovr}</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-[#ccff00]/30 overflow-hidden">
                 <img src={activeProfile.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop'} className="w-full h-full object-cover" />
              </div>
            </button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {(isSyncing || showSyncSuccess) && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-20 z-[150] px-6 py-3 glass rounded-full border border-[#ccff00]/20 flex items-center gap-4 shadow-2xl backdrop-blur-3xl">
             {isSyncing ? (
               <>
                 <RefreshCw className="w-4 h-4 text-[#ccff00] animate-spin" />
                 <span className="font-oswald italic font-black text-xs tracking-widest text-white uppercase">NEURAL_SYNC_ACTIVE...</span>
               </>
             ) : (
               <>
                 <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                 <span className="font-oswald italic font-black text-xs tracking-widest text-[#ccff00] uppercase">VAULT_COMMITTED_v5.4</span>
               </>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl pt-10 relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {isPreparingPlate && (
            <motion.div key="prep-loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden">
              <div className="relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-40 h-40 rounded-full border-[6px] border-[#ccff00]/10 border-t-[#ccff00] shadow-[0_0_80px_rgba(204,255,0,0.3)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scan className="w-14 h-14 text-[#ccff00] animate-pulse" />
                </div>
              </div>
              <h2 className="font-oswald italic font-black text-6xl text-[#ccff00] mt-10 uppercase tracking-ultra">ANALYZING_PLATE</h2>
            </motion.div>
          )}

          {step === 'landing' && !showAILab && (
            <div key="landing" className="animate-in fade-in duration-700 pb-16 flex-1 flex flex-col items-center justify-center">
              <section className="flex flex-col items-center justify-center text-center space-y-8 px-6 py-12">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <h1 className="font-oswald italic font-black text-[4.5rem] md:text-[8rem] leading-[0.8] uppercase tracking-ultra text-center select-none cursor-default">
                    <div className="overflow-hidden">
                      <motion.div initial={{ y: 200 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                        <KineticWord>CREATE</KineticWord> <KineticWord>THE</KineticWord>
                      </motion.div>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div initial={{ y: 200 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                        <KineticWord className="text-[#ccff00]">LEGACY.</KineticWord>
                      </motion.div>
                    </div>
                  </h1>
                  <h2 className="font-inter italic text-zinc-500 text-sm md:text-lg leading-relaxed tracking-tight font-light max-w-xl mx-auto text-center">
                    Professional-grade AI for <strong className="text-white font-black">Athlete Branding</strong> & <strong className="text-white font-black">Fabric Synthesis</strong>. High-performance rendering in 8K resolution.
                  </h2>
                  <div className="pt-4 flex flex-col md:flex-row gap-4 justify-center">
                    <button onClick={() => setStep('upload')} className="px-10 py-5 btn-stadium font-oswald italic font-black text-2xl tracking-tighter rounded active:scale-95 flex items-center gap-3 justify-center">
                      [ START_DRAFT ] <ArrowRight className="w-5 h-5" />
                    </button>
                    <button onClick={handleGlobalSync} className="px-10 py-5 glass border border-white/5 text-white font-oswald italic font-black text-2xl tracking-tighter rounded active:scale-95 flex items-center gap-3 justify-center">
                      SYNC_CLOUD <Save className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
                <div className="w-full flex justify-center mt-10">
                  <div className="w-full overflow-hidden py-8 opacity-40 border-y border-white/5 bg-white/[0.01]">
                    <motion.div className="flex items-center gap-6 whitespace-nowrap" animate={{ x: [0, -1030] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-6">
                          {LEAGUES.map(l => (
                            <motion.div key={l.id} className="flex items-center gap-3 mx-4 group/item cursor-pointer" whileHover={{ scale: 1.08 }}>
                              <img src={l.logo} alt={l.name} loading="lazy" className="h-10 w-10 object-contain grayscale opacity-30 group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all duration-300" style={{ filter: `drop-shadow(0 0 15px ${l.accentColor}00)` }} />
                              <span className="font-oswald italic font-black text-[22px] tracking-[0.1em] text-white/20 group-hover/item:text-white uppercase transition-all duration-300">{l.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {showAILab && <div key="ai-lab" className="py-8"><AILab /></div>}
          {step === 'upload' && (
             <section className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 space-y-10 py-12">
               <div className="text-center space-y-4">
                 <h2 className="font-oswald italic font-black text-7xl md:text-9xl uppercase tracking-ultra mb-1 text-center leading-none">SOURCE_PLATE</h2>
               </div>
               <div onClick={() => fileInputRef.current?.click()} className="w-full max-w-lg aspect-square glass rounded-[4rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-8 hover:border-[#ccff00]/40 transition-all group cursor-pointer shadow-2xl relative overflow-hidden">
                 <Zap className="w-16 h-16 text-zinc-800 group-hover:text-[#ccff00] transition-all" />
                 <span className="font-oswald italic font-black text-5xl uppercase tracking-ultra text-white group-hover:text-[#ccff00] transition-colors">DRAG_OR_SYNC</span>
               </div>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
             </section>
          )}

          {step === 'league-select' && (
            <section className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-right-10 duration-700 py-12">
              <h2 className="font-oswald italic font-black text-7xl uppercase tracking-ultra mb-12 text-center">THE_ARENA</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl px-6">
                {LEAGUES.map(l => (
                  <button key={l.id} onClick={() => { setState(p => ({ ...p, league: l })); setStep('customize'); }} className="aspect-[4/3] glass rounded-[2rem] border border-white/5 hover:border-[#ccff00]/60 transition-all group flex flex-col items-center justify-center p-6 gap-4">
                    <img src={l.logo} className="h-20 object-contain opacity-20 group-hover:opacity-100 transition-all group-hover:scale-110" alt={l.name} />
                    <span className="font-oswald italic text-xs tracking-widest text-zinc-500 group-hover:text-white uppercase font-black">{l.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'customize' && state.image && (
            <PhotoEditor 
              image={state.image} teams={TEAMS.filter(t => t.leagueId === state.league?.id)} selectedTeam={state.team} onTeamSelect={(t) => setState(p => ({ ...p, team: t }))}
              number={state.number} onNumberChange={(n) => setState(p => ({ ...p, number: n }))} removeBackground={state.removeBackground} onToggleBackground={() => setState(p => ({ ...p, removeBackground: !p.removeBackground }))}
              onSwap={handleSwap} isProcessing={isLoading}
            />
          )}

          {step === 'processing' && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black overflow-hidden">
              <h2 className="font-oswald italic font-black text-7xl md:text-[11rem] uppercase tracking-ultra text-[#ccff00] animate-pulse">SYNTHESIZING</h2>
            </motion.section>
          )}

          {step === 'result' && resultImage && (
            <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-6 max-w-6xl mx-auto py-12 relative">
              <div className="w-full lg:w-[40%]">
                <div className="aspect-[3/4] glass rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl relative group">
                   <img src={resultImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Result" />
                   <button onClick={handleDownload} className="absolute bottom-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ccff00] hover:text-black">
                     <Download className="w-6 h-6" />
                   </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-10">
                 <h3 className="font-oswald italic font-black text-6xl md:text-9xl leading-none uppercase tracking-ultra">New_Era <br /> {state.team?.name.split(': ').pop()}</h3>
                 <div className="flex flex-col gap-4 w-full max-md:max-w-md">
                    <button onClick={() => setShowPlayerCard(true)} className="py-5 bg-white text-black font-oswald italic font-black text-2xl rounded-2xl hover:bg-[#ccff00] transition-all uppercase shadow-2xl">VIEW_CARD</button>
                    <button onClick={reset} className="py-5 glass text-white border border-white/10 font-oswald italic font-black text-2xl rounded-2xl hover:bg-white/10 transition-all uppercase">REMIX</button>
                 </div>
              </div>
            </section>
          )}

          {step === 'editor' && resultImage && (
            <div className="flex-1 py-10 flex items-center justify-center">
              <AdvancedEditor initialImage={resultImage} onSave={(img) => { setResultImage(img); saveSwapToVault(img); setStep('result'); }} onBack={() => setStep('result')} />
            </div>
          )}

          {step === 'onboarding' && <OnboardingFlow key="onboarding" onComplete={handleOnboardingComplete} />}
          {step === 'profile' && activeProfile && (
            <ProfileView profile={activeProfile} onUpdate={(p) => { 
                const updated = profiles.map(prev => prev.id === p.id ? p : prev);
                setProfiles(updated);
                setActiveProfile(p);
                localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updated));
            }} onBack={reset} />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full bg-black/50 backdrop-blur-2xl border-t border-white/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <Zap className="w-3.5 h-3.5 text-[#ccff00]" />
          <span className="font-oswald italic font-black text-[10px] tracking-tighter uppercase text-zinc-500">© 2026 JERSEYSWAP.IO</span>
          <div className="flex gap-6 font-oswald italic text-[8px] tracking-[0.3em] text-zinc-600 font-bold uppercase">
            <a href="#" className="hover:text-white transition-colors">LICENSING</a>
            <a href="#" className="hover:text-white transition-colors">NEURAL_ETHICS</a>
          </div>
        </div>
      </footer>

      {showPlayerCard && resultImage && playerData && activeProfile && (
        <PlayerCard image={resultImage} name={activeProfile.name || "Athlete_X"} team={state.team?.name || 'Unassigned'} number={state.number} background={playerData.background} highlights={playerData.highlights} stats={playerData.stats} onClose={() => setShowPlayerCard(false)} onViewProfile={() => { setShowPlayerCard(false); setStep('profile'); }} />
      )}
    </div>
  );
};

export default App;
