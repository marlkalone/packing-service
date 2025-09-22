export interface Dimensoes {
  altura: number;
  largura: number;
  comprimento: number;
}

export interface Produto {
  produto_id: string;
  dimensoes: Dimensoes;
}

export interface Caixa {
  id: string;
  altura: number;
  largura: number;
  comprimento: number;
  volume: number;
}

export interface CaixaEmUso {
  tipoCaixa: Caixa;
  produtos: Produto[];
  volumeOcupado: number;
}

export interface ResultadoCaixa {
  caixa_id: string | null;
  produtos: string[];
  observacao?: string;
}