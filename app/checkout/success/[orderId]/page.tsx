'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { delay: 0.3, type: 'spring', stiffness: 100 },
    },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto"
          >
            {/* Success Icon */}
            <motion.div
              variants={checkmarkVariants}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Sipariş Başarılı!
              </h1>
              <p className="text-xl text-slate-300">
                Teşekkür ederiz! Siparişiniz başarıyla alındı.
              </p>
            </motion.div>

            {/* Order ID Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8"
            >
              <div className="text-center">
                <p className="text-slate-300 text-sm mb-2">Siparişinizin Takip Numarası</p>
                <p className="text-3xl md:text-4xl font-bold text-amber-400 font-mono break-all">
                  {params.orderId}
                </p>
              </div>
            </motion.div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">📧</div>
                <p className="text-slate-300 text-sm">Onay e-postası<br/>gönderilmiştir</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">🚚</div>
                <p className="text-slate-300 text-sm">2-3 iş günü içinde<br/>teslimat</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">📱</div>
                <p className="text-slate-300 text-sm">SMS ile takip<br/>bilgisi gönderilecek</p>
              </motion.div>
            </div>

            {/* Next Steps */}
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-8"
            >
              <h2 className="text-xl font-bold text-white mb-4">Sonraki Adımlar</h2>
              <ol className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-primary-900 font-bold text-sm flex-shrink-0">
                    1
                  </span>
                  <span>E-posta kutunuzu kontrol edin. Siparişinizin detaylarını içeren onay e-postası alacaksınız.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-primary-900 font-bold text-sm flex-shrink-0">
                    2
                  </span>
                  <span>Takip numaranızı not edin. Siparişinizi istediğiniz zaman kontrol edebilirsiniz.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-primary-900 font-bold text-sm flex-shrink-0">
                    3
                  </span>
                  <span>Teslimat günü yaklaşınca SMS ve e-posta ile bilgilendirileceksiniz.</span>
                </li>
              </ol>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/products"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-lg transition-all text-center"
              >
                🛍️ Alışverişe Devam Et
              </Link>
              <Link
                href="/"
                className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-lg transition-all text-center backdrop-blur-lg"
              >
                🏠 Ana Sayfaya Dön
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-white/10 text-center text-slate-400 text-sm"
            >
              <p>
                Sorularınız mı var? <br />
                <Link href="/contact" className="text-amber-400 hover:text-amber-300 font-semibold">
                  İletişim sayfasından bize ulaşın
                </Link>
                {' '}veya <a href="tel:+905551234567" className="text-amber-400 hover:text-amber-300 font-semibold">+90 555 123 45 67</a> numarasını arayın.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
