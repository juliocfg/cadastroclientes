export interface Customer {
  id?: string;
  nome: string;
  telefone: string;
  idade: number;
  rua: string;
  numero: string;
  complemento?: string;
  cidade: string;
  cep: string;
  email: string;
  createdAt?: any;
}

export type Page = 'dashboard' | 'report' | 'registration';