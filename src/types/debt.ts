export interface Debt {
  id: string;
  name: string;
  category: 'cartao' | 'financiamento' | 'emprestimo' | 'conta' | 'outros';
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  dueDate: Date;
  installments: {
    total: number;
    paid: number;
  };
  status: 'em-dia' | 'proximo-vencimento' | 'em-atraso';
  minimumPayment: number;
  creditor: string;
}

export interface Payment {
  id: string;
  debtId: string;
  amount: number;
  date: Date;
  type: 'parcela' | 'extra';
}

export interface DebtSummary {
  totalDebts: number;
  totalRemaining: number;
  monthlyPayments: number;
  averageInterestRate: number;
  debtsInDefault: number;
}