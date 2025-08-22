import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import SavingsPlan from '../../components/SavingsPlan/SavingsPlan';
import FinancialDashboard from '../../components/Financial/FinancialDashboard/FinancialDashboard';
import CardsDashboard from '../../components/Financial/CardsDashboard/CardsDashboard';
import GoalsDashboard from '../../components/Financial/GoalsDashboard/GoalsDashboard';
import FinancialCharts from '../../components/Financial/CardsDashboard/FinancialCharts/FinancialCharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'savings' | 'financial' | 'cards' | 'goals' | 'overview' | 'charts'
  >('financial');

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
              className={`tab-button ${activeTab === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveTab('financial')}
            >
              💰 Control Financiero
            </button>
            <button
              className={`tab-button ${activeTab === 'cards' ? 'active' : ''}`}
              onClick={() => setActiveTab('cards')}
            >
              💳 Tarjetas
            </button>
            <button
              className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              🎯 Metas
            </button>
            <button
              className={`tab-button ${activeTab === 'savings' ? 'active' : ''}`}
              onClick={() => setActiveTab('savings')}
            >
              📈 Plan de Ahorro
            </button>
            <button
              className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              📈 Gráficos
            </button>
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Vista General
            </button>
          </div>

          <div className="dashboard-content">
            {activeTab === 'financial' ? (
              <FinancialDashboard />
            ) : activeTab === 'cards' ? (
              <CardsDashboard />
            ) : activeTab === 'goals' ? (
              <GoalsDashboard />
            ) : activeTab === 'savings' ? (
              <SavingsPlan />
            ) : activeTab === 'charts' ? (
              <FinancialCharts key="charts" />
            ) : (
              <div className="overview-content">
                <h2>Visión General</h2>
                <p>Aquí podrás ver un resumen completo de tus finanzas.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
