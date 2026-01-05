export type UserRole = 'admin' | 'client' | 'freelance';

export type ServiceCategory = 
  | 'web_development' | 'mobile_development' | 'design' | 'writing'
  | 'marketing' | 'video_editing' | 'translation' | 'consulting'
  | 'data_analysis' | 'photography' | 'music' | 'other';

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

export type PaymentMethod = 'mobile_money' | 'card' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'refunded';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  photo?: string;
  languages?: string[];
  created_at: string;
  rating?: number;
  total_reviews?: number;
  total_sales?: number;
}

export interface FreelanceService {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  delivery_days: number;
  category: ServiceCategory;
  images: string[];
  status: 'draft' | 'active' | 'paused' | 'rejected';
  created_at: string;
  user?: User;
  total_orders?: number;
  rating?: number;
}

export interface DigitalProduct {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  file_url?: string;
  preview_images: string[];
  category: string;
  status: 'draft' | 'active' | 'paused';
  created_at: string;
  downloads?: number;
  user?: User;
}

export interface Order {
  id: string;
  client_id: string;
  freelance_id: string;
  service_id?: string;
  product_id?: string;
  status: OrderStatus;
  amount: number;
  commission: number;
  payment_status: PaymentStatus;
  paid_amount: number;
  delivery_date?: string;
  created_at: string;
  client?: User;
  freelance?: User;
  service?: FreelanceService;
  product?: DigitalProduct;
}

export interface Transaction {
  id: string;
  order_id: string;
  amount: number;
  commission: number;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
  order?: Order;
}

export interface Review {
  id: string;
  freelance_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  order_id?: string;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: string;
  user: User;
  last_message: Message;
  unread_count: number;
}

export interface FreelanceStats {
  total_sales: number;
  total_revenue: number;
  active_orders: number;
  completed_orders: number;
  average_rating: number;
  total_reviews: number;
  pending_withdrawals: number;
  available_balance: number;
}
