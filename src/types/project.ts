export interface Project {
  id: string;
  name: string;
  description?: string;
  category: 'desenvolvimento' | 'design' | 'consultoria' | 'marketing' | 'vendas' | 'outros';
  status: 'planejamento' | 'em-andamento' | 'concluido' | 'cancelado' | 'pausado';
  startDate: Date;
  endDate?: Date;
  estimatedEndDate?: Date;
  client?: string;
  totalBudget?: number;
  costs: ProjectCost[];
  revenues: ProjectRevenue[];
}

export interface ProjectCost {
  id: string;
  projectId: string;
  name: string;
  category: 'material' | 'servico' | 'software' | 'equipamento' | 'transporte' | 'outros';
  amount: number;
  date: Date;
  description?: string;
  isPaid: boolean;
}

export interface ProjectRevenue {
  id: string;
  projectId: string;
  name: string;
  amount: number;
  date: Date;
  expectedDate?: Date;
  description?: string;
  isReceived: boolean;
  installment?: {
    current: number;
    total: number;
  };
}

export interface ProjectSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  pendingRevenue: number;
  pendingCosts: number;
}