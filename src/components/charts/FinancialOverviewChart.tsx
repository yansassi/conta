import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DebtSummary } from '../../types/debt';
import { FixedBillSummary } from '../../types/fixedBill';
import { IncomeSummary } from '../../types/income';
import { formatCurrency } from '../../utils/debtCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialOverviewChartProps {
  debtSummary: DebtSummary;
  fixedBillSummary: FixedBillSummary;
  incomeSummary: IncomeSummary;
}

export const FinancialOverviewChart: React.FC<FinancialOverviewChartProps> = ({
  debtSummary,
  fixedBillSummary,
  incomeSummary,
}) => {
  const totalExpenses = fixedBillSummary.totalMonthlyAmount + debtSummary.monthlyPayments;
  const netIncome = incomeSummary.totalMonthlyIncome - totalExpenses;
  const commitmentPercentage = incomeSummary.totalMonthlyIncome > 0 
    ? (totalExpenses / incomeSummary.totalMonthlyIncome) * 100 
    : 0;

  // Dados para o gráfico de barras (Receitas vs Despesas)
  const barData = {
    labels: ['Recebimentos', 'Contas Fixas', 'Dívidas', 'Saldo Líquido'],
    datasets: [
      {
        label: 'Valores Mensais',
        data: [
          incomeSummary.totalMonthlyIncome,
          -fixedBillSummary.totalMonthlyAmount,
          -debtSummary.monthlyPayments,
          netIncome,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Verde para receitas
          'rgba(245, 158, 11, 0.8)',  // Amarelo para contas fixas
          'rgba(239, 68, 68, 0.8)',   // Vermelho para dívidas
          netIncome >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)', // Verde se positivo, vermelho se negativo
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          netIncome >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Dados para o gráfico de linha (Evolução hipotética)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Saldo Acumulado',
        data: months.map((_, index) => netIncome * (index + 1)),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Dívidas Restantes',
        data: months.map((_, index) => Math.max(0, debtSummary.totalRemaining - (debtSummary.monthlyPayments * (index + 1)))),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
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
        text: 'Fluxo de Caixa Mensal',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = Math.abs(context.parsed.y);
            const label = context.label;
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
              return formatCurrency(Math.abs(value));
            }
            return value;
          }
        }
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Projeção Financeira (6 meses)',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
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

  return (
    <div className="space-y-6">
      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Saldo Mensal</h3>
          <p className={`text-3xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netIncome)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {netIncome >= 0 ? 'Sobra mensal' : 'Déficit mensal'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprometimento</h3>
          <p className={`text-3xl font-bold ${
            commitmentPercentage > 70 ? 'text-red-600' : 
            commitmentPercentage > 50 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {commitmentPercentage.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">da renda comprometida</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tempo para Quitar</h3>
          <p className="text-3xl font-bold text-blue-600">
            {debtSummary.monthlyPayments > 0 
              ? Math.ceil(debtSummary.totalRemaining / debtSummary.monthlyPayments)
              : '∞'
            }
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {debtSummary.monthlyPayments > 0 ? 'meses' : 'indefinido'}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-80">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};