import React from 'react';
import { Project, ProjectSummary } from '../types/project';
import { formatCurrency } from '../utils/debtCalculations';
import { 
  calculateProjectTotalCosts, 
  calculateProjectTotalRevenue, 
  calculateProjectProfit 
} from '../utils/projectCalculations';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  CheckCircle, 
  Clock,
  AlertTriangle 
} from 'lucide-react';

interface ProjectDashboardProps {
  projects: Project[];
  summary: ProjectSummary;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projects, summary }) => {
  const profitableProjects = projects.filter(project => calculateProjectProfit(project) > 0).length;
  const unprofitableProjects = projects.filter(project => calculateProjectProfit(project) < 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Controle de Projetos
        </h1>
        <p className="text-xl text-gray-600">
          Gerencie custos, receitas e lucros dos seus projetos
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
              <p className="text-2xl font-bold text-blue-600">
                {summary.totalProjects}
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalRevenue)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Custos Totais</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalCosts)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lucro Total</p>
              <p className={`text-2xl font-bold ${
                summary.totalProfit >= 0 ? 'text-purple-600' : 'text-red-600'
              }`}>
                {formatCurrency(summary.totalProfit)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Projetos Ativos</h3>
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{summary.activeProjects}</p>
          <p className="text-sm text-gray-600 mt-1">em andamento</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Projetos Concluídos</h3>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{summary.completedProjects}</p>
          <p className="text-sm text-gray-600 mt-1">finalizados</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Margem de Lucro</h3>
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${
            summary.totalRevenue > 0 
              ? (summary.totalProfit / summary.totalRevenue) * 100 >= 0 
                ? 'text-blue-600' 
                : 'text-red-600'
              : 'text-gray-600'
          }`}>
            {summary.totalRevenue > 0 
              ? `${((summary.totalProfit / summary.totalRevenue) * 100).toFixed(1)}%`
              : '0%'
            }
          </p>
          <p className="text-sm text-gray-600 mt-1">de margem</p>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progresso Geral dos Projetos
        </h3>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ 
                width: `${summary.totalProjects > 0 ? (summary.completedProjects / summary.totalProjects) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Concluídos: {summary.completedProjects}/{summary.totalProjects}</span>
            <span>
              {summary.totalProjects > 0 
                ? `${Math.round((summary.completedProjects / summary.totalProjects) * 100)}% concluído`
                : '0% concluído'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {summary.pendingRevenue > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Atenção:</strong> Você tem {formatCurrency(summary.pendingRevenue)} em receitas pendentes.
              </p>
            </div>
          </div>
        </div>
      )}

      {summary.pendingCosts > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Você tem {formatCurrency(summary.pendingCosts)} em custos pendentes de pagamento.
              </p>
            </div>
          </div>
        </div>
      )}

      {profitableProjects === summary.totalProjects && summary.totalProjects > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Parabéns!</strong> Todos os seus projetos estão gerando lucro!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};