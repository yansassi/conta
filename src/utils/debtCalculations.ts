import { Debt } from '../types/debt';

export const calculateDebtStatus = (debt: Debt): 'em-dia' | 'proximo-vencimento' | 'em-atraso' => {
  const today = new Date();
  const dueDate = new Date(debt.dueDate);
  const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) return 'em-atraso';
  if (daysDiff <= 7) return 'proximo-vencimento';
  return 'em-dia';
};

export const calculateMonthlyInterest = (amount: number, yearlyRate: number): number => {
  return (amount * yearlyRate) / 12 / 100;
};

export const calculatePayoffTime = (debt: Debt, monthlyPayment: number): number => {
  if (monthlyPayment <= calculateMonthlyInterest(debt.remainingAmount, debt.interestRate)) {
    return Infinity; // Nunca pagará se só pagar os juros
  }
  
  const monthlyRate = debt.interestRate / 12 / 100;
  const months = Math.log(1 + (debt.remainingAmount * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const parseLocaleNumber = (input: string): number => {
  if (!input || input.trim() === '') return 0;
  
  // Remove espaços e caracteres não numéricos exceto vírgula e ponto
  let cleanInput = input.replace(/[^\d,.]/g, '');
  
  // Se tem vírgula, assumir formato brasileiro (1.234,56)
  if (cleanInput.includes(',')) {
    // Remover pontos (separadores de milhares) e trocar vírgula por ponto
    cleanInput = cleanInput.replace(/\./g, '').replace(',', '.');
  }
  
  const number = parseFloat(cleanInput);
  return isNaN(number) ? 0 : number;
};

export const formatNumberToLocale = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'em-dia': return 'text-green-600 bg-green-100';
    case 'proximo-vencimento': return 'text-yellow-600 bg-yellow-100';
    case 'em-atraso': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'cartao': return '💳';
    case 'financiamento': return '🏠';
    case 'emprestimo': return '🏦';
    case 'conta': return '📄';
    default: return '📋';
  }
};