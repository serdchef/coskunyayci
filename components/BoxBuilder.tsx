'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart } from 'lucide-react';

interface BoxItem {
  id: string;
  name: string;
  emoji: string;
  size: number; // 1-3 representing how much space it takes
}

const AVAILABLE_PRODUCTS: BoxItem[] = [
  { id: '1', name: 'Antep Fıstıklı', emoji: '■', size: 1 },
  { id: '2', name: 'Ceviz', emoji: '■', size: 1 },
  { id: '3', name: 'Çikolatalı', emoji: '■', size: 1 },
  { id: '4', name: 'Şerbetli', emoji: '■', size: 2 },
  { id: '5', name: 'Pistacio Mix', emoji: '■', size: 2 },
  { id: '6', name: 'Deluxe Assorti', emoji: '■', size: 3 },
];

const BOX_CAPACITY = 10; // Maximum size units

export default function BoxBuilder() {
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);
  const totalSize = boxItems.reduce((sum, item) => sum + item.size, 0);
  const fillPercentage = (totalSize / BOX_CAPACITY) * 100;
  const isFull = totalSize >= BOX_CAPACITY;
  const isEmpty = boxItems.length === 0;

  const handleAddItem = (product: BoxItem) => {
    if (totalSize + product.size <= BOX_CAPACITY) {
      setBoxItems([...boxItems, { ...product, id: `${product.id}-${Date.now()}` }]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setBoxItems(boxItems.filter((item) => item.id !== id));
  };

  const handleClearBox = () => {
    setBoxItems([]);
  };

  const generateFeedback = () => {
    if (isEmpty) return '📦 Kutuna başka baklavalar ekle...';
    if (fillPercentage < 40) return '✨ Daha 1-2 ürün ekle';
    if (fillPercentage < 70) return '👌 İyi seçimler, biraz daha yer var';
    if (fillPercentage < 100) return '🤩 Harika bir koleksiyon!';
    if (isFull) return '🎉 Kutun mükemmel! Hazırsan sipariş et';
  };

  const boxVariants = {
    empty: { scale: 0.9, opacity: 0.5 },
    filled: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gold-200"
    >
      <h3 className="text-xl font-bold text-primary-900 mb-4">🎁 Kendi Kutunu Yarat</h3>

      {/* BOX VISUAL */}
      <motion.div
        className="relative mb-6 p-6 bg-gradient-to-b from-gold-100 to-cream-100 rounded-xl border-4 border-dashed border-gold-400 min-h-32"
        animate={isEmpty ? 'empty' : 'filled'}
        variants={boxVariants}
      >
        {/* FILL INDICATOR */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b-xl overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-400 to-gold-500"
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* BOX CONTENT */}
        <div className="space-y-3 max-h-32 overflow-y-auto">
          {isEmpty ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm font-semibold">Aşağıdan baklavalar seç</p>
            </div>
          ) : (
            <AnimatePresence>
              {boxItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* FILL PERCENTAGE TEXT */}
        <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 shadow-md">
          <p className="text-xs font-bold text-gold-600">{Math.round(fillPercentage)}%</p>
        </div>
      </motion.div>

      {/* AI FEEDBACK */}
      <motion.div
        className={`mb-4 p-3 rounded-lg text-center font-semibold transition-all ${
          isFull
            ? 'bg-green-100 text-green-700 border border-green-300'
            : fillPercentage > 50
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
        }`}
      >
        {generateFeedback()}
      </motion.div>

      {/* AVAILABLE PRODUCTS */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Ürün Seç</p>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_PRODUCTS.map((product) => {
            const canAdd = totalSize + product.size <= BOX_CAPACITY;
            return (
              <motion.button
                key={product.id}
                onClick={() => handleAddItem(product)}
                disabled={!canAdd}
                className={`p-3 rounded-lg font-semibold transition-all text-sm ${
                  canAdd
                    ? 'bg-gradient-to-r from-gold-100 to-cream-100 hover:from-gold-200 hover:to-cream-200 text-primary-900 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={canAdd ? { scale: 1.05 } : {}}
                whileTap={canAdd ? { scale: 0.95 } : {}}
              >
                <div className="text-lg">{product.emoji}</div>
                <div className="text-xs">{product.name}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <motion.button
          onClick={handleClearBox}
          disabled={isEmpty}
          className="flex-1 bg-red-100 text-red-700 font-semibold py-2 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isEmpty ? { scale: 1.02 } : {}}
          whileTap={!isEmpty ? { scale: 0.98 } : {}}
        >
          ✕ Temizle
        </motion.button>
        <motion.button
          disabled={isEmpty || !isFull}
          className={`flex-1 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 ${
            isFull
              ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={isFull ? { scale: 1.02 } : {}}
          whileTap={isFull ? { scale: 0.98 } : {}}
        >
          <ShoppingCart size={18} />
          Sipariş Et
        </motion.button>
      </div>

      {/* INFO */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Kutu kapasitesi: {totalSize}/{BOX_CAPACITY}
      </p>
    </motion.div>
  );
}
