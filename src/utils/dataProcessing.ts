import { Debt } from '../types/debt';
import { FixedBill } from '../types/fixedBill';
import { Income } from '../types/income';

export interface ExportData {
  debts: Debt[];
  fixedBills: FixedBill[];
  incomes: Income[];
  exportDate: string;
  version: string;
}

export const processImportedData = (data: any): ExportData => {
  // Validar estrutura básica
  if (!data || typeof data !== 'object') {
    throw new Error('Arquivo inválido: dados não encontrados');
  }

  const processedData: ExportData = {
    debts: [],
    fixedBills: [],
    incomes: [],
    exportDate: data.exportDate || new Date().toISOString(),
    version: data.version || '1.0.0',
  };

  // Processar dívidas
  if (Array.isArray(data.debts)) {
    processedData.debts = data.debts.map((debt: any) => ({
      ...debt,
      dueDate: new Date(debt.dueDate),
      totalAmount: Number(debt.totalAmount) || 0,
      remainingAmount: Number(debt.remainingAmount) || 0,
      interestRate: Number(debt.interestRate) || 0,
      minimumPayment: Number(debt.minimumPayment) || 0,
      installments: {
        total: Number(debt.installments?.total) || 0,
        paid: Number(debt.installments?.paid) || 0,
      },
    }));
  }

  // Processar contas fixas
  if (Array.isArray(data.fixedBills)) {
    processedData.fixedBills = data.fixedBills.map((bill: any) => ({
      ...bill,
      amount: Number(bill.amount) || 0,
      dueDay: Number(bill.dueDay) || 1,
      isPaid: Boolean(bill.isPaid),
      isRecurring: Boolean(bill.isRecurring),
      lastPaidDate: bill.lastPaidDate ? new Date(bill.lastPaidDate) : undefined,
    }));
  }

  // Processar recebimentos
  if (Array.isArray(data.incomes)) {
    processedData.incomes = data.incomes.map((income: any) => ({
      ...income,
      amount: Number(income.amount) || 0,
      receivedDate: new Date(income.receivedDate),
      expectedDate: income.expectedDate ? new Date(income.expectedDate) : undefined,
      isReceived: Boolean(income.isReceived),
      isRecurring: Boolean(income.isRecurring),
    }));
  }

  return processedData;
};

export const createExportData = (
  debts: Debt[],
  fixedBills: FixedBill[],
  incomes: Income[]
): ExportData => {
  return {
    debts,
    fixedBills,
    incomes,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };
};

export const downloadJsonFile = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};