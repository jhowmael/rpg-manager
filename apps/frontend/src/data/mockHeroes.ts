import type { Hero } from '../types/hero';

export const MOCK_HEROES: Hero[] = [
  {
    id: 'hero-1',
    campanha_id: '1',
    nome: 'Kaelen Voss',
    raca: 'Humano',
    classe: 'Paladino',
    historia:
      'Cavaleiro da ordem de Sunhart, jurou proteger Valoria após perder a família para as sombras de Malachar.',
  },
  {
    id: 'hero-2',
    campanha_id: '1',
    nome: 'Lyra Moonwhisper',
    raca: 'Elfo',
    classe: 'Mago (Wizard)',
    historia:
      'Estudiosa da torre arcana de Eldermere. Veio a Valoria pesquisar os sigilos do templo solar.',
  },
  {
    id: 'hero-3',
    campanha_id: '1',
    nome: 'Grimjaw Stonefist',
    raca: 'Anão',
    classe: 'Guerreiro',
    historia:
      'Ex-mineiro das profundezas do norte. Conhece os túneis melhor que qualquer mapa.',
  },
];
