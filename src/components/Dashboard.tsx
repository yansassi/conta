import React from 'react';
import { DebtSummary } from '../types/debt';
import { FixedBillSummary } from '../types/fixedBill';
import { IncomeSummary } from '../types/income';
import { formatCurrency } from '../utils/debtCalculations';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Clock 
} from 'lucide-react';

interface DashboardProps {
  summary: DebtSummary;
  fixedBillSummary: FixedBillSummary;
  incomeSummary: IncomeSummary;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  summary, 
  fixedBillSummary, 
  incomeSummary 
}) => {
  const progressPercentage = summary.totalDebts > 0 
    ? ((summary.totalDebts - summary.totalRemaining) / summary.totalDebts) * 100 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard Financeiro
        </h1>
        <p className="text-xl text-gray-600">
          Visão completa das suas finanças em um só lugar
        </p>
      </div>

      {/* Seção de Dívidas */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-red-500 mr-2">💳</span>
            Controle de Dívidas
          </h2>
          <p className="text-gray-600 mt-1">Organize suas dívidas e saia do vermelho</p>
        </div>

        {/* Cards de Resumo - Dívidas */}
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

        {/* Barra de Progresso - Dívidas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progresso Geral de Pagamento das Dívidas
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

        {/* Alertas - Dívidas */}
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

      {/* Seção de Contas Fixas */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-green-500 mr-2">📋</span>
            Contas Fixas
          </h2>
          <p className="text-gray-600 mt-1">Controle suas contas mensais e mantenha-se em dia</p>
        </div>

        {/* Cards de Resumo - Contas Fixas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mensal</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(fixedBillSummary.totalMonthlyAmount)}
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
                  {formatCurrency(fixedBillSummary.paidAmount)}
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
                  {formatCurrency(fixedBillSummary.pendingAmount)}
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
                  {fixedBillSummary.overdueBills}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Barra de Progresso - Contas Fixas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progresso de Pagamentos das Contas Fixas do Mês
          </h3>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${fixedBillSummary.totalBills > 0 ? (fixedBillSummary.paidBills / fixedBillSummary.totalBills) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Pagas: {fixedBillSummary.paidBills}/{fixedBillSummary.totalBills}</span>
              <span>
                {fixedBillSummary.totalBills > 0 
                  ? `${Math.round((fixedBillSummary.paidBills / fixedBillSummary.totalBills) * 100)}% concluído`
                  : '0% concluído'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Alertas - Contas Fixas */}
        {fixedBillSummary.overdueBills > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Atenção:</strong> Você tem {fixedBillSummary.overdueBills} conta(s) em atraso.
                </p>
              </div>
            </div>
          </div>
        )}

        {fixedBillSummary.pendingAmount > 0 && fixedBillSummary.overdueBills === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Lembrete:</strong> Você tem {fixedBillSummary.totalBills - fixedBillSummary.paidBills} conta(s) pendente(s) para este mês.
                </p>
              </div>
            </div>
          </div>
        )}

        {fixedBillSummary.paidBills === fixedBillSummary.totalBills && fixedBillSummary.totalBills > 0 && (
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
      </div>

      {/* Seção de Recebimentos */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-emerald-500 mr-2">💰</span>
            Recebimentos
          </h2>
          <p className="text-gray-600 mt-1">Controle suas entradas de dinheiro e mantenha-se organizado</p>
        </div>

        {/* Cards de Resumo - Recebimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mensal</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(incomeSummary.totalMonthlyIncome)}
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
                  {formatCurrency(incomeSummary.receivedAmount)}
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
                  {formatCurrency(incomeSummary.pendingAmount)}
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
                  {incomeSummary.overdueIncomes}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Barra de Progresso - Recebimentos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progresso de Recebimentos do Mês
          </h3>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${incomeSummary.totalIncomes > 0 ? (incomeSummary.receivedIncomes / incomeSummary.totalIncomes) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Recebidos: {incomeSummary.receivedIncomes}/{incomeSummary.totalIncomes}</span>
              <span>
                {incomeSummary.totalIncomes > 0 
                  ? `${Math.round((incomeSummary.receivedIncomes / incomeSummary.totalIncomes) * 100)}% concluído`
                  : '0% concluído'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Alertas - Recebimentos */}
        {incomeSummary.overdueIncomes > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Atenção:</strong> Você tem {incomeSummary.overdueIncomes} recebimento(s) em atraso.
                </p>
              </div>
            </div>
          </div>
        )}

        {incomeSummary.pendingAmount > 0 && incomeSummary.overdueIncomes === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Lembrete:</strong> Você tem {incomeSummary.totalIncomes - incomeSummary.receivedIncomes} recebimento(s) pendente(s).
                </p>
              </div>
            </div>
          </div>
        )}

        {incomeSummary.receivedIncomes === incomeSummary.totalIncomes && incomeSummary.totalIncomes > 0 && (
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

      {/* Resumo Geral */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-blue-500 mr-2">📊</span>
          Resumo Financeiro Geral
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Saldo Mensal Estimado</p>
            <p className={`text-2xl font-bold ${
              (incomeSummary.totalMonthlyIncome - fixedBillSummary.totalMonthlyAmount - summary.monthlyPayments) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {formatCurrency(incomeSummary.totalMonthlyIncome - fixedBillSummary.totalMonthlyAmount - summary.monthlyPayments)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Recebimentos - Contas - Dívidas</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total de Gastos Mensais</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(fixedBillSummary.totalMonthlyAmount + summary.monthlyPayments)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Contas Fixas + Dívidas</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Comprometimento da Renda</p>
            <p className={`text-2xl font-bold ${
              incomeSummary.totalMonthlyIncome > 0 
                ? ((fixedBillSummary.totalMonthlyAmount + summary.monthlyPayments) / incomeSummary.totalMonthlyIncome) * 100 > 70
                  ? 'text-red-600'
                  : ((fixedBillSummary.totalMonthlyAmount + summary.monthlyPayments) / incomeSummary.totalMonthlyIncome) * 100 > 50
                    ? 'text-yellow-600'
                    : 'text-green-600'
                : 'text-gray-600'
            }`}>
              {incomeSummary.totalMonthlyIncome > 0 
                ? `${(((fixedBillSummary.totalMonthlyAmount + summary.monthlyPayments) / incomeSummary.totalMonthlyIncome) * 100).toFixed(1)}%`
                : '0%'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">% da renda comprometida</p>
          </div>
        </div>
      </div>
    </div>
  );
};