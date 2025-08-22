import { useState } from 'react';
import { useFinancial } from '../../../hooks/useFinancial';
import FinancialSummary from '../FinancialSummary/FinancialSummary';
import IncomeForm from '../IncomeForm/IncomeForm';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import './FinancialDashboard.css';

export default function FinancialDashboard() {
  const { state, deleteIncome, deleteExpense } = useFinancial();
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditIncome = (income: any) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleCloseIncomeForm = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = state.categories.find(cat => cat.name === categoryName);
    return category?.icon || '📁';
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'Mensual';
      case 'weekly': return 'Semanal';
      case 'daily': return 'Diario';
      case 'one-time': return 'Una vez';
      default: return frequency;
    }
  };

  return (
    <div className="financial-dashboard">
      <div className="dashboard-header">
        <h1>Control de Gastos Personal</h1>
        <p>Gestiona tus ingresos y gastos de manera inteligente</p>
      </div>

      <FinancialSummary />

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Ingresos</h2>
            <button 
              className="add-button income"
              onClick={() => setShowIncomeForm(true)}
            >
              + Agregar Ingreso
            </button>
          </div>
          
          <div className="items-grid">
            {state.incomes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <h3>No hay ingresos registrados</h3>
                <p>Comienza agregando tu primer ingreso para ver tu resumen financiero</p>
                <button 
                  className="add-button income"
                  onClick={() => setShowIncomeForm(true)}
                >
                  Agregar Primer Ingreso
                </button>
              </div>
            ) : (
              state.incomes.map(income => (
                <div key={income.id} className="item-card income">
                  <div className="item-header">
                    <div className="item-icon">{getCategoryIcon(income.category)}</div>
                    <div className="item-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEditIncome(income)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => deleteIncome(income.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="item-content">
                    <h3>{income.name}</h3>
                    <p className="item-amount">{formatCurrency(income.amount)}</p>
                    <div className="item-details">
                      <span className="item-category">{income.category}</span>
                      <span className="item-frequency">{getFrequencyText(income.frequency)}</span>
                    </div>
                    <p className="item-date">{formatDate(income.date)}</p>
                    {income.description && (
                      <p className="item-description">{income.description}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Gastos</h2>
            <button 
              className="add-button expense"
              onClick={() => setShowExpenseForm(true)}
            >
              + Agregar Gasto
            </button>
          </div>
          
          <div className="items-grid">
            {state.expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💸</div>
                <h3>No hay gastos registrados</h3>
                <p>Agrega tus gastos para tener un control completo de tus finanzas</p>
                <button 
                  className="add-button expense"
                  onClick={() => setShowExpenseForm(true)}
                >
                  Agregar Primer Gasto
                </button>
              </div>
            ) : (
              state.expenses.map(expense => (
                <div key={expense.id} className={`item-card expense ${expense.type}`}>
                  <div className="item-header">
                    <div className="item-icon">{getCategoryIcon(expense.category)}</div>
                    <div className="expense-type-badge">
                      {expense.type === 'fixed' ? '🔒 Fijo' : '📊 Variable'}
                    </div>
                    <div className="item-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEditExpense(expense)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="item-content">
                    <h3>{expense.name}</h3>
                    <p className="item-amount">{formatCurrency(expense.amount)}</p>
                    <div className="item-details">
                      <span className="item-category">{expense.category}</span>
                      {expense.isRecurring && (
                        <span className="item-frequency">{getFrequencyText(expense.frequency || 'monthly')}</span>
                      )}
                    </div>
                    <p className="item-date">{formatDate(expense.date)}</p>
                    {expense.description && (
                      <p className="item-description">{expense.description}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showIncomeForm && (
        <IncomeForm
          income={editingIncome}
          onClose={handleCloseIncomeForm}
          isEditing={!!editingIncome}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={handleCloseExpenseForm}
          isEditing={!!editingExpense}
        />
      )}
    </div>
  );
}
