import React from 'react';
import { DebtSummary } from '../types/debt';
import { FixedBillSummary } from '../types/fixedBill';
import { IncomeSummary } from '../types/income';
import { Debt } from '../types/debt';
import { FixedBill } from '../types/fixedBill';
import { Income } from '../types/income';
import { DebtOverviewChart } from './charts/DebtOverviewChart';
import { FixedBillCategoryChart } from './charts/FixedBillCategoryChart';
import { IncomeOverviewChart } from './charts/IncomeOverviewChart';
import { FinancialOverviewChart } from './charts/FinancialOverviewChart';

interface DashboardProps {
  debtSummary: DebtSummary;
  fixedBillSummary: FixedBillSummary;
  incomeSummary: IncomeSummary;
  debts: Debt[];
  fixedBills: FixedBill[];
  incomes: Income[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  debtSummary,
  fixedBillSummary,
  incomeSummary,
  debts,
  fixedBills,
  incomes,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📊 Dashboard Financeiro
        </h1>
        <p className="text-xl text-gray-600">
          Visualize suas finanças através de gráficos interativos
        </p>
      </div>

      {/* Visão Geral Financeira */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-blue-500 mr-2">📈</span>
          Visão Geral Financeira
        </h2>
        <FinancialOverviewChart 
          debtSummary={debtSummary}
          fixedBillSummary={fixedBillSummary}
          incomeSummary={incomeSummary}
        />
      </div>

      {/* Análise de Dívidas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-red-500 mr-2">💳</span>
          Análise de Dívidas
        </h2>
        <DebtOverviewChart summary={debtSummary} />
      </div>

      {/* Análise de Contas Fixas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-green-500 mr-2">📋</span>
          Análise de Contas Fixas
        </h2>
        <FixedBillCategoryChart bills={fixedBills} summary={fixedBillSummary} />
      </div>

      {/* Análise de Recebimentos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-emerald-500 mr-2">💰</span>
          Análise de Recebimentos
        </h2>
        <IncomeOverviewChart incomes={incomes} summary={incomeSummary} />
      </div>
    </div>
  );
};