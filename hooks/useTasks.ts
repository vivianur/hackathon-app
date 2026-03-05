import { STORAGE_KEYS } from '@/constants/storageKeys';
import { usePersistentState } from '@/hooks/usePersistentState';
import type { Task, TaskStatus } from '@/types';

export function useTasks() {
  const { state: tasks, setState: setTasks, ready } = usePersistentState<Task[]>(STORAGE_KEYS.tasks, []);

  const addTask = (title: string, description?: string) => {
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      description: description?.trim(),
      status: 'todo',
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

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return { tasks, ready, addTask, updateTask, updateTaskStatus, removeTask } as const;
}
