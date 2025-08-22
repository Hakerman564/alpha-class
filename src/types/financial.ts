export interface Income {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'daily' | 'one-time';
  category: string;
  date: string;
  description?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
  category: string;
  date: string;
  description?: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'weekly' | 'daily';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  fixedExpenses: number;
  variableExpenses: number;
  monthlyBudget: number;
  budgetUtilization: number;
}

export interface FinancialHealth {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

// Nuevas interfaces para tarjetas y metas
export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  type: 'credit' | 'debit';
  limit: number;
  currentBalance: number;
  availableCredit: number;
  cutOffDate: number; // día del mes (1-31)
  dueDate: number; // día del mes (1-31)
  interestRate: number;
  color: string;
  icon: string;
  isActive: boolean;
  description?: string;
}

export interface CardTransaction {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  type: 'purchase' | 'payment' | 'fee' | 'interest';
  date: string;
  category: string;
  installments?: number; // para compras a plazos
  currentInstallment?: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  category: 'savings' | 'investment' | 'purchase' | 'debt' | 'emergency' | 'vacation' | 'education' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  color: string;
  icon: string;
  monthlyContribution?: number;
  progress: number; // 0-100
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  description?: string;
}
