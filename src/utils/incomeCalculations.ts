import { Income } from '../types/income';

export const calculateIncomeStatus = (income: Income): 'recebido' | 'pendente' | 'em-atraso' => {
  if (income.isReceived) return 'recebido';
  
  if (!income.expectedDate) return 'pendente';
  
  const today = new Date();
  const expectedDate = new Date(income.expectedDate);
  
  if (today > expectedDate) return 'em-atraso';
  return 'pendente';
};

export const getIncomeStatusColor = (status: string): string => {
  switch (status) {
    case 'recebido': return 'text-green-600 bg-green-100';
    case 'pendente': return 'text-yellow-600 bg-yellow-100';
    case 'em-atraso': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getIncomeCategoryIcon = (category: string): string => {
  switch (category) {
    case 'salario': return '💰';
    case 'freelance': return '💻';
    case 'investimento': return '📈';
    case 'aluguel': return '🏠';
    case 'vendas': return '🛒';
    case 'bonus': return '🎁';
    default: return '💵';
  }
};

export const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case 'salario': return 'Salário';
    case 'freelance': return 'Freelance';
    case 'investimento': return 'Investimento';
    case 'aluguel': return 'Aluguel';
    case 'vendas': return 'Vendas';
    case 'bonus': return 'Bônus';
    default: return 'Outros';
  }
};

export const getFrequencyDisplayName = (frequency: string): string => {
  switch (frequency) {
    case 'unico': return 'Único';
    case 'mensal': return 'Mensal';
    case 'trimestral': return 'Trimestral';
    case 'semestral': return 'Semestral';
    case 'anual': return 'Anual';
    default: return 'Único';
  }
};

export const getNextExpectedDate = (income: Income): Date | null => {
  if (!income.isRecurring || income.frequency === 'unico') return null;
  
  const lastDate = income.expectedDate || income.receivedDate;
  const nextDate = new Date(lastDate);
  
  switch (income.frequency) {
    case 'mensal':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'trimestral':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'semestral':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'anual':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
};

export const getDaysUntilExpected = (expectedDate: Date): number => {
  const today = new Date();
  const diffTime = expectedDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};