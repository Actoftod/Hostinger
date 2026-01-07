import React, { useState, useMemo } from 'react';
import { UserProfile, SavedSwap, Achievement } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Grid, BarChart3, Trash2, ExternalLink, Calendar, 
  Shield, Zap, TrendingUp, Download, Settings, Trophy, Star, Medal, Target 
} from 'lucide-react';
import ProfileSettings from './ProfileSettings';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
  onBack: () => void;
  onRemoveSwap?: (id: string) => void;
}

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 -mr-10 -mt-10 ${color}`} />
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl bg-white/5 text-white/60 group-hover:text-white transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-oswald italic font-bold text-[10px] tracking-widest text-zinc-500 uppercase">{label}</span>
      </div>
      <div className="font-oswald italic font-black text-4xl text-white uppercase">{value}</div>
    </div>
  </div>
);

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const rarityColors = {
    Common: 'text-zinc-400 border-zinc-500/20 bg-zinc-500/5',
    Rare: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    Epic: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
    Legendary: 'text-[#ccff00] border-[#ccff00]/20 bg-[#ccff00]/5',
  };

  return (
    <div className={`p-4 rounded-2xl border ${rarityColors[achievement.rarity]} flex items-center gap-4 group hover:scale-[1.02] transition-all`}>
      <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center shrink-0">
        <Trophy className="w-6 h-6" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-oswald italic font-black text-sm uppercase leading-tight truncate">{achievement.title}</p>
        <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5 truncate">{achievement.description}</p>
      </div>
      <div className="text-right">
        <p className="font-oswald italic font-bold text-[8px] tracking-tighter opacity-40">{achievement.unlockedAt}</p>
      </div>
    </div>
  );
};

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate, onBack, onRemoveSwap }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'analytics' | 'medals'>('vault');
  const [showSettings, setShowSettings] = useState(false);

  const analytics = useMemo(() => {
    const total = profile.vault.length;
    const leagues = profile.vault.reduce((acc: any, swap) => {
      acc[swap.league] = (acc[swap.league] || 0) + 1;
      return acc;
    }, {});
    const topLeague = Object.entries(leagues).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'NONE';
    return {
      total,
      topLeague,
      consistency: profile.stats.sync,
      avgOvr: profile.ovr
    };
  }, [profile]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pb-32">
      <div className="flex items-center justify-between mb-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-[#ccff00] group transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-oswald italic font-black text-xs tracking-widest uppercase">BACK_TO_STUDIO</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 text-zinc-500 hover:text-[#ccff00] group transition-all"
        >
          <span className="font-oswald italic font-black text-xs tracking-widest uppercase">CUSTOMIZE_PROFILE</span>
          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        </motion.button>
      </div>

      <section className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16">
        <div className="relative group">
          <div className="absolute inset-0 bg-[#ccff00] blur-3xl opacity-20 rounded-full group-hover:opacity-40 transition-all" />
          <div className="w-44 h-44 rounded-[3rem] bg-zinc-900 border-2 border-white/10 overflow-hidden relative z-10">
            <img 
              src={profile.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop'} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              alt={profile.name}
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-[#ccff00] text-black w-14 h-14 rounded-2xl flex items-center justify-center font-oswald italic font-black text-2xl shadow-2xl z-20">
            {profile.ovr}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left pt-4">
          <h1 className="font-oswald font-black text-6xl md:text-8xl text-white uppercase italic leading-[0.85] tracking-ultra mb-4">
            {profile.name.split(' ')[0]}<br />
            <span className="text-zinc-800">{profile.name.split(' ')[1] || 'PRO'}</span>
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <span className="text-[#ccff00] font-oswald font-black text-xl italic tracking-widest uppercase">{profile.handle}</span>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-oswald italic font-bold text-[10px] text-zinc-400 uppercase tracking-widest">{profile.role}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-10 border-b border-white/5 mb-10">
        {[
          { id: 'vault', label: 'THE_VAULT' },
          { id: 'analytics', label: 'NEURAL_ANALYTICS' },
          { id: 'medals', label: 'ACHIEVEMENTS' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 font-oswald italic font-black text-xs tracking-[0.3em] uppercase transition-all relative ${
              activeTab === tab.id ? 'text-[#ccff00]' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#ccff00]" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'vault' ? (
          <motion.div
            key="vault"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {profile.vault.length > 0 ? (
              profile.vault.map((swap) => (
                <div key={swap.id} className="group relative aspect-[3/4] glass rounded-[2rem] overflow-hidden border border-white/10">
                  <img src={swap.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={swap.team} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <p className="font-oswald italic font-black text-lg text-white uppercase leading-none">{swap.team}</p>
                    <p className="font-oswald italic font-bold text-[10px] text-[#ccff00] tracking-widest uppercase mt-1">{swap.league}</p>
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = swap.image;
                          link.download = `swap-${swap.id}.png`;
                          link.click();
                        }}
                        className="flex-1 py-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-[#ccff00] hover:text-black transition-all flex items-center justify-center"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onRemoveSwap?.(swap.id)}
                        className="w-10 h-10 bg-red-500/20 text-red-500 backdrop-blur-md rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center glass rounded-[3rem] border border-dashed border-white/10">
                <Grid className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                <p className="font-oswald italic font-black text-2xl text-zinc-600 uppercase">VAULT_EMPTY_DRAFT_REQUIRED</p>
              </div>
            )}
          </motion.div>
        ) : activeTab === 'analytics' ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="TOTAL_SWAPS" value={analytics.total} icon={Grid} color="bg-blue-500" />
              <StatCard label="PRIMARY_LEAGUE" value={analytics.topLeague} icon={ExternalLink} color="bg-[#ccff00]" />
              <StatCard label="SYNC_PRECISION" value={`${analytics.consistency}%`} icon={TrendingUp} color="bg-purple-500" />
              <StatCard label="AVG_PLAYER_OVR" value={analytics.avgOvr} icon={Zap} color="bg-orange-500" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="medals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {profile.achievements && profile.achievements.length > 0 ? (
              profile.achievements.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center glass rounded-[3rem] border border-dashed border-white/10">
                <Trophy className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                <p className="font-oswald italic font-black text-2xl text-zinc-600 uppercase">NO_ACHIEVEMENTS_EARNED</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <ProfileSettings 
            profile={profile} 
            onClose={() => setShowSettings(false)} 
            onSave={(updated) => {
              onUpdate(updated);
              setShowSettings(false);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileView;