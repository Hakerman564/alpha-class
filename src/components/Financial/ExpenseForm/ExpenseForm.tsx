import React, { useState, useEffect } from 'react';
import { useFinancial } from '../../../hooks/useFinancial';
import type { Expense } from '../../../types/financial';
import './ExpenseForm.css';

interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
  isEditing?: boolean;
}

export default function ExpenseForm({ expense, onClose, isEditing = false }: ExpenseFormProps) {
  const { addExpense, updateExpense, state } = useFinancial();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'variable' as 'fixed' | 'variable',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    frequency: 'monthly' as 'monthly' | 'weekly' | 'daily',
  });

  useEffect(() => {
    if (expense && isEditing) {
      setFormData({
        name: expense.name,
        amount: expense.amount.toString(),
        type: expense.type as 'fixed' | 'variable',
        category: expense.category,
        date: expense.date,
        description: expense.description || '',
        isRecurring: expense.isRecurring,
        frequency: (expense.frequency || 'monthly') as 'monthly' | 'weekly' | 'daily',
      });
    }
  }, [expense, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      description: formData.description || undefined,
      isRecurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : undefined,
    };

    if (isEditing && expense) {
      updateExpense({ ...expense, ...expenseData });
    } else {
      addExpense(expenseData);
    }

    onClose();
  };

  const expenseCategories = state.categories.filter(cat => cat.type === 'expense');

  return (
    <div className="expense-form-overlay">
      <div className="expense-form-container">
        <div className="expense-form-header">
          <h2>{isEditing ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del Gasto *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Alquiler, Comida, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Monto *</label>
            <div className="amount-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipo de Gasto *</label>
            <div className="type-selector">
              <label className="type-option">
                <input
                  type="radio"
                  name="type"
                  value="fixed"
                  checked={formData.type === 'fixed'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'fixed' | 'variable' })}
                />
                <span className="type-label">
                  <span className="type-icon">🔒</span>
                  Fijo
                </span>
              </label>
              <label className="type-option">
                <input
                  type="radio"
                  name="type"
                  value="variable"
                  checked={formData.type === 'variable'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'fixed' | 'variable' })}
                />
                <span className="type-label">
                  <span className="type-icon">📊</span>
                  Variable
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Selecciona una categoría</option>
              {expenseCategories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha *</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
              <span>Gasto recurrente</span>
            </label>
          </div>

          {formData.isRecurring && (
            <div className="form-group">
              <label htmlFor="frequency">Frecuencia *</label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                required
              >
                <option value="monthly">Mensual</option>
                <option value="weekly">Semanal</option>
                <option value="daily">Diario</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">Descripción (opcional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Agrega detalles adicionales..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {isEditing ? 'Actualizar' : 'Agregar'} Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
