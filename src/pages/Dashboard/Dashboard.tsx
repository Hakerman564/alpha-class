import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SavingsPlan from '../../components/SavingsPlan/SavingsPlan';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'savings' | 'overview'>('savings');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-container">
          <div className="dashboard-brand">
            <h1 className="brand-title">TrackIt</h1>
            <span className="brand-subtitle">Dashboard</span>
          </div>
          
          <div className="dashboard-user">
            <span className="user-name">Hola, {user?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-tabs">
            <button 
              className={`tab-button ${activeTab === 'savings' ? 'active' : ''}`}
              onClick={() => setActiveTab('savings')}
            >
              📈 Plan de Ahorro
            </button>
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Vista General
            </button>
          </div>
          
          <div className="dashboard-content">
            {activeTab === 'savings' ? (
              <SavingsPlan />
            ) : (
              <div className="progress-card">
                <div className="progress-icon">🚧</div>
                <h2 className="progress-title">Dashboard en Progreso</h2>
                <p className="progress-description">
                  Estamos trabajando en el desarrollo del dashboard principal. 
                  Pronto tendrás acceso a todas las funcionalidades de gestión financiera.
                </p>
                
                <div className="progress-features">
                  <h3>Funcionalidades próximas:</h3>
                  <ul className="features-list">
                    <li>📊 Panel de control financiero</li>
                    <li>💰 Gestión de gastos y presupuestos</li>
                    <li>📈 Gráficos y reportes</li>
                    <li>💳 Gestión de tarjetas</li>
                    <li>🎯 Metas financieras</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
