import React from 'react';
import { Debt } from '../types/debt';
import { formatCurrency, formatDate, getStatusColor, getCategoryIcon } from '../utils/debtCalculations';
import { Calculator, Trash2, Calendar, Percent } from 'lucide-react';

interface DebtListProps {
  debts: Debt[];
  onNegotiate: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export const DebtList: React.FC<DebtListProps> = ({ debts, onNegotiate, onDelete }) => {
  if (debts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Parabéns! Você não tem dívidas cadastradas
        </h3>
        <p className="text-gray-600">
          Comece adicionando suas dívidas para ter controle total de suas finanças.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Suas Dívidas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {debts.map((debt) => (
          <div key={debt.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow relative">
            {/* Header do Card */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getCategoryIcon(debt.category)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{debt.name}</h3>
                  <p className="text-xs text-gray-600 truncate">{debt.creditor}</p>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex space-x-1">
                <button
                  onClick={() => onNegotiate(debt)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Negociar"
                >
                  <Calculator className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(debt.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Valor Principal */}
            <div className="text-center mb-3">
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(debt.remainingAmount)}
              </p>
              <p className="text-sm text-gray-600">Valor Restante</p>
            </div>

            {/* Informações Principais */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Parcela Mín:</span>
                <span className="font-semibold">{formatCurrency(debt.minimumPayment)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Juros:</span>
                <span className="font-semibold flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  {debt.interestRate}% a.a.
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Parcelas:</span>
                <span className="font-semibold">{debt.installments.paid}/{debt.installments.total}</span>
              </div>
            </div>

            {/* Status e Data */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(debt.status)}`}>
                  {debt.status.replace('-', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-center text-xs text-gray-600">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(debt.dueDate)}
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(debt.installments.paid / debt.installments.total) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 text-center mt-1">
                {Math.round((debt.installments.paid / debt.installments.total) * 100)}% pago
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};