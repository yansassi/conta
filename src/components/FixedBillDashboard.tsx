import React from 'react';
import { FixedBill, FixedBillSummary } from '../types/fixedBill';
import { formatCurrency } from '../utils/debtCalculations';
import { calculateFixedBillStatus } from '../utils/fixedBillCalculations';
import { DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface FixedBillDashboardProps {
  bills: FixedBill[];
  summary: FixedBillSummary;
}

export const FixedBillDashboard: React.FC<FixedBillDashboardProps> = ({ bills, summary }) => {
  const overdueBills = bills.filter(bill => calculateFixedBillStatus(bill) === 'em-atraso');
  const upcomingBills = bills.filter(bill => {
    const status = calculateFixedBillStatus(bill);
    return status === 'pendente';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Contas Fixas
        </h1>
        <p className="text-xl text-gray-600">
          Controle suas contas mensais e mantenha-se em dia
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Mensal</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.totalMonthlyAmount)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Já Pago</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.paidAmount)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(summary.pendingAmount)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Atraso</p>
              <p className="text-2xl font-bold text-red-600">
                {summary.overdueBills}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barra de Progresso */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progresso de Pagamentos do Mês
          </h3>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${summary.totalBills > 0 ? (summary.paidBills / summary.totalBills) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Pagas: {summary.paidBills}/{summary.totalBills}</span>
              <span>
                {summary.totalBills > 0 
                  ? `${Math.round((summary.paidBills / summary.totalBills) * 100)}% concluído`
                  : '0% concluído'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="space-y-4">
          {summary.overdueBills > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Atenção:</strong> Você tem {summary.overdueBills} conta(s) em atraso.
                  </p>
                </div>
              </div>
            </div>
          )}

          {upcomingBills.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Lembrete:</strong> Você tem {upcomingBills.length} conta(s) pendente(s) para este mês.
                  </p>
                </div>
              </div>
            </div>
          )}

          {summary.paidBills === summary.totalBills && summary.totalBills > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <strong>Parabéns!</strong> Todas as suas contas fixas estão em dia este mês!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder quando não há alertas */}
          {summary.overdueBills === 0 && upcomingBills.length === 0 && (summary.paidBills !== summary.totalBills || summary.totalBills === 0) && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Tudo certo!</strong> Suas contas estão organizadas e sob controle.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};