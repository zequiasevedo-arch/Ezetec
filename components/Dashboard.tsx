import React, { useMemo } from 'react';
import { ServiceOrder, Status } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CheckCircle2, AlertTriangle, Clock, Activity } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC<{ orders: ServiceOrder[] }> = ({ orders }) => {
  const stats = useMemo(() => ({
    total: orders.length,
    completed: orders.filter(o => o.status === Status.EXECUTED).length,
    pending: orders.filter(o => o.status === Status.QUEUE || o.status === Status.WAITING).length,
    active: orders.filter(o => o.status === Status.IN_PROGRESS).length,
  }), [orders]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => counts[o.status] = (counts[o.status] || 0) + 1);
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [orders]);

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => counts[o.priority] = (counts[o.priority] || 0) + 1);
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [orders]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
         <span className="text-sm text-slate-500">Última atualização: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Activity} color="blue" title="Total" value={stats.total} />
        <StatCard icon={CheckCircle2} color="green" title="Executadas" value={stats.completed} />
        <StatCard icon={Clock} color="yellow" title="Fila/Espera" value={stats.pending} />
        <StatCard icon={AlertTriangle} color="indigo" title="Em Andamento" value={stats.active} />
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Solicitações por Status">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Distribuição de Prioridades">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={priorityData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, color, title, value }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
    <div className={`p-3 bg-${color}-100 rounded-lg text-${color}-600`}><Icon size={24} /></div>
    <div><p className="text-sm text-slate-500 font-medium">{title}</p><h3 className="text-2xl font-bold text-slate-800">{value}</h3></div>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-80">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);