import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// AI-Generated Notification Messages
const NOTIFICATION_TEMPLATES: Record<
  string,
  (customerName: string, courierName?: string) => { subject: string; message: string }
> = {
  ORDER_CONFIRMED: (customerName: string) => ({
    subject: '✅ Siparişiniz Onaylandı!',
    message: `Sayın ${customerName}, baklavanız hazırlanmak üzere fırınımıza gönderildi. Şu anda sıcak ve taze kalması için özel bakımı yapılıyor. Siparişinizi canlı olarak takip edebilirsiniz.`,
  }),

  BAKING_STARTED: (customerName: string) => ({
    subject: '🔥 Fırınlanmaya Başladı!',
    message: `Sayın ${customerName}, baklavanız fırında! Mühendislik hassasiyetiyle 180°C'de altın sarısı renk alana kadar pişirilecek. Arıyız, bekleyin!`,
  }),

  READY_FOR_SHIPPING: (customerName: string) => ({
    subject: '✨ Ambalajlanıyor!',
    message: `Sayın ${customerName}, baklavanız hazır! Şu anda özel gıda sınıfı kartonlara, koruma jeleriyle ambalajlanıyor. En kısa zamanda yolcu olacak.`,
  }),

  COURIER_ASSIGNED: (customerName: string, courierName: string = 'Kurye') => ({
    subject: '🚚 Kurye Atandı',
    message: `Sayın ${customerName}, uzman kuryemiz ${courierName} kişisel olarak siparişinizi Gaziantep'ten alıp sizin adresinize iletim hazırlıkları yapıyor.`,
  }),

  OUT_FOR_DELIVERY: (customerName: string, courierName: string = 'Kurye') => ({
    subject: '📍 Yola Çıktık!',
    message: `Sayın ${customerName}, ${courierName} az önce baklavanızı araçla yükledi ve yolda! Haritada gerçek zamanlı konumunu görebilirsiniz. ETA: 45 dakika`,
  }),

  DELIVERED: (customerName: string) => ({
    subject: '🎉 Teslim Edildi!',
    message: `Sayın ${customerName}, baklavanız sevincinize teslim edildi! Tatlı ve lezzetli anları bizimle paylaştığınız için teşekkür ederiz. Geri dönüş için bizi bekleriz.`,
  }),
};

interface NotificationRequest {
  orderId: string;
  type: keyof typeof NOTIFICATION_TEMPLATES;
  customerName: string;
  courierName?: string;
  channels: ('EMAIL' | 'SMS' | 'WHATSAPP')[];
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: NotificationRequest = await req.json();

    // Validate
    if (!data.orderId || !data.type || !data.customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate AI-style message
    const template = NOTIFICATION_TEMPLATES[data.type];
    if (!template) {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    const notification = 
      data.type === 'COURIER_ASSIGNED' || data.type === 'OUT_FOR_DELIVERY'
        ? template(data.customerName, data.courierName || 'Kurye')
        : template(data.customerName);

    // Simulate sending notifications to different channels
    const sentChannels = [];

    // EMAIL
    if (data.channels.includes('EMAIL')) {
      // In production: use Nodemailer or SendGrid
      console.log(`📧 EMAIL: ${notification.subject}`);
      console.log(`   Message: ${notification.message}`);
      sentChannels.push('EMAIL');
    }

    // SMS (Twilio)
    if (data.channels.includes('SMS')) {
      // In production: use Twilio SMS API
      const smsMessage = notification.message.substring(0, 160);
      console.log(`📱 SMS: ${smsMessage}...`);
      sentChannels.push('SMS');
    }

    // WhatsApp (Twilio)
    if (data.channels.includes('WHATSAPP')) {
      // In production: use Twilio WhatsApp API
      console.log(`💬 WhatsApp: ${notification.message}`);
      sentChannels.push('WHATSAPP');
    }

    return NextResponse.json(
      {
        success: true,
        orderId: data.orderId,
        type: data.type,
        subject: notification.subject,
        message: notification.message,
        sentChannels,
        sentAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Bildirim gönderilemedi' },
      { status: 500 }
    );
  }
}

// GET: Fetch notifications for an order
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    // Mock notifications (in production: fetch from database)
    const mockNotifications = [
      {
        id: '1',
        orderId,
        type: 'ORDER_CONFIRMED',
        message: 'Siparişiniz onaylandı',
        sentAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: '2',
        orderId,
        type: 'BAKING_STARTED',
        message: 'Fırınlanmaya başladı',
        sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: '3',
        orderId,
        type: 'OUT_FOR_DELIVERY',
        message: 'Yola çıktı',
        sentAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
      },
    ];

    return NextResponse.json(
      {
        success: true,
        orderId,
        notifications: mockNotifications,
        unreadCount: mockNotifications.filter((n) => !n.read).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { error: 'Bildirimler alınamadı' },
      { status: 500 }
    );
  }
}
