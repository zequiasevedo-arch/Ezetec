import React, { useState } from 'react';
import { Building, Sector, Team, Professional, Reason } from '../types';
import { Trash2, Plus, Edit } from 'lucide-react';

interface Props {
  data: {
    buildings: Building[];
    sectors: Sector[];
    teams: Team[];
    professionals: Professional[];
    reasons: Reason[];
  };
  onUpdate: {
    buildings: React.Dispatch<React.SetStateAction<Building[]>>;
    sectors: React.Dispatch<React.SetStateAction<Sector[]>>;
    teams: React.Dispatch<React.SetStateAction<Team[]>>;
    professionals: React.Dispatch<React.SetStateAction<Professional[]>>;
    reasons: React.Dispatch<React.SetStateAction<Reason[]>>;
  };
}

export const AdminPanel: React.FC<Props> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'buildings' | 'teams' | 'reasons'>('buildings');

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Administração</h2>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        <TabButton id="buildings" label="Prédios e Setores" />
        <TabButton id="teams" label="Equipes e Profissionais" />
        <TabButton id="reasons" label="Motivos" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        {activeTab === 'buildings' && (
          <BuildingsManager buildings={data.buildings} sectors={data.sectors} setBuildings={onUpdate.buildings} setSectors={onUpdate.sectors} />
        )}
        {activeTab === 'teams' && (
            <TeamsManager teams={data.teams} professionals={data.professionals} setTeams={onUpdate.teams} setProfessionals={onUpdate.professionals} />
        )}
        {activeTab === 'reasons' && (
            <SimpleManager title="Motivos de Espera" items={data.reasons} onUpdate={onUpdate.reasons} />
        )}
      </div>
    </div>
  );
};

// --- Sub-components for Tab Content ---

const BuildingsManager = ({ buildings, sectors, setBuildings, setSectors }: any) => {
    const [newName, setNewName] = useState('');
    
    const handleAdd = () => {
        if(!newName) return;
        setBuildings((prev: any) => [...prev, { id: Date.now().toString(), description: newName, status: 'Ativo' }]);
        setNewName('');
    }

    const handleDelete = (id: string) => {
        setBuildings((prev: any) => prev.filter((b: any) => b.id !== id));
        setSectors((prev: any) => prev.filter((s: any) => s.buildingId !== id)); // Cascade delete (mock)
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Prédios</h3>
                <div className="flex gap-2 mb-4">
                    <input className="border p-2 rounded flex-1" placeholder="Nome do prédio..." value={newName} onChange={e => setNewName(e.target.value)} />
                    <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Adicionar</button>
                </div>
                <div className="space-y-2">
                    {buildings.map((b: Building) => (
                        <div key={b.id} className="border rounded p-3 flex justify-between items-center bg-slate-50">
                            <span className="font-medium">{b.description}</span>
                            <div className="flex gap-2">
                                <SectorModal building={b} sectors={sectors.filter((s: Sector) => s.buildingId === b.id)} setSectors={setSectors} />
                                <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const SectorModal = ({ building, sectors, setSectors }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newSector, setNewSector] = useState('');

    const handleAdd = () => {
        if(!newSector) return;
        setSectors((prev: any) => [...prev, { id: Date.now().toString(), buildingId: building.id, description: newSector }]);
        setNewSector('');
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-sm bg-white border px-2 py-1 rounded text-slate-600 hover:bg-slate-50">Setores ({sectors.length})</button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                        <h4 className="font-bold mb-4">Setores: {building.description}</h4>
                        <div className="flex gap-2 mb-4">
                            <input className="border p-2 rounded flex-1 text-sm" placeholder="Novo setor..." value={newSector} onChange={e => setNewSector(e.target.value)} />
                            <button onClick={handleAdd} className="bg-green-600 text-white px-3 rounded hover:bg-green-700"><Plus size={16}/></button>
                        </div>
                        <ul className="max-h-60 overflow-y-auto space-y-1">
                            {sectors.map((s: Sector) => (
                                <li key={s.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                    {s.description}
                                    <button onClick={() => setSectors((prev: any) => prev.filter((x: any) => x.id !== s.id))} className="text-red-500"><Trash2 size={14}/></button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setIsOpen(false)} className="mt-4 w-full border p-2 rounded text-sm text-slate-600 hover:bg-slate-50">Fechar</button>
                    </div>
                </div>
            )}
        </>
    )
}

const TeamsManager = ({ teams, professionals, setTeams, setProfessionals }: any) => {
     const [newTeam, setNewTeam] = useState('');

     const handleAdd = () => {
        if(!newTeam) return;
        setTeams((prev: any) => [...prev, { id: Date.now().toString(), description: newTeam, status: 'Ativo' }]);
        setNewTeam('');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Equipes Técnicas</h3>
                <div className="flex gap-2 mb-4">
                    <input className="border p-2 rounded flex-1" placeholder="Nome da equipe..." value={newTeam} onChange={e => setNewTeam(e.target.value)} />
                    <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Adicionar</button>
                </div>
                 <div className="space-y-2">
                    {teams.map((t: Team) => (
                        <div key={t.id} className="border rounded p-3 flex justify-between items-center bg-slate-50">
                            <span className="font-medium">{t.description}</span>
                            <div className="flex gap-2">
                                <ProfessionalModal team={t} professionals={professionals.filter((p: Professional) => p.teamId === t.id)} setProfessionals={setProfessionals} />
                                <button onClick={() => setTeams((prev:any) => prev.filter((x:any) => x.id !== t.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ProfessionalModal = ({ team, professionals, setProfessionals }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '' });

    const handleAdd = () => {
        if(!form.name) return;
        setProfessionals((prev: any) => [...prev, { 
            id: Date.now().toString(), 
            teamId: team.id, 
            name: form.name,
            phone: form.phone,
            email: '',
            status: 'Ativo'
        }]);
        setForm({ name: '', phone: '' });
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-sm bg-white border px-2 py-1 rounded text-slate-600 hover:bg-slate-50">Membros ({professionals.length})</button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                        <h4 className="font-bold mb-4">Equipe: {team.description}</h4>
                        <div className="flex flex-col gap-2 mb-4">
                            <input className="border p-2 rounded text-sm" placeholder="Nome..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                            <input className="border p-2 rounded text-sm" placeholder="Telefone..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                            <button onClick={handleAdd} className="bg-green-600 text-white p-2 rounded hover:bg-green-700 text-sm">Adicionar Profissional</button>
                        </div>
                        <ul className="max-h-60 overflow-y-auto space-y-1">
                            {professionals.map((p: Professional) => (
                                <li key={p.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                    <div>
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-xs text-slate-500">{p.phone}</div>
                                    </div>
                                    <button onClick={() => setProfessionals((prev: any) => prev.filter((x: any) => x.id !== p.id))} className="text-red-500"><Trash2 size={14}/></button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setIsOpen(false)} className="mt-4 w-full border p-2 rounded text-sm text-slate-600 hover:bg-slate-50">Fechar</button>
                    </div>
                </div>
            )}
        </>
    )
}

const SimpleManager = ({ title, items, onUpdate }: any) => {
    const [newItem, setNewItem] = useState('');
    const handleAdd = () => {
        if(!newItem) return;
        onUpdate((prev: any) => [...prev, { id: Date.now().toString(), description: newItem, status: 'Ativo' }]);
        setNewItem('');
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="flex gap-2 mb-4">
                <input className="border p-2 rounded flex-1" placeholder="Descrição..." value={newItem} onChange={e => setNewItem(e.target.value)} />
                <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Adicionar</button>
            </div>
            <div className="space-y-2">
                {items.map((item: any) => (
                    <div key={item.id} className="border rounded p-3 flex justify-between items-center bg-slate-50">
                        <span>{item.description}</span>
                        <button onClick={() => onUpdate((prev: any) => prev.filter((x: any) => x.id !== item.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
        </div>
    )
}