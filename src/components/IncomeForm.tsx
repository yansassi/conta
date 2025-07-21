import React, { useState, useEffect } from 'react';
import { Income } from '../types/income';
import { X } from 'lucide-react';

interface IncomeFormProps {
  income?: Income;
  onSave: (income: Omit<Income, 'id'>) => void;
  onCancel: () => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ income, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'salario' as const,
    amount: '',
    frequency: 'mensal' as const,
    receivedDate: '',
    expectedDate: '',
    source: '',
    description: '',
    isRecurring: true,
    isReceived: false,
  });

  useEffect(() => {
    if (income) {
      setFormData({
        name: income.name,
        category: income.category,
        amount: income.amount.toString(),
        frequency: income.frequency,
        receivedDate: income.receivedDate.toISOString().split('T')[0],
        expectedDate: income.expectedDate ? income.expectedDate.toISOString().split('T')[0] : '',
        source: income.source,
        description: income.description || '',
        isRecurring: income.isRecurring,
        isReceived: income.isReceived,
      });
    }
  }, [income]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIncome: Omit<Income, 'id'> = {
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      receivedDate: new Date(formData.receivedDate),
      expectedDate: formData.expectedDate ? new Date(formData.expectedDate) : undefined,
      source: formData.source,
      description: formData.description || undefined,
      isRecurring: formData.isRecurring,
      isReceived: formData.isReceived,
    };

    onSave(newIncome);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {income ? 'Editar Recebimento' : 'Novo Recebimento'}
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
                Nome do Recebimento
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Salário Janeiro"
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
                <option value="salario">💰 Salário</option>
                <option value="freelance">💻 Freelance</option>
                <option value="investimento">📈 Investimento</option>
                <option value="aluguel">🏠 Aluguel</option>
                <option value="vendas">🛒 Vendas</option>
                <option value="bonus">🎁 Bônus</option>
                <option value="outros">💵 Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="unico">Único</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Recebimento
              </label>
              <input
                type="date"
                required
                value={formData.receivedDate}
                onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Esperada (Opcional)
              </label>
              <input
                type="date"
                value={formData.expectedDate}
                onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonte/Pagador
              </label>
              <input
                type="text"
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Empresa XYZ, Cliente ABC"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Informações adicionais sobre o recebimento..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
                  Recebimento recorrente
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isReceived"
                  checked={formData.isReceived}
                  onChange={(e) => setFormData({ ...formData, isReceived: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isReceived" className="ml-2 block text-sm text-gray-700">
                  Já foi recebido
                </label>
              </div>
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
              {income ? 'Salvar Alterações' : 'Adicionar Recebimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};