import React, { useState } from 'react';
import { ServiceOrder, Building, Sector, Team, Professional, Reason, Status } from '../types';
import { StatusBadge } from './StatusBadge';
import { ServiceOrderForm } from './ServiceOrderForm';
import { PrintPreview } from './PrintPreview';
import { Search, Plus, Filter, Edit2, Calendar, Printer, CheckSquare, Square } from 'lucide-react';

interface Props {
  orders: ServiceOrder[];
  buildings: Building[];
  sectors: Sector[];
  teams: Team[];
  professionals: Professional[];
  reasons: Reason[];
  onAdd: (order: ServiceOrder) => void;
  onUpdate: (order: ServiceOrder) => void;
}

export const ServiceOrderList: React.FC<Props> = ({ orders, buildings, sectors, teams, professionals, reasons, onAdd, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | undefined>(undefined);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredOrders = orders.filter(o => {
    const matchesText = o.description.toLowerCase().includes(filterText.toLowerCase()) || 
                        o.id.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const handleEdit = (order: ServiceOrder) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingOrder(undefined);
    setIsModalOpen(true);
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length && filteredOrders.length > 0) {
        setSelectedIds(new Set());
    } else {
        setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const getBuildingName = (id: string) => buildings.find(b => b.id === id)?.description || 'N/A';
  const getSectorName = (id: string) => sectors.find(s => s.id === id)?.description || 'N/A';

  // Get selected objects for printing
  const selectedOrdersData = orders.filter(o => selectedIds.has(o.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Ordens de Serviço</h2>
        <div className="flex gap-2">
            {selectedIds.size > 0 && (
                <button 
                    onClick={() => setIsPrintOpen(true)}
                    className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <Printer size={20} />
                    <span>Imprimir ({selectedIds.size})</span>
                </button>
            )}
            <button 
                onClick={handleNew}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
                <Plus size={20} />
                <span>Nova O.S.</span>
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por ID ou descrição..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
            >
                <option value="ALL">Todos os Status</option>
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 w-12 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                        {selectedIds.size > 0 && selectedIds.size === filteredOrders.length ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}
                    </button>
                </th>
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Descrição/Local</th>
                <th className="p-4 font-semibold">Prioridade</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Datas</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                 <tr><td colSpan={7} className="p-8 text-center text-slate-400">Nenhuma O.S. encontrada.</td></tr>
              ) : (
                filteredOrders.map(order => {
                    const isSelected = selectedIds.has(order.id);
                    return (
                        <tr key={order.id} className={`hover:bg-slate-50 transition-colors group ${isSelected ? 'bg-blue-50/50' : ''}`}>
                        <td className="p-4 text-center">
                            <button onClick={() => toggleSelection(order.id)} className="text-slate-400 hover:text-blue-600">
                                {isSelected ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}
                            </button>
                        </td>
                        <td className="p-4 font-medium text-slate-700">#{order.id.split('-')[1] || order.id}</td>
                        <td className="p-4">
                            <div className="font-medium text-slate-800">{order.description}</div>
                            <div className="text-xs text-slate-500 mt-1">
                                {getBuildingName(order.buildingId)} • {getSectorName(order.sectorId)}
                            </div>
                        </td>
                        <td className="p-4"><StatusBadge priority={order.priority} /></td>
                        <td className="p-4"><StatusBadge status={order.status} /></td>
                        <td className="p-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.openingDate).toLocaleDateString()}</div>
                            {order.closingDate && <div className="text-xs text-green-600 mt-0.5">Fim: {new Date(order.closingDate).toLocaleDateString()}</div>}
                        </td>
                        <td className="p-4 text-right">
                            <button onClick={() => handleEdit(order)} className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                                <Edit2 size={18} />
                            </button>
                        </td>
                        </tr>
                    );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ServiceOrderForm 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingOrder}
          data={{ buildings, sectors, teams, professionals, reasons }}
          onSubmit={(order) => {
            if (editingOrder) {
                onUpdate(order);
            } else {
                onAdd(order);
            }
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Modal de Impressão */}
      <PrintPreview 
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        orders={selectedOrdersData}
        data={{ buildings, sectors, teams, professionals }}
      />
    </div>
  );
};
