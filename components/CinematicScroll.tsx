'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // PARALLAX TRANSFORMS
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const layerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.8 },
    }),
  };

  return (
    <div ref={containerRef} className="space-y-16">
      {/* SECTION 1: EXPLODED VIEW */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-900/5 to-gold-400/5 border border-gold-200"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* BACKGROUND VIDEO PLACEHOLDER */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold-400/10 via-transparent to-gold-500/10" />

          {/* EXPLODED BAKLAVA LAYERS */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* LAYER 1: PHYLLO BASE */}
            <motion.div
              custom={0}
              variants={layerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -80]),
              }}
              className="absolute w-96 h-24 bg-gradient-to-r from-gold-300 to-gold-400 rounded-xl shadow-xl"
            >
              <div className="h-full flex items-center justify-center text-white font-bold text-lg">
                📄 Phyllo Katmanı
              </div>
            </motion.div>

            {/* LAYER 2: PISTACHIO FILLING */}
            <motion.div
              custom={1}
              variants={layerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, 0]),
              }}
              className="absolute w-96 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-xl"
            >
              <div className="h-full flex items-center justify-center text-white font-bold text-lg">
                🥜 Antep Fıstığı Dolgusu
              </div>
            </motion.div>

            {/* LAYER 3: PHYLLO TOP */}
            <motion.div
              custom={2}
              variants={layerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, 80]),
              }}
              className="absolute w-96 h-24 bg-gradient-to-r from-gold-300 to-gold-400 rounded-xl shadow-xl"
            >
              <div className="h-full flex items-center justify-center text-white font-bold text-lg">
                📄 Phyllo Üst Tabaka
              </div>
            </motion.div>
          </div>

          {/* FLOATING PISTACHIO PARTICLES */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + i * 8}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🥜
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA TEXT */}
        <motion.div
          style={{ opacity, y: y1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-white">
            <p className="text-2xl font-bold drop-shadow-lg mb-2">Kaydırarak Katmanları Keşfet</p>
            <p className="text-lg drop-shadow-lg">👇 Aşağı Kaydır</p>
          </div>
        </motion.div>
      </motion.div>

      {/* SECTION 2: SYRUP DETAIL */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
          <motion.div
            style={{
              y: useTransform(scrollYProgress, [0, 1], [40, -40]),
            }}
            className="w-full h-full bg-gradient-to-b from-amber-200 to-amber-600 flex items-center justify-center"
          >
            <div className="text-8xl">🍯</div>
          </motion.div>
        </div>

        <motion.div style={{ y: y2 }} className="space-y-4">
          <h3 className="text-3xl font-bold text-primary-900">✨ Özel Şerbet</h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Gaziantep'in efsanevi şef ustalarının 50+ yıllık deneyiminin sonucu, her damla şerbet mükemmelliğin
            sembolü. Şeker oranı, kaynatma süresi ve soğutma tekniği - her detay hassas bir matematikle kontrol edilir.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <span className="text-gold-500 font-bold">•</span>
              <span>100% doğal şeker ve baldan yapılmış</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold-500 font-bold">•</span>
              <span>Limon ve tarçın aroması mükemmel dengesinde</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold-500 font-bold">•</span>
              <span>Uzun raf ömrü - 60 gün taze kalır</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* SECTION 3: CRAFTSMANSHIP */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-900/10 to-gold-500/10 p-12 border border-gold-200"
      >
        <div className="max-w-2xl">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-primary-900 mb-6"
          >
            🎨 Ustanın Eli
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-700 leading-relaxed mb-8"
          >
            Her baklava, Gaziantep'in dört nesil boyunca kullanılan usta tarafından elle hazırlanır. Makine değil, sadece
            geleneği ve tekniği. Her parçanın şekli, her katmanın kalınlığı - bir senfoninin notaları kadar önemli.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '👨‍🍳', label: '4. Nesil Usta' },
              { emoji: '⏱️', label: '6 Saat İşçilik' },
              { emoji: '🔬', label: '0 Katkı Maddesi' },
              { emoji: '🌡️', label: '180°C Tekniği' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-4 text-center shadow-md"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <p className="font-semibold text-primary-900 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SECTION 4: QUALITY CERTIFICATIONS */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-gold-50 to-cream-100 rounded-2xl p-12 border border-gold-200"
      >
        <h3 className="text-2xl font-bold text-primary-900 mb-8 text-center">✅ Kalite & Sertifikalar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {['TSE Onaylı', 'Helal Belgesi', 'Organik Sertifika', 'ISO 22000'].map((cert, idx) => (
            <motion.div
              key={cert}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-semibold text-primary-900 text-sm">{cert}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
