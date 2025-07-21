import React from 'react';
import { Income, IncomeSummary } from '../types/income';
import { formatCurrency } from '../utils/debtCalculations';
import { calculateIncomeStatus } from '../utils/incomeCalculations';
import { DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface IncomeDashboardProps {
  incomes: Income[];
  summary: IncomeSummary;
}

export const IncomeDashboard: React.FC<IncomeDashboardProps> = ({ incomes, summary }) => {
  const overdueIncomes = incomes.filter(income => calculateIncomeStatus(income) === 'em-atraso');
  const pendingIncomes = incomes.filter(income => {
    const status = calculateIncomeStatus(income);
    return status === 'pendente';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Recebimentos
        </h1>
        <p className="text-xl text-gray-600">
          Controle suas entradas de dinheiro e mantenha-se organizado
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Mensal</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalMonthlyIncome)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Já Recebido</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.receivedAmount)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
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
                {summary.overdueIncomes}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progresso de Recebimentos do Mês
        </h3>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ 
                width: `${summary.totalIncomes > 0 ? (summary.receivedIncomes / summary.totalIncomes) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Recebidos: {summary.receivedIncomes}/{summary.totalIncomes}</span>
            <span>
              {summary.totalIncomes > 0 
                ? `${Math.round((summary.receivedIncomes / summary.totalIncomes) * 100)}% concluído`
                : '0% concluído'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {summary.overdueIncomes > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Você tem {summary.overdueIncomes} recebimento(s) em atraso.
              </p>
            </div>
          </div>
        </div>
      )}

      {pendingIncomes.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Lembrete:</strong> Você tem {pendingIncomes.length} recebimento(s) pendente(s).
              </p>
            </div>
          </div>
        </div>
      )}

      {summary.receivedIncomes === summary.totalIncomes && summary.totalIncomes > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <div className="flex">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Parabéns!</strong> Todos os seus recebimentos esperados foram recebidos este mês!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};