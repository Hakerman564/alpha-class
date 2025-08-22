import { useState } from 'react';
import { useFinancial } from '../../../hooks/useFinancial';
import GoalForm from '../GoalForm/GoalForm';
import './GoalsDashboard.css';

export default function GoalsDashboard() {
  const { state, deleteFinancialGoal } = useFinancial();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleCloseGoalForm = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusInfo = (status: string) => {
    const statuses = {
      active: { name: 'Activa', icon: '🟢', color: '#10B981' },
      completed: { name: 'Completada', icon: '✅', color: '#059669' },
      paused: { name: 'Pausada', icon: '⏸️', color: '#F59E0B' },
      cancelled: { name: 'Cancelada', icon: '❌', color: '#EF4444' },
    };
    return statuses[status as keyof typeof statuses] || statuses.active;
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#F59E0B';
    if (progress >= 40) return '#F97316';
    return '#EF4444';
  };

  const totalGoals = state.financialGoals.length;
  const activeGoals = state.financialGoals.filter(goal => goal.status === 'active').length;
  const completedGoals = state.financialGoals.filter(goal => goal.status === 'completed').length;
  const totalTargetAmount = state.financialGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = state.financialGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="goals-dashboard">
      <div className="dashboard-header">
        <h1>Metas Financieras</h1>
        <p>Define y alcanza tus objetivos financieros</p>
      </div>

      {/* Resumen general */}
      <div className="goals-summary">
        <div className="summary-card">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <h3>Total Metas</h3>
            <p className="summary-number">{totalGoals}</p>
            <span className="summary-label">metas definidas</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">🟢</div>
          <div className="summary-content">
            <h3>Metas Activas</h3>
            <p className="summary-number">{activeGoals}</p>
            <span className="summary-label">en progreso</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>Completadas</h3>
            <p className="summary-number">{completedGoals}</p>
            <span className="summary-label">metas logradas</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h3>Progreso General</h3>
            <p
              className="summary-number"
              style={{ color: getProgressColor(overallProgress) }}
            >
              {formatPercentage(overallProgress)}
            </p>
            <span className="summary-label">del objetivo total</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Mis Metas</h2>
            <button
              className="add-button"
              onClick={() => setShowGoalForm(true)}
            >
              + Crear Meta
            </button>
          </div>

          <div className="goals-grid">
            {state.financialGoals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No hay metas definidas</h3>
                <p>Comienza creando tu primera meta financiera para alcanzar tus objetivos</p>
                <button
                  className="add-button"
                  onClick={() => setShowGoalForm(true)}
                >
                  Crear Primera Meta
                </button>
              </div>
            ) : (
              state.financialGoals.map(goal => {
                const daysUntilTarget = getDaysUntilTarget(goal.targetDate);
                const statusInfo = getStatusInfo(goal.status);

                return (
                  <div key={goal.id} className="goal-item">
                    <div className="goal-header">
                      <div className="goal-icon" style={{ backgroundColor: goal.color }}>
                        {goal.icon}
                      </div>
                      <div className="goal-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEditGoal(goal)}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteFinancialGoal(goal.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="goal-content">
                      <h3>{goal.name}</h3>
                      {goal.description && (
                        <p className="goal-description">{goal.description}</p>
                      )}

                      <div className="goal-category-badge">
                        {goal.category === 'savings' && '💰 Ahorro'}
                        {goal.category === 'investment' && '📈 Inversión'}
                        {goal.category === 'purchase' && '🛒 Compra'}
                        {goal.category === 'debt' && '💳 Deuda'}
                        {goal.category === 'emergency' && '🚨 Emergencia'}
                        {goal.category === 'vacation' && '✈️ Vacaciones'}
                        {goal.category === 'education' && '🎓 Educación'}
                        {goal.category === 'other' && '📝 Otro'}
                      </div>

                      <div className="goal-progress">
                        <div className="progress-header">
                          <span className="progress-text">
                            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                          </span>
                          <span className="progress-percentage">
                            {formatPercentage(goal.progress)}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${goal.progress}%`,
                              backgroundColor: getProgressColor(goal.progress),
                            }}
                          />
                        </div>
                      </div>

                      <div className="goal-details">
                        <div className="detail-row">
                          <span className="detail-label">Prioridad:</span>
                          <span
                            className="detail-value"
                            style={{ color: getPriorityColor(goal.priority) }}
                          >
                            {goal.priority === 'low' && 'Baja'}
                            {goal.priority === 'medium' && 'Media'}
                            {goal.priority === 'high' && 'Alta'}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Fecha objetivo:</span>
                          <span className="detail-value">{formatDate(goal.targetDate)}</span>
                        </div>

                        {daysUntilTarget > 0 && (
                          <div className="detail-row">
                            <span className="detail-label">Días restantes:</span>
                            <span className="detail-value">{daysUntilTarget} días</span>
                          </div>
                        )}

                        {goal.monthlyContribution && (
                          <div className="detail-row">
                            <span className="detail-label">Contribución mensual:</span>
                            <span className="detail-value">{formatCurrency(goal.monthlyContribution)}</span>
                          </div>
                        )}
                      </div>

                      <div className="goal-status">
                        <span
                          className="status-badge"
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          {statusInfo.icon} {statusInfo.name}
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

      {showGoalForm && (
        <GoalForm
          goal={editingGoal}
          onClose={handleCloseGoalForm}
          isEditing={!!editingGoal}
        />
      )}
    </div>
  );
}
