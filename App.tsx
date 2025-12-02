import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardList, Settings, Menu, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ServiceOrderList } from './components/ServiceOrderList';
import { AdminPanel } from './components/AdminPanel';
import { 
  ServiceOrder, Building, Sector, Team, Professional, Reason, StatusReference,
  Status, Priority 
} from './types';

// --- Mock Data Initialization ---
const initialBuildings: Building[] = [
  { id: '1', description: 'Bloco A - Administrativo', status: 'Ativo' },
  { id: '2', description: 'Bloco B - Produção', status: 'Ativo' },
];

const initialSectors: Sector[] = [
  { id: '1', buildingId: '1', description: 'RH' },
  { id: '2', buildingId: '1', description: 'TI' },
  { id: '3', buildingId: '2', description: 'Linha de Montagem 1' },
  { id: '4', buildingId: '2', description: 'Almoxarifado' },
];

const initialTeams: Team[] = [
  { id: '1', description: 'Elétrica', status: 'Ativo' },
  { id: '2', description: 'Hidráulica', status: 'Ativo' },
  { id: '3', description: 'Predial Geral', status: 'Ativo' },
];

const initialProfessionals: Professional[] = [
  { id: '1', name: 'Carlos Silva', email: 'carlos@empresa.com', phone: '9999-0001', teamId: '1', status: 'Ativo' },
  { id: '2', name: 'Ana Souza', email: 'ana@empresa.com', phone: '9999-0002', teamId: '1', status: 'Ativo' },
  { id: '3', name: 'Roberto Mendes', email: 'roberto@empresa.com', phone: '9999-0003', teamId: '2', status: 'Ativo' },
];

const initialReasons: Reason[] = [
  { id: '1', description: 'Aguardando Peças', status: 'Ativo' },
  { id: '2', description: 'Falta de Mão de Obra', status: 'Ativo' },
  { id: '3', description: 'Orçamento Reprovado', status: 'Ativo' },
];

const initialOrders: ServiceOrder[] = [
  {
    id: 'OS-001',
    buildingId: '1',
    sectorId: '2',
    openingDate: new Date().toISOString(),
    requesterName: 'João do TI',
    requesterRamal: '1010',
    description: 'Ar condicionado pingando no servidor',
    priority: Priority.HIGH,
    status: Status.QUEUE,
    aiDiagnosis: 'Possível obstrução no dreno do aparelho. Verificar bandeja de condensação.'
  },
  {
    id: 'OS-002',
    buildingId: '2',
    sectorId: '3',
    openingDate: new Date(Date.now() - 86400000).toISOString(),
    acceptanceDate: new Date().toISOString(),
    requesterName: 'Gerente Produção',
    requesterRamal: '2020',
    description: 'Lâmpada queimada corredor principal',
    priority: Priority.LOW,
    teamId: '1',
    professionalId: '1',
    status: Status.IN_PROGRESS,
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'admin'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Global State ---
  const [orders, setOrders] = useState<ServiceOrder[]>(initialOrders);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [sectors, setSectors] = useState<Sector[]>(initialSectors);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [reasons, setReasons] = useState<Reason[]>(initialReasons);

  // --- CRUD Operations ---
  const addOrder = (order: ServiceOrder) => setOrders(prev => [order, ...prev]);
  const updateOrder = (order: ServiceOrder) => setOrders(prev => prev.map(o => o.id === order.id ? order : o));

  // Admin CRUD helpers
  const updateEntities = {
    buildings: setBuildings,
    sectors: setSectors,
    teams: setTeams,
    professionals: setProfessionals,
    reasons: setReasons,
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden print:hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <h1 className="text-xl font-bold text-slate-800">ManutTech</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="orders" icon={ClipboardList} label="Ordens de Serviço" />
          <NavItem id="admin" icon={Settings} label="Administração" />
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 text-sm text-slate-500">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">U</div>
            <div>
              <p className="font-medium text-slate-700">Usuário Demo</p>
              <p className="text-xs">Manutenção</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (Mobile) */}
        <header className="bg-white border-b border-slate-200 p-4 md:hidden flex justify-between items-center">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800">ManutTech OS</span>
          <div className="w-6" /> 
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard orders={orders} />
            )}

            {activeTab === 'orders' && (
              <ServiceOrderList 
                orders={orders}
                buildings={buildings}
                sectors={sectors}
                teams={teams}
                professionals={professionals}
                reasons={reasons}
                onAdd={addOrder}
                onUpdate={updateOrder}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel 
                data={{ buildings, sectors, teams, professionals, reasons }}
                onUpdate={updateEntities}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
