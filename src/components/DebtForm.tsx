import React, { useState, useEffect } from 'react';
import { Debt } from '../types/debt';
import { X } from 'lucide-react';

interface DebtFormProps {
  debt?: Debt;
  onSave: (debt: Omit<Debt, 'id'>) => void;
  onCancel: () => void;
}

export const DebtForm: React.FC<DebtFormProps> = ({ debt, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'cartao' as const,
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    dueDate: '',
    totalInstallments: '',
    paidInstallments: '',
    minimumPayment: '',
    creditor: '',
  });

  useEffect(() => {
    if (debt) {
      setFormData({
        name: debt.name,
        category: debt.category,
        totalAmount: debt.totalAmount.toString(),
        remainingAmount: debt.remainingAmount.toString(),
        interestRate: debt.interestRate.toString(),
        dueDate: debt.dueDate.toISOString().split('T')[0],
        totalInstallments: debt.installments.total.toString(),
        paidInstallments: debt.installments.paid.toString(),
        minimumPayment: debt.minimumPayment.toString(),
        creditor: debt.creditor,
      });
    }
  }, [debt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDebt: Omit<Debt, 'id'> = {
      name: formData.name,
      category: formData.category,
      totalAmount: parseFloat(formData.totalAmount),
      remainingAmount: parseFloat(formData.remainingAmount),
      interestRate: parseFloat(formData.interestRate),
      dueDate: new Date(formData.dueDate),
      installments: {
        total: parseInt(formData.totalInstallments),
        paid: parseInt(formData.paidInstallments),
      },
      minimumPayment: parseFloat(formData.minimumPayment),
      creditor: formData.creditor,
      status: 'em-dia', // Será calculado automaticamente
    };

    onSave(newDebt);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {debt ? 'Editar Dívida' : 'Nova Dívida'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Dívida
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Cartão Nubank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cartao">Cartão de Crédito</option>
                <option value="financiamento">Financiamento</option>
                <option value="emprestimo">Empréstimo</option>
                <option value="conta">Conta/Fatura</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Total (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Restante (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.remainingAmount}
                onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Juros (% ao ano)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total de Parcelas
              </label>
              <input
                type="number"
                required
                value={formData.totalInstallments}
                onChange={(e) => setFormData({ ...formData, totalInstallments: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcelas Pagas
              </label>
              <input
                type="number"
                required
                value={formData.paidInstallments}
                onChange={(e) => setFormData({ ...formData, paidInstallments: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pagamento Mínimo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.minimumPayment}
                onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credor
              </label>
              <input
                type="text"
                required
                value={formData.creditor}
                onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Banco do Brasil"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {debt ? 'Salvar Alterações' : 'Adicionar Dívida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};