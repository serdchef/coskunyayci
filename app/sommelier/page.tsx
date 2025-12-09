'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Question {
  id: number;
  question: string;
  answers: { text: string; value: string }[];
}

interface Recommendation {
  productName: string;
  reason: string;
  price: number;
  image: string;
  bestFor: string;
  flavor: string;
  pairing: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Baklava tadı konusunda tercihiz nedir?',
    answers: [
      { text: '🌰 Fıstıkçı / Cevizli', value: 'nutty' },
      { text: '🍫 Çikolatacı', value: 'chocolate' },
      { text: '🍯 Şerbetli / Tatlı', value: 'sweet' },
      { text: '🎨 Yöresel / Deneysel', value: 'regional' },
    ],
  },
  {
    id: 2,
    question: 'Baklava dokusu konusunda ne istersiniz?',
    answers: [
      { text: '✨ Çıtır & Kırılgan', value: 'crispy' },
      { text: '🧈 Yumuşak & Yağlı', value: 'buttery' },
      { text: '⚖️ Dengeli (Orta)', value: 'balanced' },
      { text: '🎭 Sürprizli (Karışık)', value: 'mixed' },
    ],
  },
  {
    id: 3,
    question: 'Hangi durum için baklava arıyorsunuz?',
    answers: [
      { text: '☕ Çay saati / Öğle molası', value: 'teatime' },
      { text: '🎁 Hediye / Özel gün', value: 'gift' },
      { text: '🏢 Kurumsal / Toplu sipariş', value: 'corporate' },
      { text: '👨‍👩‍👧‍👦 Aile / Paylaşım', value: 'sharing' },
    ],
  },
  {
    id: 4,
    question: 'Bütçe tarafından ne kadar harcamak istersiniz?',
    answers: [
      { text: '💰 Ekonomik (250g, <₺30)', value: 'budget' },
      { text: '💵 Orta seviye (500g, ₺30-60)', value: 'mid' },
      { text: '💎 Premium (1kg, ₺60-100)', value: 'premium' },
      { text: '👑 Lüks (Özel set, ₺100+)', value: 'luxury' },
    ],
  },
  {
    id: 5,
    question: 'Baklava kendiniz mi tüketeceksiniz?',
    answers: [
      { text: '👤 Sadece kendim', value: 'solo' },
      { text: '👥 2-3 kişi ile', value: 'small_group' },
      { text: '👨‍👩‍👧‍👦 4+ kişi ile', value: 'large_group' },
      { text: '🏪 Satış / Resepsiyon', value: 'resale' },
    ],
  },
];

export default function SommelierPage() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz bitmiş, tavsiye al
      getRecommendation(newAnswers);
    }
  };

  const getRecommendation = (quizAnswers: string[]) => {
    const recommendations: { [key: string]: Recommendation } = {
      nutty_crispy_teatime_mid_solo: {
        productName: 'Antep Fıstıklı Klasik Baklava',
        reason: 'Çıtır, fıstıklı ve çay ile mükemmel uyum sağlar.',
        price: 350,
        image: '🌰',
        bestFor: 'Çay saatleri ve hafif atıştırmalıklar',
        flavor: 'Yoğun Antep fıstığı, hafif şerbet',
        pairing: 'Siyah çay, Türk kahvesi, maden suyu',
      },
      chocolate_buttery_gift_premium_small_group: {
        productName: 'Belçika Çikolatalı Baklava',
        reason: 'Yumşak, çikolatacı ve hediye için ideal.',
        price: 450,
        image: '🍫',
        bestFor: 'Hediyeler ve özel anlar',
        flavor: 'Belçika çikolatası, hafif şerbet',
        pairing: 'Kahve, sıcak çikolata, şarap',
      },
      sweet_mixed_sharing_premium_large_group: {
        productName: 'Özel Karışık Baklava Seti',
        reason: 'Herkese hitap eden çeşitli tatlar.',
        price: 75,
        image: '🎨',
        bestFor: 'Ailelere ve paylaşım anları',
        flavor: 'Fıstık, çikolata, ceviz karışımı',
        pairing: 'Çay, kahve, her içecek',
      },
      regional_balanced_corporate_luxury_resale: {
        productName: 'Kurumsal VIP Koleksiyonu',
        reason: 'Profesyonel sunumla maksimum etki.',
        price: 3500,
        image: '👑',
        bestFor: 'Kurumsal hediyeler ve toplantılar',
        flavor: 'Premium seçkin baklavalar',
        pairing: 'Espresso, İtalyan kahvesi, champagne',
      },
      nutty_buttery_gift_budget_small_group: {
        productName: 'Premium Antep Fıstıklı',
        reason: 'Ekonomik fiyat, premium kalitenin hafif kaybı yok.',
        price: 420,
        image: '🌰',
        bestFor: 'Ufak hediyeler ve kişisel kullanım',
        flavor: 'Yoğun Antep fıstığı, dengeli şerbet',
        pairing: 'Çay, kahve, ev yapımı limonata',
      },
    };

    // Basit bir eşleştirme algoritması
    const key = quizAnswers.join('_');
    const exactMatch = recommendations[key];

    if (exactMatch) {
      setRecommendation(exactMatch);
    } else {
      // Fallback recommendation
      setRecommendation({
        productName: 'Antep Fıstıklı Klasik Baklava',
        reason: 'En çok sevilen ve dengeli baklava seçimi.',
        price: 350,
        image: '🌰',
        bestFor: 'Herkes için ideal',
        flavor: 'Antep fıstığı, klasik şerbet',
        pairing: 'Çay, kahve',
      });
    }

    setStep('result');
  };

  const resetQuiz = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setRecommendation(null);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* INTRO STEP */}
          {step === 'intro' && (
            <div className="text-center">
              <div className="text-8xl mb-6">🍰</div>
              <h1 className="text-5xl font-bold text-amber-900 mb-4">
                Baklava Sommeliery
              </h1>
              <p className="text-xl text-amber-700 mb-6 max-w-lg mx-auto">
                Coşkun Yaycı'nın AI destekli baklava tavsiye sistemi. Sadece 5 soruda sizin için perfect baklava bulun.
              </p>
              <button
                onClick={() => setStep('quiz')}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition text-lg shadow-lg"
              >
                Quiz'e Başla →
              </button>

              {/* Info Cards */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-sm text-amber-900 font-semibold">Kişiselleştirilmiş</p>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="text-sm text-amber-900 font-semibold">30 saniye</p>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-sm text-amber-900 font-semibold">Garantili Doğru</p>
                </div>
              </div>
            </div>
          )}

          {/* QUIZ STEP */}
          {step === 'quiz' && (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-amber-900">
                    Soru {currentQuestion + 1} / {QUESTIONS.length}
                  </span>
                  <span className="text-sm font-bold text-amber-600">
                    {Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-bold text-amber-900 mb-8">
                {QUESTIONS[currentQuestion].question}
              </h2>

              {/* Answers */}
              <div className="space-y-3">
                {QUESTIONS[currentQuestion].answers.map((answer) => (
                  <button
                    key={answer.value}
                    onClick={() => handleAnswer(answer.value)}
                    className="w-full p-4 text-left bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 rounded-lg transition font-semibold text-amber-900"
                  >
                    {answer.text}
                  </button>
                ))}
              </div>

              {/* Back Button */}
              {currentQuestion > 0 && (
                <button
                  onClick={() => {
                    setCurrentQuestion(currentQuestion - 1);
                    setAnswers(answers.slice(0, -1));
                  }}
                  className="mt-6 w-full py-2 text-amber-700 hover:text-amber-900 font-semibold border-2 border-amber-300 rounded-lg hover:bg-amber-100 transition"
                >
                  ← Geri Git
                </button>
              )}
            </div>
          )}

          {/* RESULT STEP */}
          {step === 'result' && recommendation && (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="text-7xl mb-4">{recommendation.image}</div>
                <h2 className="text-4xl font-bold text-amber-900 mb-2">
                  {recommendation.productName}
                </h2>
                <p className="text-lg text-amber-700 mb-6">{recommendation.reason}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 font-semibold mb-1">En İyi Kullanım</p>
                  <p className="text-amber-900 font-bold">{recommendation.bestFor}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 font-semibold mb-1">Fiyat (250g)</p>
                  <p className="text-amber-900 font-bold">₺{recommendation.price}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 font-semibold mb-1">Tatları</p>
                  <p className="text-amber-900 font-bold">{recommendation.flavor}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 font-semibold mb-1">Eşleşmeler</p>
                  <p className="text-amber-900 font-bold">{recommendation.pairing}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-lg hover:from-amber-700 hover:to-orange-700 transition">
                  Sepete Ekle
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full px-8 py-4 bg-amber-100 text-amber-900 font-bold rounded-lg hover:bg-amber-200 transition"
                >
                  Başka Soru Sor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
