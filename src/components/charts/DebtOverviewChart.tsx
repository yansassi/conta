import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { DebtSummary } from '../../types/debt';
import { formatCurrency } from '../../utils/debtCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DebtOverviewChartProps {
  summary: DebtSummary;
}

export const DebtOverviewChart: React.FC<DebtOverviewChartProps> = ({ summary }) => {
  const paidAmount = summary.totalDebts - summary.totalRemaining;
  
  // Dados para o gráfico de rosca (progresso de pagamento)
  const doughnutData = {
    labels: ['Valor Pago', 'Valor Restante'],
    datasets: [
      {
        data: [paidAmount, summary.totalRemaining],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Dados para o gráfico de barras (comparativo mensal)
  const barData = {
    labels: ['Pagamentos Mensais', 'Taxa Média de Juros (%)'],
    datasets: [
      {
        label: 'Valores',
        data: [summary.monthlyPayments, summary.averageInterestRate * 100], // Multiplicar por 100 para visualizar melhor
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Progresso de Pagamento das Dívidas',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / summary.totalDebts) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Resumo Financeiro Mensal',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed.y;
            if (label.includes('Juros')) {
              return `${label}: ${value.toFixed(1)}%`;
            }
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            if (typeof value === 'number') {
              return formatCurrency(value);
            }
            return value;
          }
        }
      },
    },
  };

  if (summary.totalDebts === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Parabéns! Você não tem dívidas
          </h3>
          <p className="text-gray-600">
            Continue assim e mantenha sua saúde financeira em dia!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-80">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};