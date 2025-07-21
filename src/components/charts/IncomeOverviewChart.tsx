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
import { Income, IncomeSummary } from '../../types/income';
import { formatCurrency } from '../../utils/debtCalculations';
import { getCategoryDisplayName } from '../../utils/incomeCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface IncomeOverviewChartProps {
  incomes: Income[];
  summary: IncomeSummary;
}

export const IncomeOverviewChart: React.FC<IncomeOverviewChartProps> = ({ incomes, summary }) => {
  // Agrupar recebimentos por categoria
  const categoryData = incomes.reduce((acc, income) => {
    const category = income.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += income.amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(categoryData);
  const amounts = Object.values(categoryData);

  // Cores para as categorias
  const colors = [
    'rgba(34, 197, 94, 0.8)',    // Verde
    'rgba(59, 130, 246, 0.8)',   // Azul
    'rgba(245, 158, 11, 0.8)',   // Amarelo
    'rgba(147, 51, 234, 0.8)',   // Roxo
    'rgba(236, 72, 153, 0.8)',   // Rosa
    'rgba(14, 165, 233, 0.8)',   // Azul claro
    'rgba(251, 146, 60, 0.8)',   // Laranja
  ];

  // Dados para o gráfico de rosca (recebido vs pendente)
  const doughnutData = {
    labels: ['Já Recebido', 'Pendente', 'Em Atraso'],
    datasets: [
      {
        data: [
          summary.receivedAmount,
          summary.pendingAmount - (summary.overdueIncomes * (summary.pendingAmount / (summary.totalIncomes - summary.receivedIncomes || 1))),
          summary.overdueIncomes * (summary.pendingAmount / (summary.totalIncomes - summary.receivedIncomes || 1)),
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Dados para o gráfico de barras (distribuição por categoria)
  const barData = {
    labels: categories.map(cat => getCategoryDisplayName(cat)),
    datasets: [
      {
        label: 'Valor',
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length).map(color => color.replace('0.8', '1')),
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
        text: 'Status dos Recebimentos',
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
            const total = summary.receivedAmount + summary.pendingAmount;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
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
        text: 'Recebimentos por Categoria',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `Valor: ${formatCurrency(value)}`;
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

  if (incomes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum recebimento cadastrado
          </h3>
          <p className="text-gray-600">
            Adicione seus recebimentos para visualizar os gráficos.
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