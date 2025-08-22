import React, { createContext, useReducer, useEffect } from 'react';
import type { Income, Expense, FinancialSummary, FinancialHealth, Category, CreditCard, CardTransaction, FinancialGoal, GoalContribution } from '../types/financial';

interface FinancialState {
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
  summary: FinancialSummary;
  health: FinancialHealth;
  creditCards: CreditCard[];
  cardTransactions: CardTransaction[];
  financialGoals: FinancialGoal[];
  goalContributions: GoalContribution[];
}

type FinancialAction =
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'UPDATE_INCOME'; payload: Income }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_SUMMARY'; payload: FinancialSummary }
  | { type: 'UPDATE_HEALTH'; payload: FinancialHealth }
  | { type: 'ADD_CREDIT_CARD'; payload: CreditCard }
  | { type: 'UPDATE_CREDIT_CARD'; payload: CreditCard }
  | { type: 'DELETE_CREDIT_CARD'; payload: string }
  | { type: 'ADD_CARD_TRANSACTION'; payload: CardTransaction }
  | { type: 'UPDATE_CARD_TRANSACTION'; payload: CardTransaction }
  | { type: 'DELETE_CARD_TRANSACTION'; payload: string }
  | { type: 'ADD_FINANCIAL_GOAL'; payload: FinancialGoal }
  | { type: 'UPDATE_FINANCIAL_GOAL'; payload: FinancialGoal }
  | { type: 'DELETE_FINANCIAL_GOAL'; payload: string }
  | { type: 'ADD_GOAL_CONTRIBUTION'; payload: GoalContribution }
  | { type: 'UPDATE_GOAL_CONTRIBUTION'; payload: GoalContribution }
  | { type: 'DELETE_GOAL_CONTRIBUTION'; payload: string };

const initialState: FinancialState = {
  incomes: [],
  expenses: [],
  categories: [
    { id: '1', name: 'Salario', type: 'income', color: '#10B981', icon: '💰' },
    { id: '2', name: 'Freelance', type: 'income', color: '#3B82F6', icon: '💼' },
    { id: '3', name: 'Inversiones', type: 'income', color: '#8B5CF6', icon: '📈' },
    { id: '4', name: 'Vivienda', type: 'expense', color: '#EF4444', icon: '🏠' },
    { id: '5', name: 'Alimentación', type: 'expense', color: '#F59E0B', icon: '🍽️' },
    { id: '6', name: 'Transporte', type: 'expense', color: '#06B6D4', icon: '🚗' },
    { id: '7', name: 'Entretenimiento', type: 'expense', color: '#EC4899', icon: '🎮' },
    { id: '8', name: 'Salud', type: 'expense', color: '#84CC16', icon: '🏥' },
  ],
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    savingsRate: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    monthlyBudget: 0,
    budgetUtilization: 0,
  },
  health: {
    score: 0,
    status: 'poor',
    recommendations: [],
  },
  creditCards: [],
  cardTransactions: [],
  financialGoals: [],
  goalContributions: [],
};

function financialReducer(state: FinancialState, action: FinancialAction): FinancialState {
  switch (action.type) {
    case 'ADD_INCOME':
      return {
        ...state,
        incomes: [...state.incomes, action.payload],
      };
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map(income =>
          income.id === action.payload.id ? action.payload : income
        ),
      };
    case 'DELETE_INCOME':
      return {
        ...state,
        incomes: state.incomes.filter(income => income.id !== action.payload),
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_SUMMARY':
      return {
        ...state,
        summary: action.payload,
      };
    case 'UPDATE_HEALTH':
      return {
        ...state,
        health: action.payload,
      };
    case 'ADD_CREDIT_CARD':
      return {
        ...state,
        creditCards: [...state.creditCards, action.payload],
      };
    case 'UPDATE_CREDIT_CARD':
      return {
        ...state,
        creditCards: state.creditCards.map(card =>
          card.id === action.payload.id ? action.payload : card
        ),
      };
    case 'DELETE_CREDIT_CARD':
      return {
        ...state,
        creditCards: state.creditCards.filter(card => card.id !== action.payload),
        cardTransactions: state.cardTransactions.filter(transaction => transaction.cardId !== action.payload),
      };
    case 'ADD_CARD_TRANSACTION':
      return {
        ...state,
        cardTransactions: [...state.cardTransactions, action.payload],
      };
    case 'UPDATE_CARD_TRANSACTION':
      return {
        ...state,
        cardTransactions: state.cardTransactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'DELETE_CARD_TRANSACTION':
      return {
        ...state,
        cardTransactions: state.cardTransactions.filter(transaction => transaction.id !== action.payload),
      };
    case 'ADD_FINANCIAL_GOAL':
      return {
        ...state,
        financialGoals: [...state.financialGoals, action.payload],
      };
    case 'UPDATE_FINANCIAL_GOAL':
      return {
        ...state,
        financialGoals: state.financialGoals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };
    case 'DELETE_FINANCIAL_GOAL':
      return {
        ...state,
        financialGoals: state.financialGoals.filter(goal => goal.id !== action.payload),
        goalContributions: state.goalContributions.filter(contribution => contribution.goalId !== action.payload),
      };
    case 'ADD_GOAL_CONTRIBUTION':
      return {
        ...state,
        goalContributions: [...state.goalContributions, action.payload],
      };
    case 'UPDATE_GOAL_CONTRIBUTION':
      return {
        ...state,
        goalContributions: state.goalContributions.map(contribution =>
          contribution.id === action.payload.id ? action.payload : contribution
        ),
      };
    case 'DELETE_GOAL_CONTRIBUTION':
      return {
        ...state,
        goalContributions: state.goalContributions.filter(contribution => contribution.id !== action.payload),
      };
    default:
      return state;
  }
}

interface FinancialContextType {
  state: FinancialState;
  dispatch: React.Dispatch<FinancialAction>;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  calculateSummary: () => void;
  calculateHealth: () => void;
  // Tarjetas
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (card: CreditCard) => void;
  deleteCreditCard: (id: string) => void;
  addCardTransaction: (transaction: Omit<CardTransaction, 'id'>) => void;
  updateCardTransaction: (transaction: CardTransaction) => void;
  deleteCardTransaction: (id: string) => void;
  // Metas
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id' | 'progress'>) => void;
  updateFinancialGoal: (goal: FinancialGoal) => void;
  deleteFinancialGoal: (id: string) => void;
  addGoalContribution: (contribution: Omit<GoalContribution, 'id'>) => void;
  updateGoalContribution: (contribution: GoalContribution) => void;
  deleteGoalContribution: (id: string) => void;
  calculateGoalProgress: (goalId: string) => void;
}

export const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_INCOME', payload: newIncome });
  };

  const updateIncome = (income: Income) => {
    dispatch({ type: 'UPDATE_INCOME', payload: income });
  };

  const deleteIncome = (id: string) => {
    dispatch({ type: 'DELETE_INCOME', payload: id });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
  };

  const updateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const calculateSummary = () => {
    const totalIncome = state.incomes.reduce((sum, income) => {
      if (income.frequency === 'monthly') return sum + income.amount;
      if (income.frequency === 'weekly') return sum + (income.amount * 4.33);
      if (income.frequency === 'daily') return sum + (income.amount * 30);
      return sum + income.amount;
    }, 0);

    const totalExpenses = state.expenses.reduce((sum, expense) => {
      if (expense.isRecurring && expense.frequency === 'monthly') return sum + expense.amount;
      if (expense.isRecurring && expense.frequency === 'weekly') return sum + (expense.amount * 4.33);
      if (expense.isRecurring && expense.frequency === 'daily') return sum + (expense.amount * 30);
      return sum + expense.amount;
    }, 0);

    const fixedExpenses = state.expenses
      .filter(expense => expense.type === 'fixed')
      .reduce((sum, expense) => {
        if (expense.isRecurring && expense.frequency === 'monthly') return sum + expense.amount;
        if (expense.isRecurring && expense.frequency === 'weekly') return sum + (expense.amount * 4.33);
        if (expense.isRecurring && expense.frequency === 'daily') return sum + (expense.amount * 30);
        return sum + expense.amount;
      }, 0);

    const variableExpenses = state.expenses
      .filter(expense => expense.type === 'variable')
      .reduce((sum, expense) => {
        if (expense.isRecurring && expense.frequency === 'monthly') return sum + expense.amount;
        if (expense.isRecurring && expense.frequency === 'weekly') return sum + (expense.amount * 4.33);
        if (expense.isRecurring && expense.frequency === 'daily') return sum + (expense.amount * 30);
        return sum + expense.amount;
      }, 0);

    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    const monthlyBudget = totalIncome * 0.8; // 80% del ingreso como presupuesto
    const budgetUtilization = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

    const summary: FinancialSummary = {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      fixedExpenses,
      variableExpenses,
      monthlyBudget,
      budgetUtilization,
    };

    dispatch({ type: 'UPDATE_SUMMARY', payload: summary });
  };

  const calculateHealth = () => {
    const { summary } = state;
    let score = 0;
    const recommendations: string[] = [];

    // Evaluar tasa de ahorro
    if (summary.savingsRate >= 20) {
      score += 30;
    } else if (summary.savingsRate >= 10) {
      score += 20;
      recommendations.push('Intenta ahorrar al menos el 20% de tus ingresos');
    } else if (summary.savingsRate >= 5) {
      score += 10;
      recommendations.push('Tu tasa de ahorro es baja, considera reducir gastos');
    } else {
      recommendations.push('Urgente: Necesitas aumentar tu tasa de ahorro');
    }

    // Evaluar utilización del presupuesto
    if (summary.budgetUtilization <= 80) {
      score += 25;
    } else if (summary.budgetUtilization <= 100) {
      score += 15;
      recommendations.push('Estás cerca de exceder tu presupuesto mensual');
    } else {
      score += 5;
      recommendations.push('Estás excediendo tu presupuesto mensual');
    }

    // Evaluar balance entre gastos fijos y variables
    const fixedRatio = summary.totalExpenses > 0 ? summary.fixedExpenses / summary.totalExpenses : 0;
    if (fixedRatio <= 0.6) {
      score += 25;
    } else if (fixedRatio <= 0.8) {
      score += 15;
      recommendations.push('Considera reducir tus gastos fijos');
    } else {
      score += 5;
      recommendations.push('Tus gastos fijos son muy altos');
    }

    // Evaluar ingreso neto
    if (summary.netIncome > 0) {
      score += 20;
    } else {
      recommendations.push('Tus gastos superan tus ingresos');
    }

    let status: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 80) status = 'excellent';
    else if (score >= 60) status = 'good';
    else if (score >= 40) status = 'fair';
    else status = 'poor';

    const health: FinancialHealth = {
      score,
      status,
      recommendations,
    };

    dispatch({ type: 'UPDATE_HEALTH', payload: health });
  };

  // Funciones para tarjetas
  const addCreditCard = (card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = {
      ...card,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CREDIT_CARD', payload: newCard });
  };

  const updateCreditCard = (card: CreditCard) => {
    dispatch({ type: 'UPDATE_CREDIT_CARD', payload: card });
  };

  const deleteCreditCard = (id: string) => {
    dispatch({ type: 'DELETE_CREDIT_CARD', payload: id });
  };

  const addCardTransaction = (transaction: Omit<CardTransaction, 'id'>) => {
    const newTransaction: CardTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CARD_TRANSACTION', payload: newTransaction });
  };

  const updateCardTransaction = (transaction: CardTransaction) => {
    dispatch({ type: 'UPDATE_CARD_TRANSACTION', payload: transaction });
  };

  const deleteCardTransaction = (id: string) => {
    dispatch({ type: 'DELETE_CARD_TRANSACTION', payload: id });
  };

  // Funciones para metas
  const addFinancialGoal = (goal: Omit<FinancialGoal, 'id' | 'progress'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      progress: 0,
    };
    dispatch({ type: 'ADD_FINANCIAL_GOAL', payload: newGoal });
  };

  const updateFinancialGoal = (goal: FinancialGoal) => {
    dispatch({ type: 'UPDATE_FINANCIAL_GOAL', payload: goal });
  };

  const deleteFinancialGoal = (id: string) => {
    dispatch({ type: 'DELETE_FINANCIAL_GOAL', payload: id });
  };

  const addGoalContribution = (contribution: Omit<GoalContribution, 'id'>) => {
    const newContribution: GoalContribution = {
      ...contribution,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_GOAL_CONTRIBUTION', payload: newContribution });
  };

  const updateGoalContribution = (contribution: GoalContribution) => {
    dispatch({ type: 'UPDATE_GOAL_CONTRIBUTION', payload: contribution });
  };

  const deleteGoalContribution = (id: string) => {
    dispatch({ type: 'DELETE_GOAL_CONTRIBUTION', payload: id });
  };

  const calculateGoalProgress = (goalId: string) => {
    const goal = state.financialGoals.find(g => g.id === goalId);
    if (!goal) return;

    const totalContributions = state.goalContributions
      .filter(c => c.goalId === goalId)
      .reduce((sum, c) => sum + c.amount, 0);

    const progress = Math.min((totalContributions / goal.targetAmount) * 100, 100);

    const updatedGoal: FinancialGoal = {
      ...goal,
      currentAmount: totalContributions,
      progress,
      status: progress >= 100 ? 'completed' : goal.status,
    };

    dispatch({ type: 'UPDATE_FINANCIAL_GOAL', payload: updatedGoal });
  };

  useEffect(() => {
    calculateSummary();
  }, [state.incomes, state.expenses]);

  useEffect(() => {
    calculateHealth();
  }, [state.summary]);

  const value: FinancialContextType = {
    state,
    dispatch,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    calculateSummary,
    calculateHealth,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addCardTransaction,
    updateCardTransaction,
    deleteCardTransaction,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    addGoalContribution,
    updateGoalContribution,
    deleteGoalContribution,
    calculateGoalProgress,
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
}


