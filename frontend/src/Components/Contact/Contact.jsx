import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Mail, Phone, MapPin, Globe, Zap, MessageSquare, Compass, Shield, ArrowRight, ShieldCheck } from "lucide-react";
import ChatWidget from "../common/ChatWidget";

const Contact = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-20 overflow-hidden relative">
      {/* Premium Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(250,250,249,0.8)_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Sleek Header Section */}
        <header className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-sm shadow-emerald-500/5">
            <Compass className="w-4 h-4" /> Real-Time Assistance
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-stone-900 mb-6 tracking-tighter leading-[1.1]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Always here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 italic font-medium pr-2">guide you.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-stone-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Our support infrastructure is totally redesigned. Skip the waiting lines and start a direct conversation with our administrators.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Info Side (Takes up 5 columns left) */}
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-5 h-full">
            <div className="bg-white/60 backdrop-blur-3xl p-8 sm:p-10 rounded-[40px] border border-white shadow-xl shadow-stone-200/50 h-full relative overflow-hidden group hover:bg-white/80 transition-all duration-500">
              {/* Decorative Corner Shield */}
              <div className="absolute -top-12 -right-12 p-6 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700">
                <Shield className="w-64 h-64 text-emerald-600" />
              </div>

              <h2 className="text-xs font-black text-stone-400 mb-10 tracking-[0.2em] uppercase">Official Channels</h2>

              <div className="space-y-8 relative z-10">
                {[
                  { icon: Mail, label: 'Email Support', value: 'hello@travelguide.com', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { icon: Phone, label: 'Helpline', value: '+92 301 5440 307', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
                  { icon: MapPin, label: 'Headquarters', value: 'Haripur, KP, Pakistan', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 group/item cursor-default">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-3 shadow-inner ${item.bg} border ${item.border}`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-stone-800 font-black text-lg tracking-tight group-hover/item:text-emerald-600 transition-colors">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-stone-200/60">
                 <div className="flex items-center gap-3 opacity-60">
                    <Globe className="w-5 h-5 text-stone-500" />
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Available Nationwide</p>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Promotion Side (Takes up 7 columns right) */}
          <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-7 h-full">
            <div className="bg-stone-900 p-8 sm:p-12 rounded-[40px] border border-stone-800 relative z-10 text-center h-full flex flex-col justify-center overflow-hidden shadow-2xl shadow-emerald-900/20 group">
              
              {/* Premium Glow effect behind Chat Box */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay"></div>

              <div className="relative z-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 mb-8 transform -rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                     <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 rounded-full border border-stone-700 mb-6 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mr-1">Live Systems Online</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-6" style={{ fontFamily: 'var(--font-display)', color: '#f59e0b' }}>
                    Drop the forms.<br/>
                    <span style={{ background: 'linear-gradient(to right, #34d399, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Start a Conversation.</span>
                  </h2>
                  
                  <p className="text-stone-400 font-medium text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-10">
                    Get answers in seconds, not hours. Our live team is ready to guide you through your planning and booking process.
                  </p>

                  <div className="max-w-md mx-auto">
                    {!isAuthenticated ? (
                      <button 
                        onClick={() => window.location.href='/traveler-signin'}
                        className="w-full py-5 bg-white text-emerald-900 rounded-[24px] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 transition-all hover:-translate-y-1 group/btn"
                      >
                        Authenticate to Chat 
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover/btn:bg-emerald-500 transition-colors">
                            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover/btn:text-white transition-colors" />
                        </div>
                      </button>
                    ) : (
                       <div className="p-6 bg-emerald-900/40 rounded-[24px] border border-emerald-500/30 backdrop-blur-lg flex items-start gap-4 text-left">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/40">
                             <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                              <h4 className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: '#34d399' }}>Secure Channel Ready</h4>
                              <p className="text-stone-400 font-medium text-xs leading-relaxed">
                                You're logged in. Simply click the floating <span className="text-emerald-400 font-bold">Chat Button</span> in the bottom corner to message Admin instantly.
                              </p>
                          </div>
                       </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-8 mt-12 opacity-60">
                     <div className="flex flex-col items-center gap-2">
                        <Zap className="w-5 h-5 text-stone-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Lightning Fast</span>
                     </div>
                     <div className="w-1 h-1 rounded-full bg-stone-700"></div>
                     <div className="flex flex-col items-center gap-2">
                        <Shield className="w-5 h-5 text-stone-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">End-to-End Secure</span>
                     </div>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <ChatWidget />
    </div>
  );
};

export default Contact;
