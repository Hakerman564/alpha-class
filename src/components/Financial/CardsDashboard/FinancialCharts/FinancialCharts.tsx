import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import './chart-setup';
import './FinancialCharts.css';

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril' , 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const data: ChartData<'bar'> = {
  labels,
  datasets: [
    {
      label: 'Gastos Mensuales',
      data: [15000, 18000, 16000, 19000, 10000, 12000, 15000, 18000, 20000, 22000, 25000, 28000], // tus gastos de ejemplo
      backgroundColor: 'rgba(133, 255, 99, 0.5)', // color de barras
    },
  ],
};

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Gastos por Mes' },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

export default function FinancialCharts() {
  return (
    <div className="chart-container">
      <Bar data={data} options={options} redraw />
    </div>
  );
}
