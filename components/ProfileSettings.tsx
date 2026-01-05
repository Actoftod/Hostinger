import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion } from 'framer-motion';
import { X, Camera, Save, Shield, User, AtSign, FileText, Globe } from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });

  const ROLES: UserProfile['role'][] = ['Athlete', 'Pro Designer', 'Scout'];
  const LEAGUES = ['Elite', 'Global', 'Grassroots', 'Legends'];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-oswald italic font-black text-3xl text-white uppercase tracking-tight">IDENTITY_CONFIG</h2>
            <p className="text-zinc-500 font-oswald italic text-[10px] tracking-widest uppercase">Protocol v5.5 Override</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-800 border-2 border-white/10 overflow-hidden">
                <img 
                  src={formData.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'} 
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] cursor-pointer">
                <Camera className="w-8 h-8 text-[#ccff00]" />
              </div>
            </div>
            <div className="w-full">
              <label className="block font-oswald italic font-bold text-[10px] text-zinc-500 uppercase tracking-widest mb-2 px-1">AVATAR_PLATE_URL</label>
              <input 
                type="text" 
                value={formData.avatar || ''} 
                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-oswald text-sm text-white outline-none focus:border-[#ccff00] transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {/* Grid Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-oswald italic font-bold text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                <User className="w-3 h-3" /> FULL_NAME
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-oswald text-lg font-black text-white outline-none focus:border-[#ccff00] transition-all uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-oswald italic font-bold text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                <AtSign className="w-3 h-3" /> NEURAL_HANDLE
              </label>
              <input 
                type="text" 
                value={formData.handle}
                onChange={e => setFormData({ ...formData, handle: e.target.value.startsWith('@') ? e.target.value : `@${e.target.value}` })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-oswald text-lg font-black text-[#ccff00] outline-none focus:border-[#ccff00] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-oswald italic font-bold text-[10px] text-zinc-500 uppercase tracking-widest px-1">
              <FileText className="w-3 h-3" /> NEURAL_BIO
            </label>
            <textarea 
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 font-oswald text-sm text-zinc-300 outline-none focus:border-[#ccff00] transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-oswald italic font-bold text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                <Shield className="w-3 h-3" /> ROLE_PERMISSION
              </label>
              <select 
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl p-4 font-oswald text-sm text-white outline-none focus:border-[#ccff00] transition-all appearance-none"
              >
                {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-oswald italic font-bold text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                <Globe className="w-3 h-3" /> ARENA_PREFERENCE
              </label>
              <select 
                value={formData.leaguePreference}
                onChange={e => setFormData({ ...formData, leaguePreference: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl p-4 font-oswald text-sm text-white outline-none focus:border-[#ccff00] transition-all appearance-none"
              >
                {LEAGUES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/40">
          <button 
            onClick={() => onSave(formData)}
            className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase"
          >
            <Save className="w-6 h-6" /> COMMIT_CHANGES
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSettings;