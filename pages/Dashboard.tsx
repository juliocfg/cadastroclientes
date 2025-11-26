import React, { useEffect, useState } from 'react';
import { Customer } from '../types';
import { getCustomers } from '../services/customerService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, MapPin, Activity } from 'lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCustomers();
      setCustomers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Compute Metrics
  const totalCustomers = customers.length;
  const averageAge = customers.length 
    ? (customers.reduce((acc, curr) => acc + curr.idade, 0) / customers.length).toFixed(1) 
    : 0;
  
  // Data for City Chart
  const cityDataMap = customers.reduce((acc, curr) => {
    acc[curr.cidade] = (acc[curr.cidade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cityChartData = Object.entries(cityDataMap).map(([name, value]) => ({ name, value }));

  // Data for Age Groups
  const ageGroups = {
    '18-25': 0,
    '26-35': 0,
    '36-50': 0,
    '50+': 0
  };

  customers.forEach(c => {
    if (c.idade <= 25) ageGroups['18-25']++;
    else if (c.idade <= 35) ageGroups['26-35']++;
    else if (c.idade <= 50) ageGroups['36-50']++;
    else ageGroups['50+']++;
  });

  const ageChartData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

  if (loading) {
    return <div className="flex justify-center items-center h-full text-indigo-600">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">Visão geral da base de clientes.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Clientes</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalCustomers}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Média de Idade</p>
            <h3 className="text-2xl font-bold text-gray-900">{averageAge} anos</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cidades Atendidas</p>
            <h3 className="text-2xl font-bold text-gray-900">{cityChartData.length}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Cidade</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {cityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Groups */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Faixa Etária</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;