import React, { useState, useMemo } from 'react';
import { Debt, DebtSummary } from './types/debt';
import { FixedBill, FixedBillSummary } from './types/fixedBill';
import { Income, IncomeSummary } from './types/income';
import { Project, ProjectSummary } from './types/project';
import { Dashboard } from './components/Dashboard';
import { DebtList } from './components/DebtList';
import { DebtForm } from './components/DebtForm';
import { NegotiateDebtForm } from './components/NegotiateDebtForm';
import { FixedBillDashboard } from './components/FixedBillDashboard';
import { FixedBillList } from './components/FixedBillList';
import { FixedBillForm } from './components/FixedBillForm';
import { IncomeDashboard } from './components/IncomeDashboard';
import { IncomeList } from './components/IncomeList';
import { IncomeForm } from './components/IncomeForm';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ProjectList } from './components/ProjectList';
import { ProjectForm } from './components/ProjectForm';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateDebtStatus } from './utils/debtCalculations';
import { calculateFixedBillStatus } from './utils/fixedBillCalculations';
import { calculateIncomeStatus } from './utils/incomeCalculations';
import { 
  calculateProjectTotalCosts, 
  calculateProjectTotalRevenue, 
  calculateProjectProfit,
  calculateProjectPendingRevenue,
  calculateProjectPendingCosts
} from './utils/projectCalculations';
import { processImportedData, createExportData, downloadJsonFile } from './utils/dataProcessing';
import { Plus, Calculator, Download, Upload } from 'lucide-react';

function App() {
  const [debts, setDebts] = useLocalStorage<Debt[]>('debts', []);
  const [fixedBills, setFixedBills] = useLocalStorage<FixedBill[]>('fixedBills', []);
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [showForm, setShowForm] = useState(false);
  const [showFixedBillForm, setShowFixedBillForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showNegotiateForm, setShowNegotiateForm] = useState(false);
  const [negotiatingDebt, setNegotiatingDebt] = useState<Debt | undefined>();
  const [editingFixedBill, setEditingFixedBill] = useState<FixedBill | undefined>();
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'debts' | 'fixedBills' | 'incomes' | 'projects'>('dashboard');

  // Referência para o input de arquivo
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Calcular resumo das dívidas
  const summary: DebtSummary = useMemo(() => {
    const totalDebts = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
    const totalRemaining = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
    const monthlyPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const averageInterestRate = debts.length > 0 
      ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length 
      : 0;
    
    const debtsInDefault = debts.filter(debt => {
      const status = calculateDebtStatus(debt);
      return status === 'em-atraso' || status === 'proximo-vencimento';
    }).length;

    return {
      totalDebts,
      totalRemaining,
      monthlyPayments,
      averageInterestRate,
      debtsInDefault,
    };
  }, [debts]);

  // Calcular resumo das contas fixas
  const fixedBillSummary: FixedBillSummary = useMemo(() => {
    const totalMonthlyAmount = fixedBills.reduce((sum, bill) => sum + bill.amount, 0);
    const paidAmount = fixedBills
      .filter(bill => bill.isPaid)
      .reduce((sum, bill) => sum + bill.amount, 0);
    const pendingAmount = totalMonthlyAmount - paidAmount;
    const totalBills = fixedBills.length;
    const paidBills = fixedBills.filter(bill => bill.isPaid).length;
    const overdueBills = fixedBills.filter(bill => 
      calculateFixedBillStatus(bill) === 'em-atraso'
    ).length;

    return {
      totalMonthlyAmount,
      paidAmount,
      pendingAmount,
      totalBills,
      paidBills,
      overdueBills,
    };
  }, [fixedBills]);

  // Atualizar status dos recebimentos
  const incomesWithStatus = useMemo(() => {
    return incomes.map(income => ({
      ...income,
      expectedDate: income.expectedDate ? new Date(income.expectedDate) : new Date(),
      receivedDate: income.receivedDate ? new Date(income.receivedDate) : undefined,
      status: calculateIncomeStatus(income),
    }));
  }, [incomes]);

  // Calcular resumo dos recebimentos
  const incomeSummary: IncomeSummary = useMemo(() => {
    const totalMonthlyIncome = incomes
      .filter(income => income.frequency === 'mensal' || income.frequency === 'unico')
      .reduce((sum, income) => sum + income.amount, 0);
    const receivedAmount = incomes
      .filter(income => income.isReceived)
      .reduce((sum, income) => sum + income.amount, 0);
    const pendingAmount = incomes
      .filter(income => !income.isReceived)
      .reduce((sum, income) => sum + income.amount, 0);
    const totalIncomes = incomes.length;
    const receivedIncomes = incomes.filter(income => income.isReceived).length;
    const overdueIncomes = incomes.filter(income => 
      calculateIncomeStatus(income) === 'em-atraso'
    ).length;

    return {
      totalMonthlyIncome,
      receivedAmount,
      pendingAmount,
      totalIncomes,
      receivedIncomes,
      overdueIncomes,
    };
  }, [incomes]);

  // Calcular resumo dos projetos
  const projectSummary: ProjectSummary = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'em-andamento').length;
    const completedProjects = projects.filter(p => p.status === 'concluido').length;
    const totalRevenue = projects.reduce((sum, p) => sum + calculateProjectTotalRevenue(p), 0);
    const totalCosts = projects.reduce((sum, p) => sum + calculateProjectTotalCosts(p), 0);
    const totalProfit = totalRevenue - totalCosts;
    const pendingRevenue = projects.reduce((sum, p) => sum + calculateProjectPendingRevenue(p), 0);
    const pendingCosts = projects.reduce((sum, p) => sum + calculateProjectPendingCosts(p), 0);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue,
      totalCosts,
      totalProfit,
      pendingRevenue,
      pendingCosts,
    };
  }, [projects]);

  // Atualizar status das dívidas
  const debtsWithStatus = useMemo(() => {
    return debts.map(debt => ({
      ...debt,
      status: calculateDebtStatus(debt),
      dueDate: debt.dueDate ? new Date(debt.dueDate) : new Date(),
    }));
  }, [debts]);

  // Atualizar status das contas fixas
  const fixedBillsWithStatus = useMemo(() => {
    return fixedBills.map(bill => ({
      ...bill,
      dueDate: bill.dueDate ? new Date(bill.dueDate) : new Date(),
      lastPaidDate: bill.lastPaidDate ? new Date(bill.lastPaidDate) : undefined,
      status: calculateFixedBillStatus(bill),
    }));
  }, [fixedBills]);

  const handleSaveDebt = (debtData: { name: string; category: string; totalAmount: number }) => {
    // Adicionando nova dívida com valores padrão
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: debtData.name,
      category: debtData.category as any,
      totalAmount: debtData.totalAmount,
      remainingAmount: debtData.totalAmount, // Inicialmente igual ao total
      interestRate: 0, // Será definido na negociação
      dueDate: new Date(), // Data atual como padrão
      installments: {
        total: 1, // Padrão: à vista
        paid: 0,
      },
      minimumPayment: debtData.totalAmount, // Inicialmente o valor total
      creditor: 'A definir', // Será preenchido na negociação
      status: 'em-dia',
    };
    setDebts(prev => [...prev, newDebt]);
    setShowForm(false);
  };

  const handleSaveFixedBill = (billData: Omit<FixedBill, 'id'>) => {
    if (editingFixedBill) {
      // Editando conta existente
      setFixedBills(prev => prev.map(bill => 
        bill.id === editingFixedBill.id 
          ? { ...billData, id: editingFixedBill.id }
          : bill
      ));
    } else {
      // Adicionando nova conta
      const newBill: FixedBill = {
        ...billData,
        id: Date.now().toString(),
      };
      setFixedBills(prev => [...prev, newBill]);
    }
    setShowFixedBillForm(false);
    setEditingFixedBill(undefined);
  };

  const handleSaveIncome = (incomeData: Omit<Income, 'id'>) => {
    if (editingIncome) {
      // Editando recebimento existente
      setIncomes(prev => prev.map(income => 
        income.id === editingIncome.id 
          ? { ...incomeData, id: editingIncome.id }
          : income
      ));
    } else {
      // Adicionando novo recebimento
      const newIncome: Income = {
        ...incomeData,
        id: Date.now().toString(),
      };
      setIncomes(prev => [...prev, newIncome]);
    }
    setShowIncomeForm(false);
    setEditingIncome(undefined);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'costs' | 'revenues'>) => {
    if (editingProject) {
      // Editando projeto existente
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id 
          ? { 
              ...projectData, 
              id: editingProject.id,
              costs: editingProject.costs,
              revenues: editingProject.revenues
            }
          : project
      ));
    } else {
      // Adicionando novo projeto
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        costs: [],
        revenues: [],
      };
      setProjects(prev => [...prev, newProject]);
    }
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleOpenNegotiateForm = (debt: Debt) => {
    setNegotiatingDebt(debt);
    setShowNegotiateForm(true);
  };

  const handleSaveNegotiatedDebt = (negotiatedDebt: Debt) => {
    setDebts(prev => prev.map(debt => 
      debt.id === negotiatedDebt.id ? negotiatedDebt : debt
    ));
    setShowNegotiateForm(false);
    setNegotiatingDebt(undefined);
  };

  const handleCancelNegotiateForm = () => {
    setShowNegotiateForm(false);
    setNegotiatingDebt(undefined);
  };

  const handleEditFixedBill = (bill: FixedBill) => {
    setEditingFixedBill(bill);
    setShowFixedBillForm(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleViewProjectDetails = (project: Project) => {
    // TODO: Implementar modal de detalhes do projeto
    console.log('Ver detalhes do projeto:', project);
  };

  const handleDeleteDebt = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta dívida?')) {
      setDebts(prev => prev.filter(debt => debt.id !== id));
    }
  };

  const handleDeleteFixedBill = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      setFixedBills(prev => prev.filter(bill => bill.id !== id));
    }
  };

  const handleDeleteIncome = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este recebimento?')) {
      setIncomes(prev => prev.filter(income => income.id !== id));
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto? Todos os custos e receitas associados serão perdidos.')) {
      setProjects(prev => prev.filter(project => project.id !== id));
    }
  };

  const handleToggleFixedBillPaid = (id: string) => {
    setFixedBills(prev => prev.map(bill => 
      bill.id === id 
        ? { 
            ...bill, 
            isPaid: !bill.isPaid,
            lastPaidDate: !bill.isPaid ? new Date() : undefined
          }
        : bill
    ));
  };

  const handleToggleIncomeReceived = (id: string) => {
    setIncomes(prev => prev.map(income => 
      income.id === id 
        ? { 
            ...income, 
            isReceived: !income.isReceived,
            receivedDate: !income.isReceived ? new Date() : income.receivedDate
          }
        : income
    ));
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleCancelFixedBillForm = () => {
    setShowFixedBillForm(false);
    setEditingFixedBill(undefined);
  };

  const handleCancelIncomeForm = () => {
    setShowIncomeForm(false);
    setEditingIncome(undefined);
  };

  const handleCancelProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleExportData = () => {
    try {
      const exportData = createExportData(debts, fixedBills, incomes);
      const filename = `controle-financeiro-${new Date().toISOString().split('T')[0]}.json`;
      downloadJsonFile(exportData, filename);
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        const processedData = processImportedData(jsonData);
        
        // Confirmar importação
        const confirmMessage = `
Dados encontrados:
• ${processedData.debts.length} dívida(s)
• ${processedData.fixedBills.length} conta(s) fixa(s)
• ${processedData.incomes.length} recebimento(s)

Deseja importar estes dados? Isso substituirá todos os dados atuais.
        `.trim();
        
        if (confirm(confirmMessage)) {
          setDebts(processedData.debts);
          setFixedBills(processedData.fixedBills);
          setIncomes(processedData.incomes);
          alert('Dados importados com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        alert('Erro ao importar dados. Verifique se o arquivo é válido.');
      }
    };
    
    reader.readAsText(file);
    // Limpar o input para permitir reimportar o mesmo arquivo
    event.target.value = '';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calculator className="h-8 w-8 mr-3 text-blue-600" />
              Controle Financeiro
            </h1>
            <p className="text-gray-600 mt-1">Organize suas dívidas e recupere sua saúde financeira</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleImportClick}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
            >
              <Upload className="h-5 w-5" />
              <span>Importar</span>
            </button>
            
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <Download className="h-5 w-5" />
              <span>Exportar</span>
            </button>
            
            {activeTab === 'fixedBills' ? (
              <button
                onClick={() => setShowFixedBillForm(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Nova Conta</span>
              </button>
            ) : activeTab === 'incomes' ? (
              <button
                onClick={() => setShowIncomeForm(true)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Novo Recebimento</span>
              </button>
            ) : activeTab === 'projects' ? (
              <button
                onClick={() => setShowProjectForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Novo Projeto</span>
              </button>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Nova Dívida</span>
              </button>
            )}
          </div>
        </div>

        {/* Input oculto para importação de arquivos */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportData}
          style={{ display: 'none' }}
        />

        {/* Navegação */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-md overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'debts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Minhas Dívidas ({debts.length})
          </button>
          <button
            onClick={() => setActiveTab('fixedBills')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'fixedBills'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contas Fixas ({fixedBills.length})
          </button>
          <button
            onClick={() => setActiveTab('incomes')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'incomes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recebimentos ({incomes.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Projetos ({projects.length})
          </button>
        </div>

        {/* Conteúdo Principal */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            debtSummary={summary} 
            fixedBillSummary={fixedBillSummary} 
            incomeSummary={incomeSummary} 
            debts={debtsWithStatus}
            fixedBills={fixedBillsWithStatus}
            incomes={incomesWithStatus}
          />
        )}

        {activeTab === 'debts' && (
          <DebtList
            debts={debtsWithStatus}
            onNegotiate={handleOpenNegotiateForm}
            onDelete={handleDeleteDebt}
          />
        )}

        {activeTab === 'fixedBills' && (
          <>
            <FixedBillDashboard bills={fixedBillsWithStatus} summary={fixedBillSummary} />
            <div className="mt-8">
              <FixedBillList
                bills={fixedBillsWithStatus}
                onEdit={handleEditFixedBill}
                onDelete={handleDeleteFixedBill}
                onTogglePaid={handleToggleFixedBillPaid}
              />
            </div>
          </>
        )}

        {activeTab === 'incomes' && (
          <>
            <IncomeDashboard incomes={incomesWithStatus} summary={incomeSummary} />
            <div className="mt-8">
              <IncomeList
                incomes={incomesWithStatus}
                onEdit={handleEditIncome}
                onDelete={handleDeleteIncome}
                onToggleReceived={handleToggleIncomeReceived}
              />
            </div>
          </>
        )}

        {activeTab === 'projects' && (
          <>
            <ProjectDashboard projects={projects} summary={projectSummary} />
            <div className="mt-8">
              <ProjectList
                projects={projects}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onViewDetails={handleViewProjectDetails}
              />
            </div>
          </>
        )}

        {/* Modal do Formulário */}
        {showForm && (
          <DebtForm
            onSave={handleSaveDebt}
            onCancel={handleCancelForm}
          />
        )}

        {/* Modal do Formulário de Negociação */}
        {showNegotiateForm && negotiatingDebt && (
          <NegotiateDebtForm
            debt={negotiatingDebt}
            onSave={handleSaveNegotiatedDebt}
            onCancel={handleCancelNegotiateForm}
          />
        )}

        {/* Modal do Formulário de Contas Fixas */}
        {showFixedBillForm && (
          <FixedBillForm
            bill={editingFixedBill}
            onSave={handleSaveFixedBill}
            onCancel={handleCancelFixedBillForm}
          />
        )}

        {/* Modal do Formulário de Recebimentos */}
        {showIncomeForm && (
          <IncomeForm
            income={editingIncome}
            onSave={handleSaveIncome}
            onCancel={handleCancelIncomeForm}
          />
        )}

        {/* Modal do Formulário de Projetos */}
        {showProjectForm && (
          <ProjectForm
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={handleCancelProjectForm}
          />
        )}
      </div>
    </div>
  );
}

export default App;