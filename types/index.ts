/**
 * Global TypeScript Type Definitions
 */

/**
 * Type definitions
 */

// Database models (stub - not connected to Prisma client)
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  locale: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  priceCents: number;
  weightGr: number;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  totalPriceCents: number;
  shippingAddressJson: string;
  itemsJson: string;
  deliveryType: DeliveryType;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoJob {
  id: string;
  videoUrl: string;
  status: VideoJobStatus;
  provider: VideoProvider;
  outputUrl?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  CASH = 'CASH',
}

export enum DeliveryType {
  PICKUP = 'PICKUP',
  COURIER = 'COURIER',
}

export enum VideoProvider {
  AZURE = 'AZURE',
  AWS = 'AWS',
}

export enum VideoJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// ============================================================================
// API Response Types
// ============================================================================

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

// ============================================================================
// Order Types
// ============================================================================

export type OrderItem = {
  sku: string;
  name: string;
  qty: number;
  priceCents: number;
  options?: Record<string, any>;
};

export type OrderAddress = {
  street: string;
  district: string;
  city: string;
  postalCode?: string;
  notes?: string;
};

export type OrderWithRelations = Order & {
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone'> | null;
};

// ============================================================================
// Product Types
// ============================================================================

export type ProductWithStock = Product & {
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
};

// ============================================================================
// Video Job Types
// ============================================================================

export type VideoJobWithStatus = VideoJob & {
  progress?: number;
  estimatedTime?: number;
};

// ============================================================================
// Chatbot Types
// ============================================================================

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export type ChatbotSlots = {
  productSku?: string;
  qty?: number;
  deliveryType?: 'pickup' | 'delivery';
  address?: string;
  phone?: string;
  paymentChoice?: 'cash' | 'link';
};

// ============================================================================
// Analytics Types
// ============================================================================

export type AnalyticsEventData = {
  eventName: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
};

// ============================================================================
// Form Types
// ============================================================================

export type LoginForm = {
  email: string;
  password: string;
};

export type OrderForm = {
  items: Array<{
    sku: string;
    qty: number;
  }>;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  deliveryType: 'pickup' | 'delivery';
  address?: OrderAddress;
  paymentMethod: 'cash' | 'link' | 'bank_transfer';
  couponCode?: string;
  notes?: string;
};

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
