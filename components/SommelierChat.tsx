'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface SommelierChatProps {
  product: {
    name: string;
    pairing: string;
    category: string;
  };
}

interface Message {
  id: string;
  role: 'sommelier' | 'user';
  content: string;
}

const SOMMELIER_QUESTIONS = [
  {
    question: "🎭 Bugün ruh haliniz nasıl?",
    options: [
      { emoji: "😴", label: "Sakin & Dingin", value: "calm" },
      { emoji: "⚡", label: "Dinamik & Enerjik", value: "energetic" },
      { emoji: "🤔", label: "Düşünceli & Nostalji", value: "contemplative" },
    ],
  },
  {
    question: "🍯 Şerbeti nasıl tercih edersiniz?",
    options: [
      { emoji: "🍯", label: "Ağır & Yoğun", value: "heavy" },
      { emoji: "🌊", label: "Orta & Dengeli", value: "balanced" },
      { emoji: "💧", label: "Hafif & Az Şerbetli", value: "light" },
    ],
  },
  {
    question: "☕ Baklava ile ne içersiniz?",
    options: [
      { emoji: "☕", label: "Turk Kahvesi", value: "coffee" },
      { emoji: "🍵", label: "Çay", value: "tea" },
      { emoji: "🥛", label: "Süt İçecekler", value: "milk" },
    ],
  },
];

export default function SommelierChat({ product }: SommelierChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'sommelier',
      content:
        '👋 Merhaba! Ben Baklava Sommelieri. Sana en uygun baklavayı bulmanı yardımcı olmak için buradayım. Başlayalım mı?',
    },
  ]);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});

  const handleOptionClick = (value: string) => {
    const question = SOMMELIER_QUESTIONS[currentQuestion];
    const selectedOption = question.options.find((opt) => opt.value === value);

    if (!selectedOption) return;

    // Add user response to messages
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: selectedOption.label,
      },
    ]);

    // Save response
    setUserResponses((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }));

    // Move to next question or show recommendation
    if (currentQuestion < SOMMELIER_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setMessages((prev) => [
          ...prev,
          {
            id: `sommelier-${Date.now()}`,
            role: 'sommelier',
            content: SOMMELIER_QUESTIONS[currentQuestion + 1].question,
          },
        ]);
      }, 600);
    } else {
      // Show recommendation
      setTimeout(() => {
        const recommendation = generateRecommendation(userResponses);
        setMessages((prev) => [
          ...prev,
          {
            id: `sommelier-final-${Date.now()}`,
            role: 'sommelier',
            content: recommendation,
          },
        ]);
      }, 600);
    }
  };

  const generateRecommendation = (responses: Record<string, string>) => {
    const mood = responses[0];
    const syrup = responses[1];
    const beverage = responses[2];

    if (mood === 'calm' && syrup === 'light' && beverage === 'tea') {
      return `✨ Mükemmel! Sizin için ${product.name} + Nane Çayı eşleşmesi ideal. Sakin bir dakika için mükemmel seçim. 🍵`;
    } else if (mood === 'energetic' && syrup === 'heavy' && beverage === 'coffee') {
      return `⚡ Harika! ${product.name} + Türk Kahvesi kombinasyonu sizi başlatacak. Güçlü tat enerjili ruh haline sempati.`;
    } else if (mood === 'contemplative') {
      return `🤔 Nostaljik anlarınız için ${product.name} + Çay rituali önerilir. Her tadış eski zamanları hatırlatacak. 📖`;
    } else {
      return `🎯 Seçimlerinize göre ${product.name} sizin için tam uygun! Tadını çıkarırken ${product.pairing} öneriyorum.`;
    }
  };

  const resetChat = () => {
    setCurrentQuestion(0);
    setMessages([
      {
        id: '1',
        role: 'sommelier',
        content:
          '👋 Merhaba! Ben Baklava Sommelieri. Sana en uygun baklavayı bulmanı yardımcı olmak için buradayım. Başlayalım mı?',
      },
    ]);
    setUserResponses({});
  };

  const isQuizComplete = currentQuestion === SOMMELIER_QUESTIONS.length - 1 && userResponses[currentQuestion];

  return (
    <>
      {/* FLOATING BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-lg hover:shadow-xl z-40 flex items-center justify-center text-xl font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        title="Baklava Sommelieri"
      >
        {/* Minimal line-art baklava icon */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path d="M8 12 L16 6 L24 12 L22 24 Q16 28 16 28 Q10 28 10 24 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1"/>
          <line x1="14" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </motion.button>

      {/* CHAT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-8 w-96 max-h-96 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 600%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23291f1f;stop-opacity:0.4%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%231a0f0f;stop-opacity:0.6%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23grad)%22 width=%22400%22 height=%22600%22/%3E%3C/svg%3E")',
              backgroundSize: 'cover',
              backdropFilter: 'blur(2px)',
            }}
          >
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-primary-900/40 pointer-events-none rounded-2xl" />
            {/* HEADER */}
            <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white p-4 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-300">
                    <path d="M8 12 L16 6 L24 12 L22 24 Q16 28 16 28 Q10 28 10 24 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1"/>
                    <line x1="14" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">Baklava Sommelieri</p>
                  <p className="text-xs opacity-80">Sana uygun baklava bulma</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:opacity-80 transition"
              >
                ×
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-50 via-cream-50 to-amber-100 relative z-10">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-gold-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* OPTIONS / INPUT */}
            <div className="p-4 border-t border-gold-200 bg-white/95 relative z-10">
              {currentQuestion < SOMMELIER_QUESTIONS.length && !isQuizComplete && (
                <div className="space-y-2">
                  {SOMMELIER_QUESTIONS[currentQuestion].options.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => handleOptionClick(option.value)}
                      className="w-full bg-gradient-to-r from-gold-100 to-cream-100 hover:from-gold-200 hover:to-cream-200 text-primary-900 font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.emoji} {option.label}
                    </motion.button>
                  ))}
                </div>
              )}

              {isQuizComplete && (
                <motion.button
                  onClick={resetChat}
                  className="w-full bg-gradient-to-r from-primary-900 to-primary-800 text-white font-semibold py-2 px-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw size={16} /> Baştan Başla
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
