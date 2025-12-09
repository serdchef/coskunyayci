'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
};

type ChatbotSlot = {
  productSku?: string;
  qty?: number;
  deliveryType?: 'pickup' | 'delivery';
  address?: string;
  phone?: string;
  paymentChoice?: 'cash' | 'link';
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState<ChatbotSlot>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        'Merhaba! 👋 Ben Coşkun Yayçı Baklava dijital asistanıyım. Size nasıl yardımcı olabilirim?\n\n' +
        'Sipariş vermek için ürün seçimi yapabilir veya doğrudan "Fıstıklı baklava istiyorum" gibi söyleyebilirsiniz.'
      );
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'bot',
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addUserMessage(userMessage);
    setIsLoading(true);

    try {
      // API çağrısı - chatbot processing
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          currentSlots: slots,
          conversationHistory: messages.slice(-10).map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Chatbot yanıt vermedi');
      }

      const data = await response.json();

      // Slot'ları güncelle
      if (data.extractedSlots) {
        setSlots(data.extractedSlots);
      }

      // Bot yanıtı
      addBotMessage(data.message);

      // Tüm slotlar doluysa sipariş özetini göster
      if (data.isComplete) {
        showOrderSummary(data.extractedSlots);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      addBotMessage(
        'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin veya manuel sipariş formunu kullanın.'
      );
    } finally {
      setIsLoading(false);
    }
   };

  const showOrderSummary = (completedSlots: ChatbotSlot) => {
    const summary = `
📋 **Sipariş Özeti**

🛍️ Ürün: ${completedSlots.productSku}
📦 Adet: ${completedSlots.qty}
🚚 Teslimat: ${completedSlots.deliveryType === 'delivery' ? 'Adrese Teslimat' : 'Mağazadan Teslim'}
${completedSlots.address ? `📍 Adres: ${completedSlots.address}` : ''}
📞 Telefon: ${completedSlots.phone}
💳 Ödeme: ${completedSlots.paymentChoice === 'cash' ? 'Kapıda Ödeme' : 'Online Ödeme'}

Siparişi onaylıyor musunuz? (Evet/Hayır)
    `;
    addBotMessage(summary);
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    
    try {
      // Sipariş oluştur
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              sku: slots.productSku,
              qty: slots.qty,
            },
          ],
          customer: {
            name: 'Chatbot Müşterisi', // TODO: İsim slot ekle
            phone: slots.phone,
          },
          deliveryType: slots.deliveryType,
          address: slots.address ? {
            street: slots.address,
            district: '',
            city: '',
          } : undefined,
          paymentMethod: slots.paymentChoice,
        }),
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulamadı');
      }

      const data = await response.json();

      addBotMessage(
        `✅ Siparişiniz başarıyla oluşturuldu!\n\n` +
        `Sipariş No: ${data.orderNumber}\n` +
        `Toplam: ${(data.totalCents / 100).toFixed(2)} TL\n\n` +
        (data.paymentLink 
          ? `Ödeme için: ${data.paymentLink}`
          : 'Ödeme kapıda yapılacaktır.')
      );

      toast.success('Sipariş oluşturuldu!');

      // Slot'ları temizle
      setSlots({});

    } catch (error) {
      console.error('Order creation error:', error);
      addBotMessage('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Sipariş oluşturulamadı');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark used to prevent TS 'declared but never read' until UI confirmation hook is added
  useEffect(() => {
    void handleConfirmOrder;
  }, []);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-chatbot-trigger
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        aria-label="Chatbot"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-primary-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Coşkun Yayçı Asistanı</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-800 p-1 rounded transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                      : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                className="flex-1 input"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="btn btn-primary btn-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
