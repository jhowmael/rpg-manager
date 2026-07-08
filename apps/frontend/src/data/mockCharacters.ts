import type { Character } from '../types/character';

export const MOCK_CHARACTERS: Character[] = [
  {
    id: 'ch-1',
    campanha_id: '1',
    nome: 'Malachar, o Lich',
    tipo: 'NPC',
    historia:
      'Antigo arquimago de Valoria, Malachar buscou a imortalidade há três séculos e foi banido pelos clérigos do templo solar.',
    o_que_sabe:
      'Conhece os túneis sob o templo, o ritual de ressurreição do exército das sombras e a localização das relíquias de Sunhart.',
    personalidade: 'Frio, calculista, fala em tom professoral. Despreza mortais, mas respeita coragem.',
    familia_relacoes: 'Aprendiz traído: o Arcebispo Aldric. Servo leal: a banshee Vaelistra.',
  },
  {
    id: 'ch-2',
    campanha_id: '1',
    nome: 'Thorn, o Ferreiro',
    tipo: 'NPC',
    historia:
      'Ferreiro da vila de Valoria. Forjou armas para a guarda real antes da queda da cidade.',
    o_que_sabe:
      'Sabe sobre passagens nas minas ao norte, sobre a qualidade das armas da guarnição e sobre o martelo encantado perdido.',
    personalidade: 'Pragmático, grosseiro mas honesto. Confia em quem paga bem ou salva sua forja.',
    familia_relacoes: 'Filha: Mira, aprendiz de ferreiro. Irmão: desaparecido nas minas.',
  },
  {
    id: 'ch-3',
    campanha_id: '1',
    nome: 'Old Mira, a Guia',
    tipo: 'NPC',
    historia:
      'Velha habitante do Pântano das Lágrimas. Dizem que ela viu a passagem secreta nas raízes da árvore anciã.',
    o_que_sabe:
      'Conhece atalhos no pântano, sinais dos Will-o\'wisps e a localização da árvore anciã.',
    personalidade: 'Misteriosa, fala em enigmas. Só ajuda quem traz moedas de prata ou uma boa história.',
    familia_relacoes: 'Sem família conhecida. Protege o pântano como se fosse sua filha.',
  },
  {
    id: 'ch-4',
    campanha_id: '1',
    nome: 'Goblins da Mina Norte',
    tipo: 'MOB',
    historia:
      'Tribo de goblins que ocupou os níveis superiores das minas abandonadas após a retirada dos mineiros.',
    o_que_sabe: 'Não falam muito — guardam o martelo de Thorn em um altar de sucata.',
    personalidade: 'Agressivos em bando, covardes sozinhos. O capitão hobgoblin lidera com brutalidade.',
    familia_relacoes: 'N/A — criaturas hostis.',
  },
  {
    id: 'ch-5',
    campanha_id: '1',
    nome: 'Cultistas do Templo',
    tipo: 'MOB',
    historia:
      'Fanáticos que serviram Malachar antes de sua queda. Ainda realizam rituais noturnos nas ruínas.',
    o_que_sabe: 'Carregam fragmentos do ritual. Um deles pode revelar a senha da porta do altar sob tortura ou persuasão.',
    personalidade: 'Fanáticos, cantam hinos em língua antiga durante o combate.',
    familia_relacoes: 'Célula liderada pelo Escriba Sombrio (resgatado na Torre do Sino).',
  },
];

export function getCharacterById(characters: Character[], id: string): Character | undefined {
  return characters.find(c => c.id === id);
}

export function getCharactersByCampaign(characters: Character[], campaignId: string): Character[] {
  return characters.filter(c => c.campanha_id === campaignId);
}

export const CHARACTER_DRAG_TYPE = 'application/rpg-character';

export interface CharacterDragPayload {
  characterId: string;
  nome: string;
  tipo: string;
}
