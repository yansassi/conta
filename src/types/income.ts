export interface Income {
  id: string;
  name: string;
  category: 'salario' | 'freelance' | 'investimento' | 'aluguel' | 'vendas' | 'bonus' | 'outros';
  amount: number;
  frequency: 'unico' | 'mensal' | 'trimestral' | 'semestral' | 'anual';
  receivedDate: Date;
  expectedDate?: Date;
  isReceived: boolean;
  source: string;
  description?: string;
  isRecurring: boolean;
}

export interface IncomeSummary {
  totalMonthlyIncome: number;
  receivedAmount: number;
  pendingAmount: number;
  totalIncomes: number;
  receivedIncomes: number;
  overdueIncomes: number;
}