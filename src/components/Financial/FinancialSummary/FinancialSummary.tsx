
import { useFinancial } from '../../../hooks/useFinancial';
import './FinancialSummary.css';

export default function FinancialSummary() {
  const { state } = useFinancial();
  const { summary, health } = state;

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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getHealthStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'fair': return 'Regular';
      case 'poor': return 'Mala';
      default: return 'Desconocida';
    }
  };

  return (
    <div className="financial-summary">
      <div className="summary-header">
        <h2>Resumen Financiero</h2>
        <div className="health-score">
          <div className="health-circle">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke={getHealthStatusColor(health.status)}
                strokeWidth="6"
                strokeDasharray={`${(health.score / 100) * 220} 220`}
                strokeDashoffset="55"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="health-text">
              <span className="health-number">{health.score}</span>
              <span className="health-label">/100</span>
            </div>
          </div>
          <div className="health-info">
            <h3>Salud Financiera</h3>
            <span 
              className="health-status"
              style={{ color: getHealthStatusColor(health.status) }}
            >
              {getHealthStatusText(health.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card income">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h3>Ingresos Totales</h3>
            <p className="kpi-amount">{formatCurrency(summary.totalIncome)}</p>
            <span className="kpi-period">por mes</span>
          </div>
        </div>

        <div className="kpi-card expenses">
          <div className="kpi-icon">💸</div>
          <div className="kpi-content">
            <h3>Gastos Totales</h3>
            <p className="kpi-amount">{formatCurrency(summary.totalExpenses)}</p>
            <span className="kpi-period">por mes</span>
          </div>
        </div>

        <div className="kpi-card net-income">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <h3>Ingreso Neto</h3>
            <p className={`kpi-amount ${summary.netIncome >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(summary.netIncome)}
            </p>
            <span className="kpi-period">por mes</span>
          </div>
        </div>

        <div className="kpi-card savings">
          <div className="kpi-icon">🏦</div>
          <div className="kpi-content">
            <h3>Tasa de Ahorro</h3>
            <p className={`kpi-amount ${summary.savingsRate >= 20 ? 'positive' : summary.savingsRate >= 10 ? 'warning' : 'negative'}`}>
              {formatPercentage(summary.savingsRate)}
            </p>
            <span className="kpi-period">de ingresos</span>
          </div>
        </div>

        <div className="kpi-card fixed-expenses">
          <div className="kpi-icon">🔒</div>
          <div className="kpi-content">
            <h3>Gastos Fijos</h3>
            <p className="kpi-amount">{formatCurrency(summary.fixedExpenses)}</p>
            <span className="kpi-period">por mes</span>
          </div>
        </div>

        <div className="kpi-card variable-expenses">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <h3>Gastos Variables</h3>
            <p className="kpi-amount">{formatCurrency(summary.variableExpenses)}</p>
            <span className="kpi-period">por mes</span>
          </div>
        </div>

        <div className="kpi-card budget">
          <div className="kpi-icon">🎯</div>
          <div className="kpi-content">
            <h3>Presupuesto Mensual</h3>
            <p className="kpi-amount">{formatCurrency(summary.monthlyBudget)}</p>
            <span className="kpi-period">80% de ingresos</span>
          </div>
        </div>

        <div className="kpi-card utilization">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <h3>Utilización Presupuesto</h3>
            <p className={`kpi-amount ${summary.budgetUtilization <= 80 ? 'positive' : summary.budgetUtilization <= 100 ? 'warning' : 'negative'}`}>
              {formatPercentage(summary.budgetUtilization)}
            </p>
            <span className="kpi-period">utilizado</span>
          </div>
        </div>
      </div>

      {health.recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recomendaciones</h3>
          <ul className="recommendations-list">
            {health.recommendations.map((recommendation, index) => (
              <li key={index} className="recommendation-item">
                <span className="recommendation-icon">💡</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="summary-insights">
        <h3>Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Balance de Gastos</h4>
            <p>
              {summary.fixedExpenses > summary.variableExpenses 
                ? 'Tus gastos fijos son mayores que los variables. Considera revisar si puedes reducir algunos gastos fijos.'
                : 'Tus gastos variables son mayores que los fijos. Esto te da flexibilidad para ajustar tu presupuesto.'}
            </p>
          </div>
          
          <div className="insight-card">
            <h4>Capacidad de Ahorro</h4>
            <p>
              {summary.savingsRate >= 20 
                ? '¡Excelente! Estás ahorrando más del 20% de tus ingresos. Mantén este hábito.'
                : summary.savingsRate >= 10
                ? 'Estás ahorrando un porcentaje moderado. Intenta aumentar tu tasa de ahorro al 20%.'
                : 'Tu tasa de ahorro es baja. Considera reducir gastos o aumentar ingresos.'}
            </p>
          </div>

          <div className="insight-card">
            <h4>Control Presupuestario</h4>
            <p>
              {summary.budgetUtilization <= 80
                ? 'Excelente control del presupuesto. Estás gastando menos del 80% de tu presupuesto mensual.'
                : summary.budgetUtilization <= 100
                ? 'Estás cerca del límite de tu presupuesto. Revisa tus gastos para evitar excederte.'
                : 'Estás excediendo tu presupuesto mensual. Es urgente revisar y reducir gastos.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
