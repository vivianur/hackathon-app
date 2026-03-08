export const GUIDED_CHECKLIST_LABELS = [
  'Definir objetivo',
  'Executar etapa principal',
  'Revisar e concluir',
] as const;

export function getGuidedChecklistLabels() {
  return [...GUIDED_CHECKLIST_LABELS];
}
