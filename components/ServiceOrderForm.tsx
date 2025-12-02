import React, { useState, useEffect } from 'react';
import { 
  ServiceOrder, Building, Sector, Team, Professional, Reason, 
  Priority, Status 
} from '../types';
import { analyzeMaintenanceRequest } from '../services/geminiService';
import { X, Sparkles, Loader2, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ServiceOrder;
  data: {
    buildings: Building[];
    sectors: Sector[];
    teams: Team[];
    professionals: Professional[];
    reasons: Reason[];
  };
  onSubmit: (order: ServiceOrder) => void;
}

export const ServiceOrderForm: React.FC<Props> = ({ isOpen, onClose, initialData, data, onSubmit }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<ServiceOrder>>(
    initialData || {
      priority: Priority.MEDIUM,
      status: Status.QUEUE,
      openingDate: new Date().toISOString(),
    }
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filtered lists based on dependencies
  const filteredSectors = data.sectors.filter(s => s.buildingId === formData.buildingId);
  const filteredProfessionals = data.professionals.filter(p => p.teamId === formData.teamId && p.status === 'Ativo');

  // Automation Logic
  useEffect(() => {
    // Auto-set Acceptance Date and Status when Professional is selected
    if (formData.professionalId && !formData.acceptanceDate) {
      setFormData(prev => ({
        ...prev,
        acceptanceDate: new Date().toISOString(),
        status: Status.IN_PROGRESS
      }));
    }
  }, [formData.professionalId]);

  useEffect(() => {
    // Auto-set Closing Date when Status is Executed
    if (formData.status === Status.EXECUTED && !formData.closingDate) {
      setFormData(prev => ({ ...prev, closingDate: new Date().toISOString() }));
    }
  }, [formData.status]);

  const handleAIAnalysis = async () => {
    if (!formData.description || !formData.buildingId) return;
    
    setIsAnalyzing(true);
    const building = data.buildings.find(b => b.id === formData.buildingId)?.description || '';
    const sector = data.sectors.find(s => s.id === formData.sectorId)?.description || '';
    const context = `${building} - ${sector}`;
    
    const diagnosis = await analyzeMaintenanceRequest(formData.description, context);
    setFormData(prev => ({ ...prev, aiDiagnosis: diagnosis }));
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.buildingId || !formData.sectorId || !formData.description || !formData.requesterName) return;

    const order: ServiceOrder = {
      ...formData as ServiceOrder,
      id: formData.id || `OS-${Date.now()}`,
    };
    onSubmit(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Ordem de Serviço' : 'Nova Solicitação'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Local e Solicitante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Solicitante *</label>
              <input 
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.requesterName || ''}
                onChange={e => setFormData({...formData, requesterName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ramal/Contato *</label>
              <input 
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.requesterRamal || ''}
                onChange={e => setFormData({...formData, requesterRamal: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prédio *</label>
              <select 
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.buildingId || ''}
                onChange={e => setFormData({...formData, buildingId: e.target.value, sectorId: ''})}
              >
                <option value="">Selecione...</option>
                {data.buildings.filter(b => b.status === 'Ativo').map(b => (
                  <option key={b.id} value={b.id}>{b.description}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Setor *</label>
              <select 
                required
                disabled={!formData.buildingId}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
                value={formData.sectorId || ''}
                onChange={e => setFormData({...formData, sectorId: e.target.value})}
              >
                <option value="">Selecione...</option>
                {filteredSectors.map(s => (
                  <option key={s.id} value={s.id}>{s.description}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Detalhes e IA */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-medium text-slate-700">Descrição do Problema *</label>
              <button
                type="button"
                onClick={handleAIAnalysis}
                disabled={!formData.description || !formData.buildingId || isAnalyzing}
                className="text-xs flex items-center gap-1.5 text-purple-600 font-medium hover:text-purple-700 disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />}
                Analisar com IA
              </button>
            </div>
            <textarea 
              required
              rows={3}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={formData.description || ''}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
            
            {/* AI Result Box */}
            {formData.aiDiagnosis && (
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg text-sm text-purple-800 animate-fade-in relative">
                 <div className="absolute top-2 right-2 text-purple-200"><Sparkles size={24} strokeWidth={1}/></div>
                 <strong className="block mb-1 font-semibold">Diagnóstico Inteligente:</strong>
                 <p className="whitespace-pre-line leading-relaxed">{formData.aiDiagnosis}</p>
              </div>
            )}
          </div>

          {/* Section 3: Classificação e Atribuição */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Equipe</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.teamId || ''}
                onChange={e => setFormData({...formData, teamId: e.target.value, professionalId: ''})}
              >
                <option value="">-- Nenhuma --</option>
                {data.teams.filter(t => t.status === 'Ativo').map(t => (
                  <option key={t.id} value={t.id}>{t.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Profissional</label>
              <select 
                disabled={!formData.teamId}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
                value={formData.professionalId || ''}
                onChange={e => setFormData({...formData, professionalId: e.target.value})}
              >
                <option value="">-- Selecione --</option>
                {filteredProfessionals.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Status e Encerramento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Atual</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as Status})}
              >
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {(formData.status === Status.WAITING || formData.status === Status.CANCELLED) && (
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
                    <select 
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={formData.reasonId || ''}
                        onChange={e => setFormData({...formData, reasonId: e.target.value})}
                    >
                        <option value="">Selecione um motivo...</option>
                        {data.reasons.map(r => <option key={r.id} value={r.id}>{r.description}</option>)}
                    </select>
                </div>
            )}
          </div>

        </form>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors">Cancelar</button>
            <button 
                onClick={handleSubmit} 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
                <Save size={18} /> Salvar OS
            </button>
        </div>
      </div>
    </div>
  );
};