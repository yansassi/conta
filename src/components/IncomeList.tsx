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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Recebimentos</h2>
      
      {sortedIncomes.map((income) => {
        const status = calculateIncomeStatus(income);
        const daysUntilExpected = income.expectedDate ? getDaysUntilExpected(income.expectedDate) : null;
        
        return (
          <div key={income.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{getIncomeCategoryIcon(income.category)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{income.name}</h3>
                    <p className="text-sm text-gray-600">{income.source}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(income.amount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Categoria</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getCategoryDisplayName(income.category)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Frequência</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                      {income.isRecurring && <Repeat className="h-4 w-4 mr-1" />}
                      {getFrequencyDisplayName(income.frequency)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIncomeStatusColor(status)}`}>
                      {status === 'recebido' ? 'Recebido' : status === 'pendente' ? 'Pendente' : 'Em Atraso'}
                    </span>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {income.isReceived 
                        ? `Recebido em: ${formatDate(income.receivedDate)}`
                        : income.expectedDate 
                          ? `Esperado para: ${formatDate(income.expectedDate)}`
                          : `Data: ${formatDate(income.receivedDate)}`
                      }
                    </div>
                    
                    {status !== 'recebido' && income.expectedDate && daysUntilExpected !== null && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {daysUntilExpected > 0 
                          ? `${daysUntilExpected} dias restantes`
                          : `${Math.abs(daysUntilExpected)} dias em atraso`
                        }
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onToggleReceived(income.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      income.isReceived
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{income.isReceived ? 'Marcar como Pendente' : 'Marcar como Recebido'}</span>
                  </button>
                </div>
                
                {income.description && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{income.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(income)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(income.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};