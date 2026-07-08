import type { MainStory, SideQuest } from '../types/history';

export const MOCK_MAIN_STORIES: MainStory[] = [
  {
    id: 'ms-1',
    campanha_id: '1',
    titulo: 'Capítulo I — O Despertar das Sombras',
    ordem: 1,
    conteudo: `<h2>Prólogo</h2><p>Na cidade de <strong>Valoria</strong>, os sinos tocaram três vezes ao anoitecer. O vilão <span data-character-trigger="" data-character-id="ch-1" data-character-nome="Malachar, o Lich" data-character-tipo="NPC"></span> despertava sob as ruínas do templo.</p><p>Passos ecoam no corredor: <span data-audio-trigger="" data-audio-id="passos" data-audio-category="sfx" data-audio-label="Passos"></span></p><ul><li>Os heróis são convocados pelo Arcebispo</li><li>Rumores falam do exército das sombras</li></ul>`,
  },
  {
    id: 'ms-2',
    campanha_id: '1',
    titulo: 'Capítulo II — A Travessia do Pântano',
    ordem: 2,
    conteudo: `<h2>O Caminho</h2><p>Para alcançar a fortaleza de Malachar, os aventureiros devem atravessar o <strong>Pântano das Lágrimas</strong>.</p><ol><li>Encontrar o guia local (NPC: Old Mira)</li><li>Evitar os Will-o'-wisps</li><li>Descobrir a passagem secreta nas raízes da árvore anciã</li></ol>`,
  },
];

export const MOCK_SIDE_QUESTS: SideQuest[] = [
  {
    id: 'sq-1',
    campanha_id: '1',
    titulo: 'O Artefato Perdido do Ferreiro',
    status: 'ATIVA',
    conteudo: `<p>O ferreiro <span data-character-trigger="" data-character-id="ch-2" data-character-nome="Thorn, o Ferreiro" data-character-tipo="NPC"></span> perdeu um martelo encantado nas minas ao norte, infestadas por <span data-character-trigger="" data-character-id="ch-4" data-character-nome="Goblins da Mina Norte" data-character-tipo="MOB"></span>.</p><p>Ao encontrar o tesouro: <span data-audio-trigger="" data-audio-id="coins" data-audio-category="sfx" data-audio-label="Moedas"></span></p><ul><li>Recompensa: espada +1</li><li>Inimigos: 4 goblins e 1 hobgoblin capitão</li></ul>`,
  },
  {
    id: 'sq-2',
    campanha_id: '1',
    titulo: 'A Taverna do Dragão Adormecido',
    status: 'INATIVA',
    conteudo: `<p>Uma side quest social na taverna local. Os jogadores podem juntar <strong>informações</strong> sobre Malachar conversando com NPCs.</p><ol><li>Bardo local conhece uma canção proibida</li><li>Guarda bêbado menciona túneis sob o castelo</li></ol>`,
  },
  {
    id: 'sq-3',
    campanha_id: '1',
    titulo: 'Resgate na Torre do Sino',
    status: 'CONCLUIDA',
    conteudo: `<p>Side quest concluída na sessão anterior. Os heróis resgataram o escriba capturado pelos cultistas.</p>`,
  },
];
