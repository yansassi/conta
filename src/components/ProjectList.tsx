import React from 'react';
import { Project } from '../types/project';
import { formatCurrency, formatDate } from '../utils/debtCalculations';
import { 
  getProjectStatusColor, 
  getProjectCategoryIcon, 
  calculateProjectTotalCosts,
  calculateProjectTotalRevenue,
  calculateProjectProfit,
  calculateProjectProgress,
  getStatusDisplayName,
  getCategoryDisplayName
} from '../utils/projectCalculations';
import { Edit, Trash2, Calendar, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onViewDetails: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhum projeto cadastrado
        </h3>
        <p className="text-gray-600">
          Comece criando seu primeiro projeto para controlar custos e receitas.
        </p>
      </div>
    );
  }

  const sortedProjects = [...projects].sort((a, b) => {
    // Priorizar projetos em andamento, depois planejamento, depois concluídos
    const statusOrder = { 'em-andamento': 0, 'planejamento': 1, 'pausado': 2, 'concluido': 3, 'cancelado': 4 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    // Se mesmo status, ordenar por data de início (mais recente primeiro)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Projetos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project) => {
          const totalCosts = calculateProjectTotalCosts(project);
          const totalRevenue = calculateProjectTotalRevenue(project);
          const profit = calculateProjectProfit(project);
          const progress = calculateProjectProgress(project);
          
          return (
            <div key={project.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow relative">
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getProjectCategoryIcon(project.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                    {project.client && (
                      <p className="text-xs text-gray-600 truncate">{project.client}</p>
                    )}
                  </div>
                </div>
                
                {/* Botões de Ação */}
                <div className="flex space-x-1">
                  <button
                    onClick={() => onViewDetails(project)}
                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Detalhes"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
              {/* Lucro Principal */}
              <div className="text-center mb-3">
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </p>
                <p className="text-sm text-gray-600">Lucro</p>
              </div>
                    <Trash2 className="h-4 w-4" />
              {/* Informações Financeiras */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Receita:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Custos:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(totalCosts)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-semibold text-xs">{getCategoryDisplayName(project.category)}</span>
                </div>
              </div>
                  </button>
              {/* Status e Data */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                    {getStatusDisplayName(project.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-center text-xs text-gray-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(project.startDate)}
                  {project.endDate && ` - ${formatDate(project.endDate)}`}
                </div>
              </div>
                </div>
              {/* Barra de Progresso */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      project.status === 'concluido' ? 'bg-green-600' :
                      project.status === 'cancelado' ? 'bg-red-600' :
                      'bg-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 text-center mt-1">
                  {progress}% concluído
                </div>
              </div>
              </div>
              {/* Descrição (se houver) */}
              {project.description && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 line-clamp-2">{project.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};