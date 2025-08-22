import { useState } from 'react';
import { useFinancial } from '../../../hooks/useFinancial';
import type { CreditCard } from '../../../types/financial';
import CreditCardForm from '../CreditCardForm/CreditCardForm';
import './CardsDashboard.css';

export default function CardsDashboard() {
    const { state, deleteCreditCard } = useFinancial();
    const [showCardForm, setShowCardForm] = useState(false);
    const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(2)}%`;
    };

    const handleEditCard = (card: CreditCard) => {
        setEditingCard(card);
        setShowCardForm(true);
    };

    const handleCloseCardForm = () => {
        setShowCardForm(false);
        setEditingCard(null);
    };

    const getUtilizationPercentage = (card: CreditCard) => {
        if (card.limit === 0) return 0;
        return (card.currentBalance / card.limit) * 100;
    };

    const getUtilizationColor = (percentage: number) => {
        if (percentage >= 80) return '#ef4444';
        if (percentage >= 60) return '#f59e0b';
        return '#10b981';
    };

    const getDaysUntilCutOff = (cutOffDate: number) => {
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        let daysUntil = cutOffDate - currentDay;
        if (daysUntil <= 0) {
            daysUntil += daysInMonth;
        }
        return daysUntil;
    };

    const getDaysUntilDue = (dueDate: number) => {
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        let daysUntil = dueDate - currentDay;
        if (daysUntil <= 0) {
            daysUntil += daysInMonth;
        }
        return daysUntil;
    };

    const totalCreditLimit = state.creditCards.reduce((sum, card) => sum + card.limit, 0);
    const totalCurrentBalance = state.creditCards.reduce((sum, card) => sum + card.currentBalance, 0);
    const totalAvailableCredit = Math.max(totalCreditLimit - totalCurrentBalance, 0);
    const overallUtilization = totalCreditLimit > 0 ? (totalCurrentBalance / totalCreditLimit) * 100 : 0;

    return (
        <div className="cards-dashboard">
            <div className="dashboard-header">
                <h1>Gestión de Tarjetas</h1>
                <p>Controla tus tarjetas de crédito y débito</p>
            </div>

            {/* Resumen general */}
            <div className="cards-summary">
                <div className="summary-card">
                    <div className="summary-icon">💳</div>
                    <div className="summary-content">
                        <h3>Total Tarjetas</h3>
                        <p className="summary-number">{state.creditCards.length}</p>
                        <span className="summary-label">tarjetas activas</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">💰</div>
                    <div className="summary-content">
                        <h3>Límite Total</h3>
                        <p className="summary-number">{formatCurrency(totalCreditLimit)}</p>
                        <span className="summary-label">crédito disponible</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">💸</div>
                    <div className="summary-content">
                        <h3>Saldo Actual</h3>
                        <p className="summary-number">{formatCurrency(totalCurrentBalance)}</p>
                        <span className="summary-label">deuda total</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                        <h3>Utilización</h3>
                        <p
                            className="summary-number"
                            style={{ color: getUtilizationColor(overallUtilization) }}
                        >
                            {formatPercentage(overallUtilization)}
                        </p>
                        <span className="summary-label">del límite total</span>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon">✅</div>
                        <div className="summary-content">
                            <h3>Crédito Disponible</h3>
                            <p className="summary-number">
                                {formatCurrency(Math.max(totalAvailableCredit, 0))}
                            </p>
                            <span className="summary-label">límite - saldo</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="content-section">
                    <div className="section-header">
                        <h2>Mis Tarjetas</h2>
                        <button
                            className="add-button"
                            onClick={() => setShowCardForm(true)}
                        >
                            + Agregar Tarjeta
                        </button>
                    </div>

                    <div className="cards-grid">
                        {state.creditCards.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">💳</div>
                                <h3>No hay tarjetas registradas</h3>
                                <p>Comienza agregando tu primera tarjeta para tener un control completo</p>
                                <button
                                    className="add-button"
                                    onClick={() => setShowCardForm(true)}
                                >
                                    Agregar Primera Tarjeta
                                </button>
                            </div>
                        ) : (
                            state.creditCards.map((card: CreditCard) => {
                                const utilization = getUtilizationPercentage(card);
                                const daysUntilCutOff = getDaysUntilCutOff(card.cutOffDate);
                                const daysUntilDue = getDaysUntilDue(card.dueDate);

                                return (
                                    <div key={card.id} className={`card-item ${card.type}`}>
                                        <div className="card-header">
                                            <div className="card-icon" style={{ backgroundColor: card.color }}>
                                                {card.icon}
                                            </div>
                                            <div className="card-actions">
                                                <button
                                                    className="edit-button"
                                                    onClick={() => handleEditCard(card)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => deleteCreditCard(card.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <h3>{card.name}</h3>
                                            <p className="card-bank">{card.bank}</p>

                                            <div className="card-type-badge">
                                                {card.type === 'credit' ? '💳 Crédito' : '🏦 Débito'}
                                            </div>

                                            <div className="card-details">
                                                <div className="detail-row">
                                                    <span className="detail-label">Límite:</span>
                                                    <span className="detail-value">{formatCurrency(card.limit)}</span>
                                                </div>

                                                <div className="detail-row">
                                                    <span className="detail-label">Saldo:</span>
                                                    <span className="detail-value">{formatCurrency(card.currentBalance)}</span>
                                                </div>

                                                <div className="detail-row">
                                                    <span className="detail-label">Disponible:</span>
                                                    <span className="detail-value">{formatCurrency(card.availableCredit)}</span>
                                                </div>

                                                {card.type === 'credit' && (
                                                    <>
                                                        <div className="detail-row">
                                                            <span className="detail-label">Utilización:</span>
                                                            <span
                                                                className="detail-value"
                                                                style={{ color: getUtilizationColor(utilization) }}
                                                            >
                                                                {formatPercentage(utilization)}
                                                            </span>
                                                        </div>

                                                        <div className="detail-row">
                                                            <span className="detail-label">Corte:</span>
                                                            <span className="detail-value">Día {card.cutOffDate} ({daysUntilCutOff} días)</span>
                                                        </div>

                                                        <div className="detail-row">
                                                            <span className="detail-label">Pago:</span>
                                                            <span className="detail-value">Día {card.dueDate} ({daysUntilDue} días)</span>
                                                        </div>

                                                        {card.interestRate > 0 && (
                                                            <div className="detail-row">
                                                                <span className="detail-label">Interés:</span>
                                                                <span className="detail-value">{formatPercentage(card.interestRate)}</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {card.description && (
                                                <p className="card-description">{card.description}</p>
                                            )}

                                            <div className="card-status">
                                                <span className={`status-badge ${card.isActive ? 'active' : 'inactive'}`}>
                                                    {card.isActive ? '✅ Activa' : '❌ Inactiva'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {showCardForm && (
                <CreditCardForm
                    card={editingCard}
                    onClose={handleCloseCardForm}
                    isEditing={!!editingCard}
                />
            )}
        </div>
    );
}
