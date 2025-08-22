import React, { useState, useEffect } from 'react';
import { useFinancial } from '../../../hooks/useFinancial';
import type { Income } from '../../../types/financial';
import './IncomeForm.css';

interface IncomeFormProps {
  income?: Income;
  onClose: () => void;
  isEditing?: boolean;
}

export default function IncomeForm({ income, onClose, isEditing = false }: IncomeFormProps) {
  const { addIncome, updateIncome, state } = useFinancial();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as 'monthly' | 'weekly' | 'daily' | 'one-time',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    if (income && isEditing) {
      setFormData({
        name: income.name,
        amount: income.amount.toString(),
        frequency: income.frequency as 'monthly' | 'weekly' | 'daily' | 'one-time',
        category: income.category,
        date: income.date,
        description: income.description || '',
      });
    }
  }, [income, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeData = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      category: formData.category,
      date: formData.date,
      description: formData.description || undefined,
    };

    if (isEditing && income) {
      updateIncome({ ...income, ...incomeData });
    } else {
      addIncome(incomeData);
    }

    onClose();
  };

  const incomeCategories = state.categories.filter(cat => cat.type === 'income');

  return (
    <div className="income-form-overlay">
      <div className="income-form-container">
        <div className="income-form-header">
          <h2>{isEditing ? 'Editar Ingreso' : 'Agregar Nuevo Ingreso'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="income-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del Ingreso *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Salario, Freelance, etc."
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
              <option value="one-time">Una vez</option>
            </select>
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
              {incomeCategories.map(category => (
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
              {isEditing ? 'Actualizar' : 'Agregar'} Ingreso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
