export enum Priority {
  LOW = 'Baixo',
  MEDIUM = 'Médio',
  HIGH = 'Alto'
}

export enum Status {
  QUEUE = 'Na fila',
  WAITING = 'Em espera',
  IN_PROGRESS = 'Em andamento',
  EXECUTED = 'Executado',
  CANCELLED = 'Cancelada'
}

export interface Building {
  id: string;
  description: string;
  status: 'Ativo' | 'Inativo';
}

export interface Sector {
  id: string;
  buildingId: string;
  description: string;
}

export interface Team {
  id: string;
  description: string;
  status: 'Ativo' | 'Inativo';
}

export interface Professional {
  id: string;
  name: string;
  phone: string;
  email: string;
  teamId: string;
  status: 'Ativo' | 'Inativo';
}

export interface Reason {
  id: string;
  description: string;
  status: 'Ativo' | 'Inativo';
}

export interface StatusReference {
  id: string;
  description: string;
  status: 'Ativo' | 'Inativo';
}

export interface ServiceOrder {
  id: string;
  buildingId: string;
  sectorId: string;
  openingDate: string;
  acceptanceDate?: string;
  closingDate?: string;
  requesterName: string;
  requesterRamal: string;
  description: string;
  priority: Priority;
  teamId?: string;
  professionalId?: string;
  status: Status;
  reasonId?: string;
  aiDiagnosis?: string;
}