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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Projetos</h2>
      
      {sortedProjects.map((project) => {
        const totalCosts = calculateProjectTotalCosts(project);
        const totalRevenue = calculateProjectTotalRevenue(project);
        const profit = calculateProjectProfit(project);
        const progress = calculateProjectProgress(project);
        
        return (
          <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{getProjectCategoryIcon(project.category)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    {project.client && (
                      <p className="text-sm text-gray-600">Cliente: {project.client}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Receita Total</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Custos Totais</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(totalCosts)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Lucro</p>
                    <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(profit)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Categoria</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getCategoryDisplayName(project.category)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(project.status)}`}>
                      {getStatusDisplayName(project.status)}
                    </span>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Início: {formatDate(project.startDate)}
                    </div>
                    
                    {project.endDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Fim: {formatDate(project.endDate)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Progresso: {progress}%
                  </div>
                </div>
                
                {/* Barra de progresso */}
                <div className="mt-3">
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
                </div>
                
                {project.description && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onViewDetails(project)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Ver detalhes"
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar projeto"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir projeto"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};