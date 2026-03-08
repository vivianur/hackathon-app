import {
  getEncouragementMessage,
  getTaskCompletionMessage,
  getTransitionWarningMessage,
} from '@/services/feedback';

describe('feedback messages', () => {
  it('returns no encouragement message when the feature is disabled', () => {
    expect(getEncouragementMessage({ enabled: false, seed: 0 })).toBeNull();
  });

  it('returns a deterministic encouragement message when enabled', () => {
    expect(getEncouragementMessage({ enabled: true, seed: 0 })).toBe(
      'Bom trabalho. Uma etapa foi concluida.'
    );
  });

  it('returns a neutral task completion message', () => {
    expect(getTaskCompletionMessage()).toBe('Tarefa concluida com sucesso.');
  });

  it('returns no transition message when warnings are disabled', () => {
    expect(getTransitionWarningMessage({ enabled: false, nextPhase: 'break' })).toBeNull();
  });

  it('returns a transition message when warnings are enabled', () => {
    expect(getTransitionWarningMessage({ enabled: true, nextPhase: 'break' })).toBe(
      'A sessao atual termina em 1 minuto. Prepare-se para uma pausa curta.'
    );
  });
});
