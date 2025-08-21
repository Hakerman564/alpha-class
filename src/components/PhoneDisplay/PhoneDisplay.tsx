import React, { useState, useEffect } from 'react';
import './PhoneDisplay.css';

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  timestamp: Date;
}

const PhoneDisplay: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance] = useState(2547.89);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Generar transacciones de ejemplo
    const sampleTransactions: Transaction[] = [
      {
        id: 1,
        amount: 1250.00,
        type: 'income',
        description: 'Salario',
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        id: 2,
        amount: -89.50,
        type: 'expense',
        description: 'Supermercado',
        timestamp: new Date(Date.now() - 43200000)
      },
      {
        id: 3,
        amount: -45.00,
        type: 'expense',
        description: 'Gasolina',
        timestamp: new Date(Date.now() - 21600000)
      },
      {
        id: 4,
        amount: 320.00,
        type: 'income',
        description: 'Freelance',
        timestamp: new Date(Date.now() - 10800000)
      }
    ];

    setTransactions(sampleTransactions);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="phone-display"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="phone-frame">
        <div className="phone-screen">
          {/* Header del teléfono */}
          <div className="phone-header">
            <div className="status-bar">
              <span className="time">9:41</span>
              <div className="signal-battery">
                <span className="signal">●●●</span>
                <span className="battery">100%</span>
              </div>
            </div>
          </div>

          {/* Contenido de la app */}
          <div className="app-content">
            <div className="app-header">
              <h2 className="app-title">Finanzas</h2>
              <div className={`balance-display ${isHovered ? 'hovered' : ''}`}>
                <span className="balance-label">Balance</span>
                <span className="balance-amount">{formatCurrency(balance)}</span>
              </div>
            </div>

            {/* Lista de transacciones */}
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${transaction.type} ${isHovered ? 'hovered' : ''}`}
                >
                  <div className="transaction-icon">
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-time">{formatTime(transaction.timestamp)}</span>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de acción */}
            <div className="action-button">
              <span className="button-icon">+</span>
              <span className="button-text">Nueva Transacción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDisplay;
