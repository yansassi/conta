import React, { useState, useEffect } from 'react';
import { FixedBill } from '../types/fixedBill';
import { parseLocaleNumber, formatNumberToLocale } from '../utils/debtCalculations';
import { X } from 'lucide-react';

interface FixedBillFormProps {
  bill?: FixedBill;
  onSave: (bill: Omit<FixedBill, 'id'>) => void;
  onCancel: () => void;
}

export const FixedBillForm: React.FC<FixedBillFormProps> = ({ bill, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'outros' as const,
    amount: '',
    dueDay: '',
    provider: '',
    description: '',
    isRecurring: true,
    isPaid: false,
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        category: bill.category,
        amount: formatNumberToLocale(bill.amount),
        dueDay: bill.dueDay.toString(),
        provider: bill.provider,
        description: bill.description || '',
        isRecurring: bill.isRecurring,
        isPaid: bill.isPaid,
      });
    }
  }, [bill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBill: Omit<FixedBill, 'id'> = {
      name: formData.name,
      category: formData.category,
      amount: parseLocaleNumber(formData.amount),
      dueDay: parseInt(formData.dueDay),
      provider: formData.provider,
      description: formData.description || undefined,
      isRecurring: formData.isRecurring,
      isPaid: formData.isPaid,
      lastPaidDate: formData.isPaid ? new Date() : undefined,
    };

    onSave(newBill);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {bill ? 'Editar Conta Fixa' : 'Nova Conta Fixa'}
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
                Nome da Conta
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Conta de Luz"
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
                <option value="agua">💧 Água</option>
                <option value="luz">💡 Energia Elétrica</option>
                <option value="gas">🔥 Gás</option>
                <option value="internet">🌐 Internet</option>
                <option value="telefone">📱 Telefone</option>
                <option value="streaming">📺 Streaming</option>
                <option value="academia">💪 Academia</option>
                <option value="seguro">🛡️ Seguro</option>
                <option value="condominio">🏢 Condomínio</option>
                <option value="outros">📄 Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$)
              </label>
              <input
                type="text"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dia do Vencimento
              </label>
              <select
                value={formData.dueDay}
                onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o dia</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>
                    Dia {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor/Empresa
              </label>
              <input
                type="text"
                required
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: CEMIG, Vivo, Netflix"
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
                placeholder="Informações adicionais sobre a conta..."
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
                  Conta recorrente (repete todo mês)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                  Já foi paga este mês
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
              {bill ? 'Salvar Alterações' : 'Adicionar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};