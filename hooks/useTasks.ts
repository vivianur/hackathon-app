import { STORAGE_KEYS } from '@/constants/storageKeys';
import { usePersistentState } from '@/hooks/usePersistentState';
import type { Task, TaskStatus } from '@/types';

function normalizeTask(task: Task | (Omit<Task, 'checklist'> & { checklist?: Task['checklist'] })): Task {
  return {
    ...task,
    checklist: task.checklist ?? [],
  };
}

function createChecklistItem(label: string, index: number) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    label: label.trim(),
    done: false,
  };
}

export function useTasks() {
  const { state: tasks, setState: setTasks, ready } = usePersistentState<Task[]>(
    STORAGE_KEYS.tasks,
    [],
    {
      hydrate: (stored) => stored.map(normalizeTask),
    }
  );

  const addTask = (title: string, description?: string, checklistLabels: string[] = []) => {
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      description: description?.trim(),
      status: 'todo',
      checklist: checklistLabels
        .filter((label) => label.trim().length > 0)
        .map((label, index) => createChecklistItem(label, index)),
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
  };

  const updateTask = (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  };
 
  const updateTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              checklist: task.checklist.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : task
      )
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return {
    tasks,
    ready,
    addTask,
    updateTask,
    updateTaskStatus,
    toggleChecklistItem,
    removeTask,
  } as const;
}
