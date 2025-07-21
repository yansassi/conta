import React from 'react';
import { Debt } from '../types/debt';
import { formatCurrency, formatDate, getStatusColor, getCategoryIcon } from '../utils/debtCalculations';
import { Edit, Trash2, Calendar, Percent } from 'lucide-react';

interface DebtListProps {
  debts: Debt[];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export const DebtList: React.FC<DebtListProps> = ({ debts, onEdit, onDelete }) => {
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Suas Dívidas</h2>
      
      {debts.map((debt) => (
        <div key={debt.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{getCategoryIcon(debt.category)}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{debt.name}</h3>
                  <p className="text-sm text-gray-600">{debt.creditor}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Valor Restante</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(debt.remainingAmount)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Parcela Mínima</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(debt.minimumPayment)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Taxa de Juros</p>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <Percent className="h-4 w-4 mr-1" />
                    {debt.interestRate}% a.a.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Vence em: {formatDate(debt.dueDate)}
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(debt.status)}`}>
                    {debt.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {debt.installments.paid}/{debt.installments.total} parcelas pagas
                </div>
              </div>
              
              {/* Barra de progresso das parcelas */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(debt.installments.paid / debt.installments.total) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(debt)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(debt.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};