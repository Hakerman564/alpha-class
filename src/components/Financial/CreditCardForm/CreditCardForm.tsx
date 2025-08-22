import React, { useState, useEffect } from 'react';
import { useFinancial } from '../../../hooks/useFinancial';
import type { CreditCard } from '../../../types/financial';
import './CreditCardForm.css';

interface CreditCardFormProps {
  card?: CreditCard | null;
  onClose: () => void;
  isEditing?: boolean;
}

export default function CreditCardForm({ card, onClose, isEditing = false }: CreditCardFormProps) {
  const { addCreditCard, updateCreditCard } = useFinancial();
  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    type: 'credit' as 'credit' | 'debit',
    limit: '',
    currentBalance: '',
    cutOffDate: '15',
    dueDate: '20',
    interestRate: '',
    color: '#3B82F6',
    icon: '💳',
    isActive: true,
    description: '',
  });

  useEffect(() => {
    if (card && isEditing) {
      setFormData({
        name: card.name,
        bank: card.bank,
        type: card.type,
        limit: card.limit.toString(),
        currentBalance: card.currentBalance.toString(),
        cutOffDate: card.cutOffDate.toString(),
        dueDate: card.dueDate.toString(),
        interestRate: card.interestRate.toString(),
        color: card.color,
        icon: card.icon,
        isActive: card.isActive,
        description: card.description || '',
      });
    }
  }, [card, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cardData = {
      name: formData.name,
      bank: formData.bank,
      type: formData.type,
      limit: parseFloat(formData.limit) || 0,
      currentBalance: parseFloat(formData.currentBalance) || 0,
      availableCredit: (parseFloat(formData.limit) || 0) - (parseFloat(formData.currentBalance) || 0),
      cutOffDate: parseInt(formData.cutOffDate),
      dueDate: parseInt(formData.dueDate),
      interestRate: parseFloat(formData.interestRate) || 0,
      color: formData.color,
      icon: formData.icon,
      isActive: formData.isActive,
      description: formData.description || undefined,
    };

    if (isEditing && card) {
      updateCreditCard({ ...card, ...cardData });
    } else {
      addCreditCard(cardData);
    }

    onClose();
  };

  const cardIcons = ['💳', '🏦', '💎', '⭐', '🌟', '🎯', '💎', '🔮', '🎪', '🎨'];

  return (
    <div className="credit-card-form-overlay">
      <div className="credit-card-form-container">
        <div className="credit-card-form-header">
          <h2>{isEditing ? 'Editar Tarjeta' : 'Agregar Nueva Tarjeta'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="credit-card-form">
          <div className="form-group">
            <label htmlFor="name">Nombre de la Tarjeta *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Visa Gold, Mastercard, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bank">Banco *</label>
            <input
              type="text"
              id="bank"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              placeholder="Ej: Banco Santander, BBVA, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipo de Tarjeta *</label>
            <div className="type-selector">
              <label className="type-option">
                <input
                  type="radio"
                  name="type"
                  value="credit"
                  checked={formData.type === 'credit'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'credit' | 'debit' })}
                />
                <span className="type-label">
                  <span className="type-icon">💳</span>
                  Crédito
                </span>
              </label>
              <label className="type-option">
                <input
                  type="radio"
                  name="type"
                  value="debit"
                  checked={formData.type === 'debit'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'credit' | 'debit' })}
                />
                <span className="type-label">
                  <span className="type-icon">🏦</span>
                  Débito
                </span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="limit">Límite de Crédito *</label>
              <div className="amount-input">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="limit"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currentBalance">Saldo Actual *</label>
              <div className="amount-input">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="currentBalance"
                  value={formData.currentBalance}
                  onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {formData.type === 'credit' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cutOffDate">Día de Corte *</label>
                <select
                  id="cutOffDate"
                  value={formData.cutOffDate}
                  onChange={(e) => setFormData({ ...formData, cutOffDate: e.target.value })}
                  required
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Día de Pago *</label>
                <select
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.type === 'credit' && (
            <div className="form-group">
              <label htmlFor="interestRate">Tasa de Interés Anual (%)</label>
              <input
                type="number"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="icon">Icono</label>
            <div className="icon-selector">
              {cardIcons.map(icon => (
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

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span>Tarjeta activa</span>
            </label>
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
              {isEditing ? 'Actualizar' : 'Agregar'} Tarjeta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
