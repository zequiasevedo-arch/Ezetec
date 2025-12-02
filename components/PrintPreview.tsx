import React from 'react';
import { ServiceOrder, Building, Sector, Team, Professional, Priority } from '../types';
import { X, Printer } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orders: ServiceOrder[];
  data: {
    buildings: Building[];
    sectors: Sector[];
    teams: Team[];
    professionals: Professional[];
  };
}

export const PrintPreview: React.FC<Props> = ({ isOpen, onClose, orders, data }) => {
  if (!isOpen) return null;

  const isLandscape = orders.length === 2;

  const getBuildingName = (id: string) => data.buildings.find(b => b.id === id)?.description || 'N/A';
  const getSectorName = (id: string) => data.sectors.find(s => s.id === id)?.description || 'N/A';
  const getTeamName = (id?: string) => data.teams.find(t => t.id === id)?.description || '___';
  const getProfessionalName = (id?: string) => data.professionals.find(p => p.id === id)?.name || '___';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm print:bg-white print:p-0 print:block">
      
      {/* Container do Modal (Tela) */}
      <div className="bg-slate-100 w-full h-full md:w-[95vw] md:h-[90vh] flex flex-col rounded-xl overflow-hidden print:w-full print:h-full print:rounded-none print:bg-white">
        
        {/* Header do Modal (Não imprime) */}
        <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center print:hidden">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Printer size={20} /> Pré-visualização de Impressão
            </h2>
            <p className="text-sm text-slate-500">
              {orders.length} ordem(ns) selecionada(s). 
              {isLandscape ? ' Layout Paisagem (Lado a Lado) ativado.' : ' Layout Retrato padrão.'}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
              Fechar
            </button>
            <button 
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm"
            >
              <Printer size={18} /> Imprimir
            </button>
          </div>
        </div>

        {/* Área de Visualização / Impressão */}
        <div className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible bg-slate-100 print:bg-white">
          
          {/* Estilo Específico para Impressão */}
          <style>
            {`
              @media print {
                @page {
                  size: ${isLandscape ? 'landscape' : 'portrait'};
                  margin: 0.5cm;
                }
                body {
                  background: white;
                }
                .print-content {
                  width: 100% !important;
                  height: 100% !important;
                }
              }
            `}
          </style>

          <div className={`print-content mx-auto bg-white shadow-lg print:shadow-none p-8 print:p-0 min-h-screen print:min-h-0 ${isLandscape ? 'max-w-[1100px] print:max-w-full' : 'max-w-[800px] print:max-w-full'}`}>
            
            <div className={`grid gap-8 ${isLandscape ? 'grid-cols-2 print:grid-cols-2' : 'grid-cols-1'}`}>
              {orders.map((order) => (
                <div key={order.id} className="border-2 border-slate-800 p-6 flex flex-col gap-4 text-slate-900 print:break-inside-avoid h-full">
                  
                  {/* Cabeçalho da OS */}
                  <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                    <div>
                      <h1 className="text-xl font-black uppercase tracking-wider">Ordem de Serviço</h1>
                      <span className="text-sm font-medium text-slate-600">ManutTech Facilities</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">#{order.id.replace('OS-', '')}</div>
                      <div className="text-xs font-semibold uppercase bg-slate-200 px-2 py-0.5 rounded inline-block mt-1">
                        Prioridade: {order.priority}
                      </div>
                    </div>
                  </div>

                  {/* Informações Principais */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-xs font-bold uppercase text-slate-500">Data Abertura</span>
                      <div className="font-semibold">{new Date(order.openingDate).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase text-slate-500">Status</span>
                      <div className="font-semibold">{order.status}</div>
                    </div>
                    <div className="col-span-2">
                       <span className="block text-xs font-bold uppercase text-slate-500">Localização</span>
                       <div className="font-semibold border-b border-slate-300 pb-1">
                         {getBuildingName(order.buildingId)} — {getSectorName(order.sectorId)}
                       </div>
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase text-slate-500">Solicitante</span>
                      <div>{order.requesterName}</div>
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase text-slate-500">Ramal/Contato</span>
                      <div>{order.requesterRamal}</div>
                    </div>
                  </div>

                  {/* Descrição do Problema */}
                  <div className="border border-slate-300 rounded p-3 bg-slate-50">
                    <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Descrição do Problema</span>
                    <p className="text-sm leading-relaxed min-h-[3rem]">{order.description}</p>
                  </div>

                  {/* Diagnóstico IA (Se houver) */}
                  {order.aiDiagnosis && (
                    <div className="border border-slate-300 rounded p-3">
                        <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Diagnóstico Preliminar</span>
                        <p className="text-xs italic text-slate-700">{order.aiDiagnosis}</p>
                    </div>
                  )}

                  {/* Área Técnica */}
                  <div className="mt-2 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xs font-bold uppercase text-slate-500">Equipe</span>
                            <div className="border-b border-slate-400 h-6 pt-1 text-sm">{getTeamName(order.teamId)}</div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold uppercase text-slate-500">Técnico</span>
                            <div className="border-b border-slate-400 h-6 pt-1 text-sm">{getProfessionalName(order.professionalId)}</div>
                        </div>
                     </div>

                     {/* Parecer Técnico (Espaço para escrita) */}
                     <div>
                        <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Parecer Técnico / Solução</span>
                        <div className="border border-slate-300 rounded h-24 bg-white"></div>
                     </div>
                  </div>

                  {/* Assinaturas */}
                  <div className="mt-auto pt-8 grid grid-cols-2 gap-8 text-center">
                    <div>
                        <div className="border-t border-slate-800 pt-2 text-xs font-bold uppercase">Assinatura Solicitante</div>
                        <div className="text-[10px] text-slate-500">Data: ___/___/___</div>
                    </div>
                    <div>
                        <div className="border-t border-slate-800 pt-2 text-xs font-bold uppercase">Assinatura Técnico</div>
                        <div className="text-[10px] text-slate-500">Data: ___/___/___</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Rodapé da Página */}
            <div className="mt-8 text-center text-[10px] text-slate-400 print:hidden">
                Visualização gerada pelo sistema ManutTech OS.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
