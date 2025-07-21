import React from 'react';
import { FixedBill } from '../types/fixedBill';
import { formatCurrency, formatDate } from '../utils/debtCalculations';
import { 
  getFixedBillStatusColor, 
  getFixedBillCategoryIcon, 
  calculateFixedBillStatus,
  getCategoryDisplayName,
  getDaysUntilDue,
  getNextDueDate
} from '../utils/fixedBillCalculations';
import { Edit, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react';

interface FixedBillListProps {
  bills: FixedBill[];
  onEdit: (bill: FixedBill) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
}

export const FixedBillList: React.FC<FixedBillListProps> = ({ 
  bills, 
  onEdit, 
  onDelete, 
  onTogglePaid 
}) => {
  if (bills.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma conta fixa cadastrada
        </h3>
        <p className="text-gray-600">
          Comece adicionando suas contas mensais como água, luz, internet, etc.
        </p>
      </div>
    );
  }

  const sortedBills = [...bills].sort((a, b) => {
    const statusA = calculateFixedBillStatus(a);
    const statusB = calculateFixedBillStatus(b);
    
    // Priorizar contas em atraso, depois pendentes, depois pagas
    const statusOrder = { 'em-atraso': 0, 'pendente': 1, 'pago': 2 };
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    
    // Se mesmo status, ordenar por dia de vencimento
    return a.dueDay - b.dueDay;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contas Fixas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBills.map((bill) => {
        const status = calculateFixedBillStatus(bill);
        const daysUntilDue = getDaysUntilDue(bill.dueDay);
        const nextDueDate = getNextDueDate(bill.dueDay);
        
        return (
          <div key={bill.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow relative">
            {/* Header do Card */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getFixedBillCategoryIcon(bill.category)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{bill.name}</h3>
                  <p className="text-xs text-gray-600 truncate">{bill.provider}</p>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(bill)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(bill.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Valor Principal */}
            <div className="text-center mb-3">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(bill.amount)}
              </p>
              <p className="text-sm text-gray-600">
                {getCategoryDisplayName(bill.category)}
              </p>
            </div>

            {/* Status e Data */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFixedBillStatusColor(status)}`}>
                  {status === 'pago' ? 'Pago' : status === 'pendente' ? 'Pendente' : 'Em Atraso'}
                </span>
              </div>
              
              <div className="flex items-center justify-center text-xs text-gray-600">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(nextDueDate)}
              </div>
              
              {status !== 'pago' && (
                <div className="flex items-center justify-center text-xs text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {daysUntilDue > 0 
                    ? `${daysUntilDue} dias`
                    : `${Math.abs(daysUntilDue)} dias atraso`
                  }
                </div>
              )}
            </div>

            {/* Botão de Toggle Pagamento */}
            <button
              onClick={() => onTogglePaid(bill.id)}
              className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                bill.isPaid
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>{bill.isPaid ? 'Marcar Pendente' : 'Marcar Pago'}</span>
            </button>

            {/* Descrição (se houver) */}
            {bill.description && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 line-clamp-2">{bill.description}</p>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};
                </div>
                
                {bill.description && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{bill.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(bill)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(bill.id)}
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