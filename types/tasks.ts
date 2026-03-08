export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  checklist: ChecklistItem[];
  createdAt: number;
};
