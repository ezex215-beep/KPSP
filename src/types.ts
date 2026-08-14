export type TransactionType = 'income' | 'expense';

export type CategoryColor = 'error' | 'cyan' | 'yellow' | 'green' | 'purple';

export interface CategoryBudget {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  spent: number;
  color: CategoryColor;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
}

export type TabType = 'dashboard' | 'history' | 'budget' | 'settings';

export interface UserProfile {
  name: string;
  userId: string;
  email?: string;
  tagline: string;
  avatarUrl: string;
  isGoogleAuth?: boolean;
  developerName: string;
  developerClass: string;
  developerSchool: string;
  developerAvatarUrl: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
}
