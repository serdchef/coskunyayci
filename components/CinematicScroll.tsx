'use client';

import { motion } from 'framer-motion';
import { Droplet, Wind, Leaf } from 'lucide-react';

export default function CinematicScroll() {
  const layerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.7 },
    }),
  };

  // Metallic Gold Gradient Classes
  const MetallicGoldText = 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent';
  const MetallicGoldBorder = 'border-amber-500/20';
  const GoldGlow = 'drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]';

  return (
    <div className="w-full relative z-10 space-y-32 py-20" style={{ backgroundColor: '#022c22' }}>
      {/* ARCHITECTURAL LAYERS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Dark Blueprint Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-slate-900 to-black rounded-2xl opacity-60 -z-10" />
        
        <div className="relative rounded-2xl border overflow-hidden p-16 md:p-20" style={{borderColor: 'rgba(251, 191, 36, 0.15)'}}>
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4a017" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Main Title */}
          <div className="text-center mb-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="inline-block px-4 py-2 border rounded" style={{borderColor: 'rgba(251, 191, 36, 0.3)'}}>
                <span className={`${MetallicGoldText} text-xs tracking-widest font-serif uppercase`}>TEKNIK ANALIZ</span>
              </div>
            </motion.div>
            
            <h3 className={`text-4xl md:text-5xl font-serif font-bold mb-4 ${MetallicGoldText}`}>
              Katman Mimarisi
            </h3>
            <p className={`text-sm tracking-wider uppercase ${MetallicGoldText}`}>Her katmanın teknik özellikleri</p>
          </div>

          {/* Layers - Deconstructed View */}
          <div className="relative h-96 md:h-[500px] flex flex-col justify-around items-center md:flex-row gap-8 md:gap-4">
            {/* LAYER 1: PHYLLO DOUGH */}
            <motion.div
              custom={0}
              variants={layerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative flex flex-col items-center md:flex-1"
            >
              {/* Thin Gold Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-16" style={{background: 'linear-gradient(to bottom, rgba(251,191,36,0.6), transparent)'}} />
              
              {/* Layer Box - Ultra Minimalist */}
              <div className="relative w-32 h-24 border rounded-sm flex items-center justify-center" style={{borderColor: 'rgba(251, 191, 36, 0.25)', background: 'rgba(180,83,9,0.1)'}}>
                <div className="absolute inset-0 border -m-2 rounded-sm opacity-40" style={{borderColor: 'rgba(251, 191, 36, 0.15)'}} />
                
                <div className="text-center">
                  <Wind size={20} className={`mx-auto mb-2 ${GoldGlow}`} style={{color: 'rgba(251,191,36,0.7)'}} strokeWidth={1} />
                  <p className={`text-xs font-serif uppercase tracking-widest ${MetallicGoldText}`}>Phyllo</p>
                  <p className="text-[10px] mt-1" style={{color: 'rgba(251,191,36,0.5)'}}>0.5mm</p>
                </div>
              </div>
              
              {/* Label */}
              <p className="text-xs mt-6 text-center font-serif">
                <span className="block text-white font-bold mb-1">Yüksek Sıcaklık</span>
                <span className={MetallicGoldText} style={{fontSize: '10px'}}>180°C Kızartma</span>
              </p>
            </motion.div>

            {/* DIVIDER */}
            <div className="hidden md:block w-0.5 h-32" style={{background: 'linear-gradient(to bottom, transparent, rgba(251,191,36,0.4), transparent)'}} />

            {/* LAYER 2: PISTACHIO FILLING */}
            <motion.div
              custom={1}
              variants={layerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative flex flex-col items-center md:flex-1"
            >
              {/* Thin Gold Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-16" style={{background: 'linear-gradient(to bottom, rgba(251,191,36,0.6), transparent)'}} />
              
              {/* Layer Box - Ultra Minimalist */}
              <div className="relative w-32 h-24 border rounded-sm flex items-center justify-center" style={{borderColor: 'rgba(251, 191, 36, 0.25)', background: 'rgba(34,197,94,0.08)'}}>
                <div className="absolute inset-0 border -m-2 rounded-sm opacity-40" style={{borderColor: 'rgba(251, 191, 36, 0.15)'}} />
                
                <div className="text-center">
                  <Leaf size={20} className={`mx-auto mb-2 ${GoldGlow}`} style={{color: 'rgba(251,191,36,0.7)'}} strokeWidth={1} />
                  <p className={`text-xs font-serif uppercase tracking-widest ${MetallicGoldText}`}>Antep</p>
                  <p className="text-[10px] mt-1" style={{color: 'rgba(251,191,36,0.5)'}}>2.0mm</p>
                </div>
              </div>
              
              {/* Label */}
              <p className="text-xs mt-6 text-center font-serif">
                <span className="block text-white font-bold mb-1">Premium Antep</span>
                <span className={MetallicGoldText} style={{fontSize: '10px'}}>%100 Doğal</span>
              </p>
            </motion.div>

            {/* DIVIDER */}
            <div className="hidden md:block w-0.5 h-32" style={{background: 'linear-gradient(to bottom, transparent, rgba(251,191,36,0.4), transparent)'}} />

            {/* LAYER 3: SYRUP */}
            <motion.div
              custom={2}
              variants={layerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative flex flex-col items-center md:flex-1"
            >
              {/* Thin Gold Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-16" style={{background: 'linear-gradient(to bottom, rgba(251,191,36,0.6), transparent)'}} />
              
              {/* Layer Box - Ultra Minimalist */}
              <div className="relative w-32 h-24 border rounded-sm flex items-center justify-center" style={{borderColor: 'rgba(251, 191, 36, 0.25)', background: 'rgba(180,83,9,0.08)'}}>
                <div className="absolute inset-0 border -m-2 rounded-sm opacity-40" style={{borderColor: 'rgba(251, 191, 36, 0.15)'}} />
                
                <div className="text-center">
                  <Droplet size={20} className={`mx-auto mb-2 ${GoldGlow}`} style={{color: 'rgba(251,191,36,0.7)'}} strokeWidth={1} />
                  <p className={`text-xs font-serif uppercase tracking-widest ${MetallicGoldText}`}>Şerbet</p>
                  <p className="text-[10px] mt-1" style={{color: 'rgba(251,191,36,0.5)'}}>60°Brix</p>
                </div>
              </div>
              
              {/* Label */}
              <p className="text-xs mt-6 text-center font-serif">
                <span className="block text-white font-bold mb-1">Soğuk İnjeksiyon</span>
                <span className={MetallicGoldText} style={{fontSize: '10px'}}>4°C Duyarlılık</span>
              </p>
            </motion.div>
          </div>

          {/* Bottom Annotation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16 pt-12" style={{borderTop: '1px solid rgba(251,191,36,0.2)'}}
          >
            <p className="text-xs tracking-wider uppercase font-serif" style={{color: 'rgba(251,191,36,0.5)'}}>
              Katmanlar toplam kalınlık: 2.5mm | Ideal pişirme süresi: 12 dakika
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* SYRUP CHEMISTRY SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-slate-900 to-black rounded-2xl opacity-60 -z-10" />
        
        <div className="relative rounded-2xl border overflow-hidden p-16 md:p-20" style={{borderColor: 'rgba(251, 191, 36, 0.15)'}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Technical Specs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <div className="inline-block px-3 py-1 border rounded text-[10px] uppercase tracking-widest font-serif mb-6" style={{borderColor: 'rgba(251, 191, 36, 0.3)', color: 'rgba(251, 191, 36, 0.6)'}}>
                  Şerbet Formülü
                </div>
                
                <h3 className={`text-3xl font-serif font-bold mb-6 ${MetallicGoldText}`}>
                  Özel Şerbet
                </h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Sucrose Konsantrasyonu', value: '62%' },
                    { label: 'pH Seviyesi', value: '4.2-4.5' },
                    { label: 'Soğutma Hızı', value: '-5°C / dakika' },
                    { label: 'Saklama Süresi', value: '60 gün' },
                  ].map((spec, idx) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between py-3 px-4" style={{borderLeft: '2px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.03)'}}
                    >
                      <span className="text-sm font-serif" style={{color: 'rgba(251,191,36,0.6)'}}>{spec.label}</span>
                      <span className="text-white font-bold text-lg">{spec.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-80 rounded-lg border overflow-hidden flex items-center justify-center" style={{borderColor: 'rgba(251,191,36,0.15)', background: 'rgba(180,83,9,0.08)'}}
            >
              {/* Decorative Syrup Drop */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative"
              >
                <Droplet size={120} className={GoldGlow} style={{color: 'rgba(251,191,36,0.3)'}} strokeWidth={0.5} />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border rounded-full" style={{borderColor: 'rgba(251,191,36,0.2)'}}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CRAFTSMANSHIP SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-slate-900 to-black rounded-2xl opacity-60 -z-10" />
        
        <div className="relative rounded-2xl border overflow-hidden p-16 md:p-20" style={{borderColor: 'rgba(251, 191, 36, 0.15)'}}>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 border rounded mb-6" style={{borderColor: 'rgba(251,191,36,0.3)', color: 'rgba(251,191,36,0.6)'}}>
              <span className="text-xs tracking-widest font-serif uppercase">Usta İşçiliği</span>
            </div>
            <h3 className={`text-4xl font-serif font-bold ${MetallicGoldText}`}>
              4. Nesil Geleneği
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '👨‍🍳', label: '4 Nesil', desc: 'Aile Mirası' },
              { emoji: '⏱️', label: '6+ Saat', desc: 'El İşçiliği' },
              { emoji: '🔬', label: 'Sıfır Katkı', desc: 'Doğal' },
              { emoji: '🌡️', label: '180°C', desc: 'Hassas Kontrol' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center py-6 px-4 border rounded-sm transition-colors" style={{borderColor: 'rgba(251,191,36,0.15)', background: 'rgba(251,191,36,0.03)'}}
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="text-white font-bold text-sm mb-1">{item.label}</p>
                <p className="text-xs font-serif" style={{color: 'rgba(251,191,36,0.5)'}}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
