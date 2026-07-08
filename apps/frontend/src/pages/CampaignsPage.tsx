import { useEffect, useState } from 'react';
import { Calendar, Check, Edit, Scroll, Swords, Trash2, X } from 'lucide-react';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { PixelInput } from '../components/ui/PixelInput';
import { PixelTextarea } from '../components/ui/PixelTextarea';
import { ApiError } from '../services/api';
import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from '../types/campaign';

interface CampaignsPageProps {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  onSelectCampaign: (campaign: Campaign) => void;
  onCreateCampaign: (input: CreateCampaignInput) => Promise<Campaign>;
  onUpdateCampaign: (id: string, input: UpdateCampaignInput) => Promise<Campaign>;
  onDeleteCampaign: (id: string) => Promise<void>;
  onRetry: () => Promise<void>;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function CampaignsPage({
  campaigns,
  selectedCampaign,
  isLoading,
  error,
  onSelectCampaign,
  onCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onRetry,
}: CampaignsPageProps) {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isEditing = editingCampaign !== null;

  useEffect(() => {
    if (editingCampaign) {
      setNome(editingCampaign.nome);
      setDescricao(editingCampaign.descricao ?? '');
    }
  }, [editingCampaign]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setEditingCampaign(null);
    setNome('');
    setDescricao('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !descricao.trim()) {
      showToast('⚠️ Preencha todos os campos, mestre!');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditing) {
        await onUpdateCampaign(editingCampaign.id, {
          nome: nome.trim(),
          descricao: descricao.trim(),
        });
        showToast('✅ Campanha atualizada!');
      } else {
        await onCreateCampaign({
          nome: nome.trim(),
          descricao: descricao.trim(),
        });
        showToast('✨ Campanha lendária registrada no grimório!');
      }

      resetForm();
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : isEditing
            ? 'Não foi possível atualizar a campanha.'
            : 'Não foi possível criar a campanha.';
      showToast(`⚠️ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (campaign: Campaign, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingCampaign(campaign);
    onSelectCampaign(campaign);
  };

  const handleDelete = async (campaign: Campaign, event: React.MouseEvent) => {
    event.stopPropagation();

    if (
      !window.confirm(
        `Excluir a campanha "${campaign.nome}"? Todos os dados vinculados (histórias, grimório, heróis) serão perdidos.`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(campaign.id);
      await onDeleteCampaign(campaign.id);
      if (editingCampaign?.id === campaign.id) {
        resetForm();
      }
      showToast('Campanha removida do grimório.');
    } catch (deleteError) {
      const message =
        deleteError instanceof ApiError
          ? deleteError.message
          : 'Não foi possível excluir a campanha.';
      showToast(`⚠️ ${message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="text-2xl">⚔️</span>
          <h1 className="pixel-title leading-loose sm:text-pixel-lg">MESTRE DOS MAGOS</h1>
          <span className="text-2xl">⚔️</span>
        </div>
        <p className="pixel-subtitle">— RPG MANAGER —</p>
        <p className="mt-4 font-sans text-base text-rpg-ink-dim">
          Selecione sua campanha ou forje uma nova aventura
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <PixelCard title={isEditing ? 'Editar Campanha' : 'Nova Campanha'} icon="📜">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PixelInput
              label="Nome da Campanha"
              placeholder="Ex: A Queda de Valoria"
              value={nome}
              onChange={e => setNome(e.target.value)}
              disabled={isSubmitting}
            />
            <PixelTextarea
              label="Descrição"
              placeholder="Descreva o mundo, vilões e objetivos dos heróis..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <PixelButton type="submit" variant="gold" fullWidth disabled={isSubmitting}>
                <span className="flex items-center justify-center gap-2">
                  <Swords size={14} />
                  {isSubmitting
                    ? isEditing
                      ? 'Salvando...'
                      : 'Forjando...'
                    : isEditing
                      ? 'Salvar alterações'
                      : 'Forjar Campanha'}
                </span>
              </PixelButton>
              {isEditing && (
                <PixelButton
                  type="button"
                  variant="ghost"
                  fullWidth
                  disabled={isSubmitting}
                  onClick={resetForm}
                >
                  <span className="flex items-center justify-center gap-2">
                    <X size={14} />
                    Cancelar
                  </span>
                </PixelButton>
              )}
            </div>
          </form>
        </PixelCard>

        <PixelCard title="Campanhas Ativas" icon="🏰">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <span className="text-4xl animate-float">🏰</span>
              <p className="font-sans text-base text-rpg-ink-dim">Carregando campanhas...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <span className="text-4xl opacity-60">⚠️</span>
              <p className="font-sans text-base text-rpg-ink-dim">{error}</p>
              <PixelButton type="button" variant="gold" onClick={() => void onRetry()}>
                Tentar novamente
              </PixelButton>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <span className="text-5xl opacity-40">🛡️</span>
              <p className="font-sans text-base text-rpg-ink-dim">Nenhuma campanha no grimório.</p>
              <p className="font-sans text-sm text-rpg-ink-faded">
                Use o pergaminho ao lado para iniciar sua jornada!
              </p>
            </div>
          ) : (
            <ul className="flex max-h-[480px] flex-col gap-3 overflow-y-auto pr-1">
              {campaigns.map((campaign, index) => {
                const isSelected = selectedCampaign?.id === campaign.id;
                const isBeingEdited = editingCampaign?.id === campaign.id;
                const isDeleting = deletingId === campaign.id;

                return (
                  <li key={campaign.id}>
                    <div
                      className={[
                        'overflow-hidden border-2 transition-all',
                        isSelected
                          ? 'border-rpg-forest bg-rpg-forest/10 shadow-pixel-dark'
                          : 'border-rpg-border bg-rpg-parchment hover:border-rpg-gold hover:shadow-pixel-gold',
                        isBeingEdited ? 'ring-2 ring-rpg-gold-dark' : '',
                      ].join(' ')}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectCampaign(campaign)}
                        disabled={isDeleting}
                        className="w-full p-4 text-left disabled:opacity-60"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Scroll
                              size={18}
                              className={isSelected ? 'text-rpg-forest' : 'text-rpg-ink-dark'}
                            />
                            <h3
                              className={[
                                'font-pixel text-pixel-xs leading-relaxed sm:text-pixel-sm',
                                isSelected ? 'text-rpg-ink-dark' : 'text-rpg-ink',
                              ].join(' ')}
                            >
                              {campaign.nome}
                            </h3>
                            {isSelected && <Check size={14} className="text-rpg-forest" />}
                          </div>
                          <span className="shrink-0 border border-rpg-border bg-rpg-panel px-2 py-0.5 font-sans text-xs text-rpg-ink-dim">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        {campaign.descricao && (
                          <p className="mb-3 font-sans text-sm leading-relaxed text-rpg-ink-dim">
                            {campaign.descricao}
                          </p>
                        )}
                        <div className="flex items-center gap-1 font-sans text-xs text-rpg-ink-faded">
                          <Calendar size={14} />
                          <span>{formatDate(campaign.criado_em)}</span>
                          {isSelected && (
                            <span className="ml-2 font-pixel text-pixel-xs text-rpg-forest">
                              • ATIVA
                            </span>
                          )}
                          {isBeingEdited && (
                            <span className="ml-2 font-pixel text-pixel-xs text-rpg-gold-dark">
                              • EDITANDO
                            </span>
                          )}
                        </div>
                      </button>

                      <div className="flex border-t-2 border-rpg-border">
                        <ActionButton
                          title="Editar"
                          onClick={e => handleEdit(campaign, e)}
                          disabled={isDeleting}
                          className="text-rpg-ink-dim hover:bg-rpg-gold/10"
                        >
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton
                          title="Excluir"
                          onClick={e => void handleDelete(campaign, e)}
                          disabled={isDeleting}
                          className="border-l-2 border-rpg-border text-rpg-hp hover:bg-rpg-hp/10"
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </PixelCard>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 border-2 border-rpg-border-dark bg-rpg-panel px-5 py-3 font-sans text-base text-rpg-ink-dark shadow-pixel-dark">
          {toast}
        </div>
      )}
    </>
  );
}

function ActionButton({
  title,
  onClick,
  disabled,
  className,
  children,
}: {
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        'flex flex-1 items-center justify-center py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
