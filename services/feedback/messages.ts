const ENCOURAGEMENT_MESSAGES = [
  'Bom trabalho. Uma etapa foi concluida.',
  'Voce avancou. Continue no seu ritmo.',
  'Mais um progresso concluido com sucesso.',
] as const;

type EncouragementOptions = {
  enabled: boolean;
  seed?: number;
};

type TransitionOptions = {
  enabled: boolean;
  nextPhase: 'focus' | 'break';
};

export function getEncouragementMessage({ enabled, seed = 0 }: EncouragementOptions) {
  if (!enabled) {
    return null;
  }

  return ENCOURAGEMENT_MESSAGES[Math.abs(seed) % ENCOURAGEMENT_MESSAGES.length];
}

export function getTaskCompletionMessage() {
  return 'Tarefa concluida com sucesso.';
}

export function getPomodoroCompletionMessage(phase: 'focus' | 'break') {
  return phase === 'focus'
    ? 'Sessao de foco concluida. Hora de fazer uma pausa.'
    : 'Pausa concluida. Voce pode voltar ao foco.';
}

export function getTransitionWarningMessage({ enabled, nextPhase }: TransitionOptions) {
  if (!enabled) {
    return null;
  }

  return nextPhase === 'break'
    ? 'A sessao atual termina em 1 minuto. Prepare-se para uma pausa curta.'
    : 'A sessao atual termina em 1 minuto. Prepare-se para voltar ao foco.';
}
