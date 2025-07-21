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
import { Pie, Bar } from 'react-chartjs-2';
import { FixedBill, FixedBillSummary } from '../../types/fixedBill';
import { formatCurrency } from '../../utils/debtCalculations';
import { getCategoryDisplayName, getFixedBillCategoryIcon } from '../../utils/fixedBillCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FixedBillCategoryChartProps {
  bills: FixedBill[];
  summary: FixedBillSummary;
}

export const FixedBillCategoryChart: React.FC<FixedBillCategoryChartProps> = ({ bills, summary }) => {
  // Agrupar contas por categoria
  const categoryData = bills.reduce((acc, bill) => {
    const category = bill.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += bill.amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(categoryData);
  const amounts = Object.values(categoryData);

  // Cores para as categorias
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Azul
    'rgba(34, 197, 94, 0.8)',    // Verde
    'rgba(245, 158, 11, 0.8)',   // Amarelo
    'rgba(239, 68, 68, 0.8)',    // Vermelho
    'rgba(147, 51, 234, 0.8)',   // Roxo
    'rgba(236, 72, 153, 0.8)',   // Rosa
    'rgba(14, 165, 233, 0.8)',   // Azul claro
    'rgba(34, 197, 94, 0.8)',    // Verde claro
    'rgba(251, 146, 60, 0.8)',   // Laranja
    'rgba(156, 163, 175, 0.8)',  // Cinza
  ];

  // Dados para o gráfico de pizza (distribuição por categoria)
  const pieData = {
    labels: categories.map(cat => getCategoryDisplayName(cat)),
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  };

  // Dados para o gráfico de status (pago vs pendente vs em atraso)
  const statusData = {
    labels: ['Pagas', 'Pendentes', 'Em Atraso'],
    datasets: [
      {
        label: 'Quantidade',
        data: [
          summary.paidBills,
          summary.totalBills - summary.paidBills - summary.overdueBills,
          summary.overdueBills,
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Distribuição de Gastos por Categoria',
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
            const percentage = ((value / summary.totalMonthlyAmount) * 100).toFixed(1);
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
        text: 'Status das Contas do Mês',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (bills.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma conta fixa cadastrada
          </h3>
          <p className="text-gray-600">
            Adicione suas contas mensais para visualizar os gráficos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-80">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-80">
          <Bar data={statusData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};