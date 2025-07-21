import { FixedBill } from '../types/fixedBill';

export const calculateFixedBillStatus = (bill: FixedBill): 'pago' | 'pendente' | 'em-atraso' => {
  if (bill.isPaid) return 'pago';
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const dueDate = new Date(currentYear, currentMonth, bill.dueDay);
  
  if (today > dueDate) return 'em-atraso';
  return 'pendente';
};

export const getFixedBillStatusColor = (status: string): string => {
  switch (status) {
    case 'pago': return 'text-green-600 bg-green-100';
    case 'pendente': return 'text-yellow-600 bg-yellow-100';
    case 'em-atraso': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getFixedBillCategoryIcon = (category: string): string => {
  switch (category) {
    case 'agua': return '💧';
    case 'luz': return '💡';
    case 'gas': return '🔥';
    case 'internet': return '🌐';
    case 'telefone': return '📱';
    case 'streaming': return '📺';
    case 'academia': return '💪';
    case 'seguro': return '🛡️';
    case 'condominio': return '🏢';
    default: return '📄';
  }
};

export const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case 'agua': return 'Água';
    case 'luz': return 'Energia Elétrica';
    case 'gas': return 'Gás';
    case 'internet': return 'Internet';
    case 'telefone': return 'Telefone';
    case 'streaming': return 'Streaming';
    case 'academia': return 'Academia';
    case 'seguro': return 'Seguro';
    case 'condominio': return 'Condomínio';
    default: return 'Outros';
  }
};

export const getNextDueDate = (dueDay: number): Date => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const dueDate = new Date(currentYear, currentMonth, dueDay);
  
  // Se já passou do dia de vencimento neste mês, calcular para o próximo mês
  if (today.getDate() > dueDay) {
    dueDate.setMonth(currentMonth + 1);
  }
  
  return dueDate;
};

export const getDaysUntilDue = (dueDay: number): number => {
  const nextDue = getNextDueDate(dueDay);
  const today = new Date();
  const diffTime = nextDue.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};