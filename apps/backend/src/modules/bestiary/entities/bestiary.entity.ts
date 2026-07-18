export class BestiaryEntry {
  id: string;
  campanha_id: string;
  nome: string;
  titulo?: string;
  raca?: string;
  classe?: string;
  tipo: string;
  historia?: string;
  caracteristicas?: string;
  o_que_sabe?: string;
  personalidade?: string[];
  familia_relacoes?: string;
  imagem_id?: string;
  vida_maxima?: number | null;
  ca?: number | null;
  atributos?: Record<string, number> | null;
  habilidades?: Array<{ id?: string; nome: string; descricao?: string }> | null;
}
