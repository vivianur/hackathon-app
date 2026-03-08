import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useTasks } from '@/hooks';

describe('useTasks', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('creates a task with a guided checklist when checklist labels are provided', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => {
      result.current.addTask('Estudar acessibilidade', 'Preparar entrega', [
        'Definir objetivo',
        'Executar etapa principal',
        'Revisar e concluir',
      ]);
    });

    expect(result.current.tasks[0].checklist).toHaveLength(3);
    expect(result.current.tasks[0].checklist.every((item) => item.done === false)).toBe(true);
  });

  it('toggles a checklist item without losing the task', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => {
      result.current.addTask('Organizar sprint', undefined, ['Definir objetivo']);
    });

    const createdTask = result.current.tasks[0];
    const checklistItem = createdTask.checklist[0];

    act(() => {
      result.current.toggleChecklistItem(createdTask.id, checklistItem.id);
    });

    expect(result.current.tasks[0].checklist[0].done).toBe(true);
  });
});
