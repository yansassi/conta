export interface FixedBill {
  id: string;
  name: string;
  category: 'agua' | 'luz' | 'gas' | 'internet' | 'telefone' | 'streaming' | 'academia' | 'seguro' | 'condominio' | 'outros';
  amount: number;
  dueDay: number; // Dia do mês que vence (1-31)
  isPaid: boolean;
  lastPaidDate?: Date;
  provider: string;
  description?: string;
  isRecurring: boolean;
}

export interface FixedBillSummary {
  totalMonthlyAmount: number;
  paidAmount: number;
  pendingAmount: number;
  totalBills: number;
  paidBills: number;
  overdueBills: number;
}