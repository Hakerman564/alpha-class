import React, { useState } from 'react';
import './SavingsPlan.css';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlySavings: number;
  monthsToGoal: number;
  startDate: string;
  targetDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}

const SavingsPlan: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    monthlySavings: '',
    category: 'general',
    priority: 'medium' as const
  });

  const calculateMonthsToGoal = (target: number, current: number, monthly: number): number => {
    const remaining = target - current;
    if (monthly <= 0) return 0;
    return Math.ceil(remaining / monthly);
  };

  const calculateTargetDate = (months: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount);
    const monthlySavings = parseFloat(formData.monthlySavings);
    
    if (targetAmount <= 0 || monthlySavings <= 0) return;
    
    const monthsToGoal = calculateMonthsToGoal(targetAmount, currentAmount, monthlySavings);
    const targetDate = calculateTargetDate(monthsToGoal);
    
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount,
      currentAmount,
      monthlySavings,
      monthsToGoal,
      startDate: new Date().toISOString().split('T')[0],
      targetDate,
      category: formData.category,
      priority: formData.priority,
      isActive: true
    };
    
    setGoals([...goals, newGoal]);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      monthlySavings: '',
      category: 'general',
      priority: 'medium'
    });
    setShowForm(false);
  };

  const updateProgress = (goalId: string, newCurrentAmount: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const monthsToGoal = calculateMonthsToGoal(goal.targetAmount, newCurrentAmount, goal.monthlySavings);
        const targetDate = calculateTargetDate(monthsToGoal);
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          monthsToGoal,
          targetDate
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const toggleGoalStatus = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, isActive: !goal.isActive } : goal
    ));
  };

  const getProgressPercentage = (goal: SavingsGoal): number => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'casa': return '🏠';
      case 'auto': return '🚗';
      case 'viaje': return '✈️';
      case 'educacion': return '📚';
      case 'negocio': return '💼';
      case 'emergencia': return '🆘';
      default: return '💰';
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="savings-plan">
      <div className="savings-header">
        <h2 className="savings-title">📈 Plan de Ahorro</h2>
        <p className="savings-subtitle">Establece metas financieras y alcanza tus objetivos</p>
        
        <div className="overall-progress">
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-label">Total Ahorrado</span>
              <span className="stat-value">${totalSaved.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Meta Total</span>
              <span className="stat-value">${totalTarget.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Progreso</span>
              <span className="stat-value">{overallProgress.toFixed(1)}%</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="savings-actions">
        <button 
          className="btn-add-goal"
          onClick={() => setShowForm(true)}
        >
          ➕ Nueva Meta de Ahorro
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nueva Meta de Ahorro</h3>
              <button 
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="savings-form">
              <div className="form-group">
                <label>Nombre de la Meta</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Compra de casa, Viaje a Europa..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monto Objetivo ($)</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                    placeholder="50000"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ahorro Mensual ($)</label>
                  <input
                    type="number"
                    value={formData.monthlySavings}
                    onChange={(e) => setFormData({...formData, monthlySavings: e.target.value})}
                    placeholder="1000"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ahorro Actual ($)</label>
                  <input
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="casa">Casa</option>
                    <option value="auto">Auto</option>
                    <option value="viaje">Viaje</option>
                    <option value="educacion">Educación</option>
                    <option value="negocio">Negocio</option>
                    <option value="emergencia">Emergencia</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Prioridad</label>
                <div className="priority-options">
                  <label className="priority-option">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === 'low'}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    />
                    <span className="priority-label low">Baja</span>
                  </label>
                  <label className="priority-option">
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={formData.priority === 'medium'}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    />
                    <span className="priority-label medium">Media</span>
                  </label>
                  <label className="priority-option">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={formData.priority === 'high'}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    />
                    <span className="priority-label high">Alta</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Crear Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="goals-container">
        {goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No tienes metas de ahorro</h3>
            <p>Crea tu primera meta para comenzar a ahorrar de manera inteligente</p>
            <button 
              className="btn-create-first"
              onClick={() => setShowForm(true)}
            >
              Crear Primera Meta
            </button>
          </div>
        ) : (
          <div className="goals-grid">
            {goals.map(goal => (
              <div key={goal.id} className={`goal-card ${!goal.isActive ? 'inactive' : ''}`}>
                <div className="goal-header">
                  <div className="goal-icon">{getCategoryIcon(goal.category)}</div>
                  <div className="goal-info">
                    <h4 className="goal-name">{goal.name}</h4>
                    <div className="goal-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(goal.priority) }}
                      >
                        {goal.priority}
                      </span>
                      <span className="goal-category">{goal.category}</span>
                    </div>
                  </div>
                  <div className="goal-actions">
                    <button 
                      className="btn-toggle"
                      onClick={() => toggleGoalStatus(goal.id)}
                      title={goal.isActive ? 'Pausar meta' : 'Activar meta'}
                    >
                      {goal.isActive ? '⏸️' : '▶️'}
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => deleteGoal(goal.id)}
                      title="Eliminar meta"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="goal-progress">
                  <div className="progress-info">
                    <span className="current-amount">${goal.currentAmount.toLocaleString()}</span>
                    <span className="separator">/</span>
                    <span className="target-amount">${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    />
                  </div>
                  <span className="progress-percentage">
                    {getProgressPercentage(goal).toFixed(1)}%
                  </span>
                </div>

                <div className="goal-details">
                  <div className="detail-item">
                    <span className="detail-label">Ahorro mensual:</span>
                    <span className="detail-value">${goal.monthlySavings.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Meses restantes:</span>
                    <span className="detail-value">{goal.monthsToGoal}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha objetivo:</span>
                    <span className="detail-value">
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="goal-update">
                  <label>Actualizar ahorro actual:</label>
                  <div className="update-input">
                    <input
                      type="number"
                      placeholder="Nuevo monto"
                      min="0"
                      max={goal.targetAmount}
                      onChange={(e) => {
                        const newAmount = parseFloat(e.target.value) || 0;
                        updateProgress(goal.id, newAmount);
                      }}
                    />
                    <button 
                      className="btn-update"
                      onClick={() => {
                        const input = document.querySelector(`input[placeholder="Nuevo monto"]`) as HTMLInputElement;
                        if (input) {
                          const newAmount = parseFloat(input.value) || 0;
                          updateProgress(goal.id, newAmount);
                          input.value = '';
                        }
                      }}
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsPlan;
