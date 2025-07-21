import React from 'react';
import { Debt, DebtSummary } from '../types/debt';
import { formatCurrency } from '../utils/debtCalculations';
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  debts: Debt[];
  summary: DebtSummary;
}

export const Dashboard: React.FC<DashboardProps> = ({ debts, summary }) => {
  const progressPercentage = summary.totalDebts > 0 
    ? ((summary.totalDebts - summary.totalRemaining) / summary.totalDebts) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Controle de Dívidas
        </h1>
        <p className="text-xl text-gray-600">
          Organize suas finanças e saia do vermelho
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total em Dívidas</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalRemaining)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagamento Mensal</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.monthlyPayments)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa Média Juros</p>
              <p className="text-2xl font-bold text-yellow-600">
                {summary.averageInterestRate.toFixed(1)}%
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progresso</p>
              <p className="text-2xl font-bold text-green-600">
                {progressPercentage.toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progresso Geral de Pagamento
        </h3>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Pago: {formatCurrency(summary.totalDebts - summary.totalRemaining)}</span>
            <span>Restante: {formatCurrency(summary.totalRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {summary.debtsInDefault > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Você tem {summary.debtsInDefault} dívida(s) em atraso ou próximas do vencimento.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};