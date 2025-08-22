import React, { useState, useEffect } from 'react';
import { useFinancial } from '../../../hooks/useFinancial';
import type { FinancialGoal } from '../../../types/financial';
import './GoalForm.css';

interface GoalFormProps {
  goal?: FinancialGoal;
  onClose: () => void;
  isEditing?: boolean;
}

export default function GoalForm({ goal, onClose, isEditing = false }: GoalFormProps) {
  const { addFinancialGoal, updateFinancialGoal } = useFinancial();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    category: 'savings' as 'savings' | 'investment' | 'purchase' | 'debt' | 'emergency' | 'vacation' | 'education' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high',
    color: '#3B82F6',
    icon: '🎯',
    monthlyContribution: '',
  });

  useEffect(() => {
    if (goal && isEditing) {
      setFormData({
        name: goal.name,
        description: goal.description,
        targetAmount: goal.targetAmount.toString(),
        startDate: goal.startDate,
        targetDate: goal.targetDate,
        category: goal.category,
        priority: goal.priority,
        color: goal.color,
        icon: goal.icon,
        monthlyContribution: goal.monthlyContribution?.toString() || '',
      });
    }
  }, [goal, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      name: formData.name,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount) || 0,
      currentAmount: 0,
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      category: formData.category,
      priority: formData.priority,
      status: 'active' as 'active' | 'completed' | 'paused' | 'cancelled',
      color: formData.color,
      icon: formData.icon,
      monthlyContribution: parseFloat(formData.monthlyContribution) || undefined,
    };

    if (isEditing && goal) {
      updateFinancialGoal({ ...goal, ...goalData });
    } else {
      addFinancialGoal(goalData);
    }

    onClose();
  };

  const goalIcons = ['🎯', '💰', '🏠', '🚗', '✈️', '🎓', '💍', '🏖️', '📱', '💻', '🏥', '🎮', '📚', '🎨', '🏃‍♂️'];

  const getCategoryInfo = (category: string) => {
    const categories = {
      savings: { name: 'Ahorro', description: 'Meta de ahorro general' },
      investment: { name: 'Inversión', description: 'Invertir en activos' },
      purchase: { name: 'Compra', description: 'Comprar algo específico' },
      debt: { name: 'Deuda', description: 'Pagar deudas' },
      emergency: { name: 'Emergencia', description: 'Fondo de emergencia' },
      vacation: { name: 'Vacaciones', description: 'Viajes y vacaciones' },
      education: { name: 'Educación', description: 'Estudios y cursos' },
      other: { name: 'Otro', description: 'Otras metas' },
    };
    return categories[category as keyof typeof categories] || categories.other;
  };

  const getPriorityInfo = (priority: string) => {
    const priorities = {
      low: { name: 'Baja', color: '#10B981', description: 'No urgente' },
      medium: { name: 'Media', color: '#F59E0B', description: 'Importante' },
      high: { name: 'Alta', color: '#EF4444', description: 'Muy urgente' },
    };
    return priorities[priority as keyof typeof priorities] || priorities.medium;
  };

  return (
    <div className="goal-form-overlay">
      <div className="goal-form-container">
        <div className="goal-form-header">
          <h2>{isEditing ? 'Editar Meta' : 'Crear Nueva Meta Financiera'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-group">
            <label htmlFor="name">Nombre de la Meta *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Comprar una casa, Viajar a Europa, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu meta en detalle..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAmount">Monto Objetivo *</label>
            <div className="amount-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="targetAmount"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Fecha de Inicio *</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetDate">Fecha Objetivo *</label>
              <input
                type="date"
                id="targetDate"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'savings' | 'investment' | 'purchase' | 'debt' | 'emergency' | 'vacation' | 'education' | 'other' })}
              required
            >
              <option value="savings">💰 Ahorro</option>
              <option value="investment">📈 Inversión</option>
              <option value="purchase">🛒 Compra</option>
              <option value="debt">💳 Deuda</option>
              <option value="emergency">🚨 Emergencia</option>
              <option value="vacation">✈️ Vacaciones</option>
              <option value="education">🎓 Educación</option>
              <option value="other">📝 Otro</option>
            </select>
            <div className="category-info">
              <span className="category-name">{getCategoryInfo(formData.category).name}</span>
              <span className="category-description">{getCategoryInfo(formData.category).description}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Prioridad *</label>
            <div className="priority-selector">
              {(['low', 'medium', 'high'] as const).map(priority => (
                <label key={priority} className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  />
                  <span 
                    className="priority-label"
                    style={{ borderColor: getPriorityInfo(priority).color }}
                  >
                    <span className="priority-name">{getPriorityInfo(priority).name}</span>
                    <span className="priority-description">{getPriorityInfo(priority).description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="monthlyContribution">Contribución Mensual (opcional)</label>
            <div className="amount-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <small className="form-help">
              Si defines una contribución mensual, podremos calcular automáticamente cuándo alcanzarás tu meta.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icono</label>
            <div className="icon-selector">
              {goalIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="color"
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {isEditing ? 'Actualizar' : 'Crear'} Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
