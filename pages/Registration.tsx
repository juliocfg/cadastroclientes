import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import { addCustomer, updateCustomer } from '../services/customerService';
import { Save, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const Registration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingCustomer = location.state?.customer as Customer | undefined;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState: Omit<Customer, 'id' | 'createdAt'> = {
    nome: '',
    telefone: '',
    idade: 0,
    rua: '',
    numero: '',
    complemento: '',
    cidade: '',
    cep: '',
    email: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        nome: editingCustomer.nome || '',
        telefone: editingCustomer.telefone || '',
        idade: editingCustomer.idade || 0,
        rua: editingCustomer.rua || '',
        numero: editingCustomer.numero || '',
        complemento: editingCustomer.complemento || '',
        cidade: editingCustomer.cidade || '',
        cep: editingCustomer.cep || '',
        email: editingCustomer.email || ''
      });
    }
  }, [editingCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'idade' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (editingCustomer && editingCustomer.id) {
        await updateCustomer(editingCustomer.id, formData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/relatorio');
        }, 1500);
      } else {
        await addCustomer(formData);
        setSuccess(true);
        setFormData(initialFormState);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(editingCustomer ? "Erro ao atualizar cliente." : "Erro ao cadastrar cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (editingCustomer) {
      navigate('/relatorio');
    } else {
      setFormData(initialFormState);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {editingCustomer ? 'Editar Cliente' : 'Novo Cadastro'}
          </h2>
          <p className="text-gray-500 mt-1">
            {editingCustomer 
              ? 'Atualize os dados do cliente abaixo.' 
              : 'Preencha os dados abaixo para cadastrar um novo cliente.'}
          </p>
        </div>
        {editingCustomer && (
          <button 
            onClick={() => navigate('/relatorio')}
            className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section: Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="cliente@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input
                    type="number"
                    name="idade"
                    required
                    min="1"
                    max="120"
                    value={formData.idade || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input
                  type="text"
                  name="cep"
                  required
                  value={formData.cep}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="00000-000"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  required
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <input
                  type="text"
                  name="rua"
                  required
                  value={formData.rua}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Nome da rua"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input
                  type="text"
                  name="numero"
                  required
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="123"
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento (Opcional)</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Apto, Bloco, etc."
                />
              </div>
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
            {success && (
              <span className="text-green-600 flex items-center text-sm font-medium animate-fade-in">
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingCustomer ? 'Atualizado com sucesso!' : 'Salvo com sucesso!'}
              </span>
            )}
            {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
            
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`
                flex items-center px-6 py-3 rounded-lg text-white font-medium shadow-md transition-all
                ${loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {editingCustomer ? 'Atualizar Cliente' : 'Salvar Cliente'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;