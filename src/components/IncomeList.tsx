import React from 'react';
import { Income } from '../types/income';
import { formatCurrency, formatDate } from '../utils/debtCalculations';
import { 
  getIncomeStatusColor, 
  getIncomeCategoryIcon, 
  calculateIncomeStatus,
  getCategoryDisplayName,
  getFrequencyDisplayName,
  getDaysUntilExpected
} from '../utils/incomeCalculations';
import { Edit, Trash2, Calendar, CheckCircle, Clock, Repeat } from 'lucide-react';

interface IncomeListProps {
  incomes: Income[];
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
  onToggleReceived: (id: string) => void;
}

export const IncomeList: React.FC<IncomeListProps> = ({ 
  incomes, 
  onEdit, 
  onDelete, 
  onToggleReceived 
}) => {
  if (incomes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhum recebimento cadastrado
        </h3>
        <p className="text-gray-600">
          Comece adicionando seus recebimentos como salário, freelances, investimentos, etc.
        </p>
      </div>
    );
  }

  const sortedIncomes = [...incomes].sort((a, b) => {
    const statusA = calculateIncomeStatus(a);
    const statusB = calculateIncomeStatus(b);
    
    // Priorizar recebimentos em atraso, depois pendentes, depois recebidos
    const statusOrder = { 'em-atraso': 0, 'pendente': 1, 'recebido': 2 };
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    
    // Se mesmo status, ordenar por data esperada ou recebida
    const dateA = a.expectedDate || a.receivedDate;
    const dateB = b.expectedDate || b.receivedDate;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Recebimentos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedIncomes.map((income) => {
          const status = calculateIncomeStatus(income);
          const daysUntilExpected = income.expectedDate ? getDaysUntilExpected(income.expectedDate) : null;
          
          return (
            <div key={income.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow relative">
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getIncomeCategoryIcon(income.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{income.name}</h3>
                    <p className="text-xs text-gray-600 truncate">{income.source}</p>
                  </div>
                </div>
                
                {/* Botões de Ação */}
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEdit(income)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(income.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Valor Principal */}
              <div className="text-center mb-3">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(income.amount)}
                </p>
                <p className="text-sm text-gray-600">
                  {getCategoryDisplayName(income.category)}
                </p>
              </div>

              {/* Informações Principais */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequência:</span>
                  <span className="font-semibold flex items-center">
                    {income.isRecurring && <Repeat className="h-3 w-3 mr-1" />}
                    {getFrequencyDisplayName(income.frequency)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-semibold text-xs">
                    {income.isReceived 
                      ? formatDate(income.receivedDate)
                      : income.expectedDate 
                        ? formatDate(income.expectedDate)
                        : formatDate(income.receivedDate)
                    }
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIncomeStatusColor(status)}`}>
                    {status === 'recebido' ? 'Recebido' : status === 'pendente' ? 'Pendente' : 'Em Atraso'}
                  </span>
                </div>
                
                {status !== 'recebido' && income.expectedDate && daysUntilExpected !== null && (
                  <div className="flex items-center justify-center text-xs text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {daysUntilExpected > 0 
                      ? `${daysUntilExpected} dias`
                      : `${Math.abs(daysUntilExpected)} dias atraso`
                    }
                  </div>
                )}
              </div>

              {/* Botão de Toggle Recebimento */}
              <button
                onClick={() => onToggleReceived(income.id)}
                className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  income.isReceived
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>{income.isReceived ? 'Marcar Pendente' : 'Marcar Recebido'}</span>
              </button>

              {/* Descrição (se houver) */}
              {income.description && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 line-clamp-2">{income.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};