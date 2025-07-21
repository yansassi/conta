import { Project, ProjectSummary } from '../types/project';

export const calculateProjectStatus = (project: Project): 'planejamento' | 'em-andamento' | 'concluido' | 'cancelado' | 'pausado' => {
  return project.status;
};

export const calculateProjectProgress = (project: Project): number => {
  if (project.status === 'concluido') return 100;
  if (project.status === 'cancelado') return 0;
  if (project.status === 'planejamento') return 0;
  
  const totalRevenues = project.revenues.length;
  const receivedRevenues = project.revenues.filter(r => r.isReceived).length;
  
  if (totalRevenues === 0) return 0;
  return Math.round((receivedRevenues / totalRevenues) * 100);
};

export const calculateProjectTotalCosts = (project: Project): number => {
  return project.costs.reduce((sum, cost) => sum + cost.amount, 0);
};

export const calculateProjectTotalRevenue = (project: Project): number => {
  return project.revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
};

export const calculateProjectProfit = (project: Project): number => {
  const totalRevenue = calculateProjectTotalRevenue(project);
  const totalCosts = calculateProjectTotalCosts(project);
  return totalRevenue - totalCosts;
};

export const calculateProjectPendingRevenue = (project: Project): number => {
  return project.revenues
    .filter(revenue => !revenue.isReceived)
    .reduce((sum, revenue) => sum + revenue.amount, 0);
};

export const calculateProjectPendingCosts = (project: Project): number => {
  return project.costs
    .filter(cost => !cost.isPaid)
    .reduce((sum, cost) => sum + cost.amount, 0);
};

export const getProjectStatusColor = (status: string): string => {
  switch (status) {
    case 'planejamento': return 'text-blue-600 bg-blue-100';
    case 'em-andamento': return 'text-yellow-600 bg-yellow-100';
    case 'concluido': return 'text-green-600 bg-green-100';
    case 'cancelado': return 'text-red-600 bg-red-100';
    case 'pausado': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getProjectCategoryIcon = (category: string): string => {
  switch (category) {
    case 'desenvolvimento': return '💻';
    case 'design': return '🎨';
    case 'consultoria': return '💼';
    case 'marketing': return '📢';
    case 'vendas': return '🛒';
    default: return '📁';
  }
};

export const getCostCategoryIcon = (category: string): string => {
  switch (category) {
    case 'material': return '📦';
    case 'servico': return '🔧';
    case 'software': return '💿';
    case 'equipamento': return '⚙️';
    case 'transporte': return '🚗';
    default: return '💰';
  }
};

export const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case 'desenvolvimento': return 'Desenvolvimento';
    case 'design': return 'Design';
    case 'consultoria': return 'Consultoria';
    case 'marketing': return 'Marketing';
    case 'vendas': return 'Vendas';
    case 'material': return 'Material';
    case 'servico': return 'Serviço';
    case 'software': return 'Software';
    case 'equipamento': return 'Equipamento';
    case 'transporte': return 'Transporte';
    default: return 'Outros';
  }
};

export const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case 'planejamento': return 'Planejamento';
    case 'em-andamento': return 'Em Andamento';
    case 'concluido': return 'Concluído';
    case 'cancelado': return 'Cancelado';
    case 'pausado': return 'Pausado';
    default: return 'Desconhecido';
  }
};